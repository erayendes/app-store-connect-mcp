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

function describeOperation(op: Operation): string {
  // The endpoint is appended so the model can reason about REST semantics
  // (and so a human reading the tool list can cross-reference Apple's docs).
  return `${op.description} [${op.method} ${op.path}]`;
}

export function toMcpTool(op: Operation): McpToolDefinition {
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
    properties[q.name] = schema;
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
    name: encodeToolName(op.name),
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
    }
  }

  get size(): number {
    return this.ops.size;
  }

  listTools(): McpToolDefinition[] {
    return [...this.ops.values()].map(toMcpTool);
  }

  get(name: string): Operation | undefined {
    return this.ops.get(decodeToolName(name));
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
      throw new AscApiError(`Unknown tool: ${name}`, 0);
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
      return http.request(op.method, nextUrl);
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
      const value = args[q.name];
      if (value === undefined || value === null || value === '') continue;
      query[q.name] = value as Query[string];
    }

    return http.request(op.method, path, {
      query: Object.keys(query).length ? query : undefined,
      body: op.hasBody ? args.body : undefined,
    });
  }
}
