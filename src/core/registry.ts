/**
 * Turns generated operations into MCP tool definitions and executes them.
 */
import type { Operation } from './types.js';
import type { AscHttpClient, Query } from './http.js';
import { OPERATIONS } from '../generated/operations.js';
import { AscApiError } from './errors.js';

export interface RegistryOptions {
  /** Restrict to these domains. Undefined means the default working set. */
  domains?: string[];
  readOnly: boolean;
  includeDeprecated: boolean;
  /**
   * Fallback values for required query params, keyed by Apple's parameter name.
   * Lets a caller configure `ASC_VENDOR_NUMBER` once instead of repeating it on
   * every sales and finance report call.
   */
  paramDefaults?: Record<string, string>;
}

/**
 * Loaded when the caller doesn't ask for anything specific.
 *
 * The full spec is 1,263 operations, which costs well over 100k tokens of tool
 * definitions — more than most context windows can spare. This set covers the
 * everyday release, TestFlight, review and monetization workflows. Game Center
 * alone is 337 tools and is opt-in for that reason.
 */
export const DEFAULT_DOMAINS = [
  'meta',
  'apps',
  'versions',
  'builds',
  'testflight',
  'reviews',
  'analytics',
] as const;

export const ALL_DOMAINS = [...new Set(OPERATIONS.map((o) => o.domain))].sort();

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  };
}

/** MCP tool names must match ^[a-zA-Z0-9_-]{1,128}$ — dots are not allowed. */
export function encodeToolName(name: string): string {
  return name.replace(/\./g, '__');
}

export function decodeToolName(name: string): string {
  return name.replace(/__/g, '.');
}

/**
 * The Anthropic Messages API is stricter than the MCP spec: tool names must
 * match ^[a-zA-Z0-9_.-]{1,64}$. The MCP spec allows up to 128 chars, so deeply
 * nested resource names like
 * `app_store_version_experiment_treatments__..._localizations__list_ids` (103
 * chars) pass MCP validation but make Claude reject the ENTIRE request with a
 * 400 — every tool in the batch becomes uncallable, not just the long one.
 *
 * Names over 64 chars are truncated and suffixed with a short deterministic
 * hash of the full name to preserve uniqueness. The registry keeps the
 * reverse map (display name -> operation) so dispatch still works.
 */
const MAX_TOOL_NAME = 64;

function hashToolName(name: string): string {
  let h = 5381;
  for (let i = 0; i < name.length; i++) {
    h = ((h * 33) ^ name.charCodeAt(i)) >>> 0;
  }
  return h.toString(36).padStart(7, '0').slice(0, 6);
}

export function shortenToolName(name: string): string {
  if (name.length <= MAX_TOOL_NAME) return name;
  const suffix = '_' + hashToolName(name);
  return name.slice(0, MAX_TOOL_NAME - suffix.length) + suffix;
}

/** The public tool name Claude sees: MCP-safe and within the API's 64-char cap. */
export function toolNameFor(op: { name: string }): string {
  return shortenToolName(encodeToolName(op.name));
}

/**
 * JSON Schema property keys sent to the Anthropic API must match
 * ^[a-zA-Z0-9_.-]{1,64}$. Apple query params like `filter[platform]` or
 * `fields[apps]` contain brackets, which the API rejects (400) for the whole
 * request. We expose a sanitized key in the schema and map it back to the real
 * Apple param name at execution time.
 */
export function encodeParamName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]+/g, '_').replace(/_+$/, '');
}

function describeOperation(op: Operation): string {
  // The endpoint is appended so the model can reason about REST semantics
  // (and so a human reading the tool list can cross-reference Apple's docs).
  return `${op.description} [${op.method} ${op.path}]`;
}

export function toMcpTool(
  op: Operation,
  paramDefaults?: Record<string, string>
): McpToolDefinition {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const param of op.pathParams) {
    properties[param] = {
      type: 'string',
      description:
        param === 'id'
          ? 'Resource identifier.'
          : `Path parameter "${param}".`,
    };
    required.push(param);
  }

  for (const q of op.queryParams) {
    const schema: Record<string, unknown> = {
      type: q.type === 'array' ? 'array' : q.type,
      description: q.description || `Query parameter "${q.name}".`,
    };
    if (q.type === 'array') schema.items = { type: 'string' };
    if (q.enum?.length) {
      if (q.type === 'array') {
        (schema.items as Record<string, unknown>).enum = q.enum;
      } else {
        schema.enum = q.enum;
      }
    }
    // A server-configured default covers the param, so don't force the model to
    // invent a value it has no way of knowing (e.g. the vendor number).
    const defaulted = paramDefaults?.[q.name];
    if (defaulted) {
      schema.description = `${schema.description} Defaults to the server's configured value.`;
    } else if (q.required) {
      required.push(encodeParamName(q.name));
    }

    properties[encodeParamName(q.name)] = schema;
  }

  if (op.hasBody) {
    properties.body = {
      type: 'object',
      description:
        `JSON:API request body. Shape: {"data": {"type": "...", "attributes": {...}, ` +
        `"relationships": {...}}}.` +
        (op.bodyRef ? ` Apple schema: ${op.bodyRef}.` : ''),
    };
    if (op.method === 'POST' || op.method === 'PATCH') required.push('body');
  }

  // Pagination cursor for collection endpoints.
  if (op.method === 'GET' && op.name.endsWith('.list')) {
    properties.next_url = {
      type: 'string',
      description:
        'Absolute `links.next` URL from a previous response, to fetch the next page. ' +
        'When set, all other parameters are ignored.',
    };
  }

  return {
    name: toolNameFor(op),
    description: describeOperation(op),
    inputSchema: {
      type: 'object',
      properties,
      ...(required.length ? { required } : {}),
    },
    annotations: {
      readOnlyHint: op.readOnly,
      destructiveHint: op.method === 'DELETE',
      idempotentHint: op.method === 'GET' || op.method === 'PATCH' || op.method === 'DELETE',
    },
  };
}

export class ToolRegistry {
  private readonly ops = new Map<string, Operation>();
  /** Public tool name (what Claude sends) -> operation. */
  private readonly byToolName = new Map<string, Operation>();

  constructor(private readonly options: RegistryOptions) {
    const requested = options.domains?.length
      ? options.domains
      : [...DEFAULT_DOMAINS];

    const wantsAll = requested.includes('all');
    const selected = new Set(requested);

    for (const op of OPERATIONS) {
      if (!wantsAll && !selected.has(op.domain)) continue;
      if (op.deprecated && !options.includeDeprecated) continue;
      if (options.readOnly && !op.readOnly) continue;
      this.ops.set(op.name, op);

      const toolName = toolNameFor(op);
      const clash = this.byToolName.get(toolName);
      if (clash && clash.name !== op.name) {
        // Two distinct operations collapsed to the same 64-char name. Fail
        // loudly at startup rather than silently shadowing one of them.
        throw new Error(
          `Tool name collision on "${toolName}": ${clash.name} vs ${op.name}`
        );
      }
      this.byToolName.set(toolName, op);
    }
  }

  get size(): number {
    return this.ops.size;
  }

  listTools(): McpToolDefinition[] {
    return [...this.ops.values()].map((op) => toMcpTool(op, this.options.paramDefaults));
  }

  get(name: string): Operation | undefined {
    // Prefer the display-name map (handles shortened names); fall back to the
    // dotted/encoded form for callers that pass the raw operation name.
    return this.byToolName.get(name) ?? this.ops.get(decodeToolName(name));
  }

  /** Domains that exist in the spec but are not currently loaded. */
  unloadedDomains(): string[] {
    const loaded = new Set([...this.ops.values()].map((o) => o.domain));
    return ALL_DOMAINS.filter((d) => !loaded.has(d));
  }

  async execute(
    name: string,
    args: Record<string, unknown>,
    http: AscHttpClient
  ): Promise<unknown> {
    const op = this.get(name);
    if (!op) {
      // A missing tool has three very different causes and the caller cannot
      // tell them apart. Each one points at a different fix.
      const known = OPERATIONS.find((o) => toolNameFor(o) === name || o.name === decodeToolName(name));
      if (!known) throw new AscApiError(`Unknown tool: ${name}`, 0);

      if (this.options.readOnly && !known.readOnly) {
        throw new AscApiError(
          `Tool "${name}" mutates App Store Connect and the server is running in read-only mode. ` +
            `Restart without --read-only to use it.`,
          0
        );
      }
      if (this.unloadedDomains().includes(known.domain)) {
        throw new AscApiError(
          `Tool "${name}" exists in the "${known.domain}" domain, which is not loaded. ` +
            `Restart the server with --domains=${known.domain} (alongside your current domains) to use it.`,
          0
        );
      }
      throw new AscApiError(
        `Tool "${name}" is deprecated by Apple and hidden. Restart with --include-deprecated to use it.`,
        0
      );
    }

    if (this.options.readOnly && !op.readOnly) {
      throw new AscApiError(
        `Tool "${name}" mutates App Store Connect and the server is running in read-only mode.`,
        0
      );
    }

    // Pagination shortcut: follow the cursor Apple gave us verbatim.
    const nextUrl = args.next_url;
    if (typeof nextUrl === 'string' && nextUrl) {
      return http.request(op.method, nextUrl, { accept: op.accept });
    }

    let path = op.path;
    for (const param of op.pathParams) {
      const value = args[param];
      if (value === undefined || value === null || value === '') {
        throw new AscApiError(`Missing required parameter "${param}" for ${name}.`, 0);
      }
      path = path.replace(`{${param}}`, encodeURIComponent(String(value)));
    }

    const query: Query = {};
    for (const q of op.queryParams) {
      // The model supplies args under the sanitized schema key; the Apple API
      // needs the real param name (e.g. `filter[platform]`).
      const value =
        args[encodeParamName(q.name)] ?? this.options.paramDefaults?.[q.name];
      if (value === undefined || value === null || value === '') {
        // Apple answers 400 for these anyway; say so in terms the caller can act on.
        if (q.required) {
          throw new AscApiError(
            `Missing required parameter "${encodeParamName(q.name)}" (Apple: "${q.name}") for ${name}.`,
            0
          );
        }
        continue;
      }
      query[q.name] = value as Query[string];
    }

    return http.request(op.method, path, {
      query: Object.keys(query).length ? query : undefined,
      body: op.hasBody ? args.body : undefined,
      accept: op.accept,
    });
  }
}
