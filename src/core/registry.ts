/**
 * Turns generated operations into MCP tool definitions and executes them.
 */
import type { Operation } from './types.js';
import type { AscHttpClient, Query } from './http.js';
import { OPERATIONS } from '../generated/operations.js';
import { BODY_SCHEMAS } from '../generated/body-schemas.js';
import { AscApiError } from './errors.js';
import { validateBody } from './validate.js';
import {
  augmentReportTableTool,
  isReportTableOperation,
  maybeParseReportTable,
  REPORT_TABLE_EXTRA_PARAMS,
} from './report-parsing.js';

export interface RegistryOptions {
  /**
   * Load exactly these operations (dotted names) and nothing else. Wins over
   * `domains`, which is why it exists: profiles carry a curated list, and
   * passing `domains: []` to mean "none" silently loaded the seven defaults
   * instead (an empty array has no length).
   */
  operations?: string[];
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
  /**
   * Operations (dotted names) exposed regardless of domain selection. Profiles
   * inject `apps.list`/`apps.get` here: nearly every call needs an app ID, so
   * a profile without them cannot start a conversation.
   */
  extraOperations?: string[];
  /**
   * Overrides the "not loaded here" remedy sentence for one operation. Profile
   * mode points at the sibling MCP server (`use the asc-monetization server`)
   * instead of the --domains flag, which is meaningless to a profile user.
   */
  missingToolHint?: (op: Operation) => string | undefined;
  /** Mutating calls stop after validation and return what WOULD have been sent. */
  dryRun?: boolean;
}

/**
 * Loaded when the caller doesn't ask for anything specific.
 *
 * The full spec is 982 operations, which costs well over 100k tokens of tool
 * definitions — more than most context windows can spare. This set covers the
 * everyday release, TestFlight, review and monetization workflows. Game Center
 * alone is 273 tools and is opt-in for that reason.
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
  /**
   * Shape of `structuredContent` for tools that return it (e.g. the
   * reviews-ai tools). Optional pass-through: unset for every tool that
   * still returns plain JSON text, as before.
   */
  outputSchema?: {
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
    properties[param] =
      param === 'id'
        ? // "Resource identifier." repeated this description on 783 tools for
          // no information a required string param named `id` doesn't already
          // carry — pure token cost. See task-7-report.md.
          { type: 'string' }
        : { type: 'string', description: `Path parameter "${param}".` };
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
    const schema = op.bodyRef ? BODY_SCHEMAS[op.bodyRef] : undefined;
    properties.body = schema
      ? {
          description: `JSON:API request body (Apple schema: ${op.bodyRef}).`,
          ...(schema as Record<string, unknown>),
        }
      : {
          // No resolvable schema in the spec — keep the generic shape hint.
          type: 'object',
          description:
            `JSON:API request body. Shape: {"data": {"type": "...", "attributes": {...}, ` +
            `"relationships": {...}}}.` +
            (op.bodyRef ? ` Apple schema: ${op.bodyRef}.` : ''),
        };
    if (op.method === 'POST' || op.method === 'PATCH') required.push('body');
  }

  // Pagination cursor for collection endpoints. Kept short deliberately: this
  // one description was repeated verbatim on all 240 `.list` tools — see
  // task-7-report.md for the measured cost.
  if (op.method === 'GET' && op.name.endsWith('.list')) {
    properties.next_url = {
      type: 'string',
      description: 'Absolute links.next URL from a previous response.',
    };
  }

  const tool: McpToolDefinition = {
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

  // Runtime-only augmentation for sales_reports.list / finance_reports.list —
  // see ./report-parsing.ts for why this happens here instead of in the
  // generator. A no-op for every other operation.
  return augmentReportTableTool(tool, op.name);
}

export class ToolRegistry {
  private readonly ops = new Map<string, Operation>();
  /** Public tool name (what Claude sends) -> operation. */
  private readonly byToolName = new Map<string, Operation>();

  constructor(private readonly options: RegistryOptions) {
    const explicit = options.operations ? new Set(options.operations) : undefined;
    const requested = options.domains?.length
      ? options.domains
      : [...DEFAULT_DOMAINS];

    const wantsAll = !explicit && requested.includes('all');
    const selected = new Set(requested);
    const extras = new Set(options.extraOperations ?? []);

    for (const op of OPERATIONS) {
      const wanted = explicit
        ? explicit.has(op.name) || extras.has(op.name)
        : wantsAll || selected.has(op.domain) || extras.has(op.name);
      if (wanted) this.add(op);
    }
  }

  /** Returns the public tool name if the operation was added, undefined if filtered out. */
  private add(op: Operation): string | undefined {
    if (op.deprecated && !this.options.includeDeprecated) return undefined;
    if (this.options.readOnly && !op.readOnly) return undefined;
    this.ops.set(op.name, op);

    const toolName = toolNameFor(op);
    const clash = this.byToolName.get(toolName);
    if (clash && clash.name !== op.name) {
      // Two distinct operations collapsed to the same 64-char name. Fail
      // loudly at startup rather than silently shadowing one of them.
      throw new Error(`Tool name collision on "${toolName}": ${clash.name} vs ${op.name}`);
    }
    this.byToolName.set(toolName, op);
    return toolName;
  }

  /**
   * Add operations after construction. MCP lets a server revise its tool list
   * mid-session (`notifications/tools/list_changed`), which is the only way a
   * profile could stay small and still reach the rest on demand. Returns the
   * public names actually added — already-loaded and filtered-out ones are
   * skipped, so the caller can report exactly what appeared.
   */
  loadOperations(names: string[]): string[] {
    const wanted = new Set(names.filter((n) => !this.ops.has(n)));
    if (!wanted.size) return [];
    const added: string[] = [];
    for (const op of OPERATIONS) {
      if (!wanted.has(op.name)) continue;
      const toolName = this.add(op);
      if (toolName) added.push(toolName);
    }
    return added;
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

  /** Domains at least one loaded operation belongs to. */
  loadedDomains(): string[] {
    return [...new Set([...this.ops.values()].map((o) => o.domain))].sort();
  }

  /**
   * Domains with no loaded operation at all. Only meaningful in domain mode: a
   * profile loads a curated slice, so a domain can be "loaded" here while most
   * of its tools are elsewhere.
   */
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
      // Deprecation is checked before "not loaded here": a profile now carries a
      // curated slice of several domains, so a domain being partly loaded says
      // nothing about one tool. Asking the domain first made every missing tool
      // look deprecated and sent users to a flag that could not help them.
      if (known.deprecated && !this.options.includeDeprecated) {
        throw new AscApiError(
          `Tool "${name}" is deprecated by Apple and hidden. Restart with --include-deprecated to use it.`,
          0
        );
      }
      throw new AscApiError(
        `Tool "${name}" is not loaded on this server. ` +
          `${this.options.missingToolHint?.(known) ??
            `Restart the server with --domains=${known.domain} (alongside your current domains) to use it.`}`,
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
      const paginated = await http.request(op.method, nextUrl, { accept: op.accept });
      return maybeParseReportTable(op.name, args, paginated);
    }

    let path = op.path;
    for (const param of op.pathParams) {
      const value = args[param];
      if (value === undefined || value === null || value === '') {
        throw new AscApiError(`Missing required parameter "${param}" for ${name}.`, 0);
      }
      path = path.replace(`{${param}}`, encodeURIComponent(String(value)));
    }

    // An argument nobody recognises used to be dropped without a word, and the
    // call would succeed on whatever was left. `apps.list` with a misspelled
    // `filter[bundleId]` returns the account's first app, cheerfully, and every
    // write that follows lands on the wrong app. Apple's own docs spell the
    // parameter with brackets, so a model that has read them types exactly the
    // name that gets discarded. Both forms are accepted now, and anything still
    // unrecognised stops the call instead of quietly changing its meaning.
    const knownArgs = new Set<string>([
      'body',
      ...op.pathParams,
      ...op.queryParams.flatMap((q) => [q.name, encodeParamName(q.name)]),
      // parse/max_rows are runtime-only additions (see ./report-parsing.ts),
      // not part of the generated operation's own query params.
      ...(isReportTableOperation(op.name) ? REPORT_TABLE_EXTRA_PARAMS : []),
    ]);
    const unknown = Object.keys(args).filter((k) => !knownArgs.has(k));
    if (unknown.length) {
      const accepted = op.queryParams.map((q) => encodeParamName(q.name));
      throw new AscApiError(
        `Unknown parameter${unknown.length === 1 ? '' : 's'} for ${name}: ${unknown.join(', ')}.` +
          (accepted.length
            ? ` This operation accepts: ${accepted.join(', ')}.`
            : ' This operation takes no query parameters.') +
          ` Apple's bracketed spelling (filter[x]) works too.`,
        0
      );
    }

    const query: Query = {};
    for (const q of op.queryParams) {
      // The model supplies args under the sanitized schema key; the Apple API
      // needs the real param name (e.g. `filter[platform]`). Apple's own
      // spelling is accepted as well — it is what the docs and the parameter
      // description both show.
      const value =
        args[encodeParamName(q.name)] ??
        args[q.name] ??
        this.options.paramDefaults?.[q.name];
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

    // Validate the body against the generated schema before anything leaves
    // the machine — a typo'd field or wrong enum comes back with a field path
    // instead of an opaque Apple 409.
    if (op.hasBody && op.bodyRef && args.body !== undefined) {
      const schema = BODY_SCHEMAS[op.bodyRef];
      if (schema) {
        const problems = validateBody(schema, args.body);
        if (problems.length) {
          throw new AscApiError(
            `Invalid request body for ${name} (nothing was sent to Apple):\n` +
              problems.map((p) => `  - ${p}`).join('\n'),
            0
          );
        }
      }
    }

    // Dry run: everything up to and including validation ran, so the caller
    // knows the request is well-formed — but nothing leaves the machine.
    if (this.options.dryRun && !op.readOnly) {
      return {
        dryRun: true,
        note: 'Dry-run mode: this write was validated but NOT sent to Apple.',
        wouldSend: {
          method: op.method,
          path,
          ...(Object.keys(query).length ? { query } : {}),
          ...(op.hasBody && args.body !== undefined ? { body: args.body } : {}),
        },
        risk: op.risk ?? 'low',
      };
    }

    const result = await http.request(op.method, path, {
      query: Object.keys(query).length ? query : undefined,
      body: op.hasBody ? args.body : undefined,
      accept: op.accept,
    });
    return maybeParseReportTable(op.name, args, result);
  }
}
