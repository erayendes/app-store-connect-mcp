import { createRequire } from 'node:module';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TokenProvider } from './core/jwt.js';
import { AscHttpClient } from './core/http.js';
import { ToolRegistry, DEFAULT_DOMAINS, type McpToolDefinition } from './core/registry.js';
import { AscApiError } from './core/errors.js';
import type { ServerConfig } from './core/config.js';
import { META_TOOLS, META_TOOL_NAMES, executeMetaTool } from './tools/meta.js';
import { REVIEWS_AI_TOOLS, REVIEWS_AI_TOOL_NAMES, executeReviewsAiTool } from './tools/reviews-ai.js';
import { STOREKIT_TOOLS, STOREKIT_TOOL_NAMES, StoreKitService } from './storekit/index.js';
import { SPEC_VERSION } from './generated/operations.js';

// Read from package.json at runtime so the banner can't drift from the published
// version. Not a JSON import: package.json sits outside tsconfig's rootDir.
export const VERSION: string = createRequire(import.meta.url)('../package.json').version;

export function createServer(config: ServerConfig): Server {
  const tokens = new TokenProvider(config.credentials);
  const http = new AscHttpClient(tokens);
  const registry = new ToolRegistry({
    domains: config.domains,
    readOnly: config.readOnly,
    includeDeprecated: config.includeDeprecated,
    paramDefaults: config.vendorNumber
      ? { 'filter[vendorNumber]': config.vendorNumber }
      : undefined,
  });

  const loadedDomains = config.domains?.length
    ? config.domains
    : [...DEFAULT_DOMAINS];

  // StoreKit tools are only offered when a bundle ID is configured, since the
  // App Store Server API is scoped to a single app.
  let storekit: StoreKitService | undefined;
  let storekitError: string | undefined;
  if (config.storekit) {
    try {
      storekit = new StoreKitService(config);
    } catch (err) {
      storekitError = (err as Error).message;
    }
  }

  const server = new Server(
    { name: 'app-store-connect-mcp', version: VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: McpToolDefinition[] = [...META_TOOLS, ...REVIEWS_AI_TOOLS, ...registry.listTools()];

    if (storekit) {
      const storekitTools = config.readOnly
        ? STOREKIT_TOOLS.filter((t) => t.annotations?.readOnlyHint)
        : STOREKIT_TOOLS;
      tools.push(...storekitTools);
    }

    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name } = request.params;
    const args = (request.params.arguments ?? {}) as Record<string, unknown>;

    try {
      let result: unknown;

      if (META_TOOL_NAMES.has(name)) {
        result = await executeMetaTool(name, args, {
          registry,
          http,
          tokens,
          readOnly: config.readOnly,
          loadedDomains,
        });
      } else if (REVIEWS_AI_TOOL_NAMES.has(name)) {
        result = await executeReviewsAiTool(name, args, { server, http });
      } else if (STOREKIT_TOOL_NAMES.has(name)) {
        if (!storekit) {
          throw new Error(
            storekitError ??
              'App Store Server API tools are unavailable. Set ASC_BUNDLE_ID to enable them.'
          );
        }
        if (config.readOnly) {
          const tool = STOREKIT_TOOLS.find((t) => t.name === name);
          if (tool && !tool.annotations?.readOnlyHint) {
            throw new Error(`"${name}" is blocked in read-only mode.`);
          }
        }
        result = await storekit.execute(name, args);
      } else {
        result = await registry.execute(name, args, http);
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result ?? { ok: true }, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: formatError(err, name) }],
        isError: true,
      };
    }
  });

  return server;
}

function formatError(err: unknown, toolName: string): string {
  if (err instanceof AscApiError) {
    const lines = [`${toolName} failed: ${err.summary}`];
    if (err.status) lines.push(`HTTP status: ${err.status}`);
    if (err.requestId) lines.push(`Apple request ID: ${err.requestId}`);
    return lines.join('\n');
  }
  return `${toolName} failed: ${(err as Error).message}`;
}

export { SPEC_VERSION };
