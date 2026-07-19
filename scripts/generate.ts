/**
 * Generates MCP tool definitions from Apple's official App Store Connect
 * OpenAPI specification.
 *
 * Run with `npm run generate`. The output is committed so that consumers of the
 * package don't need to run the generator themselves, and so that diffs against
 * a new Apple spec are reviewable.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { domainFor } from './domains.js';
import { describe } from './describe.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

interface OpenApiOperation {
  operationId: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  parameters?: OpenApiParameter[];
  requestBody?: { content?: Record<string, { schema?: any }> };
}

interface OpenApiParameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required?: boolean;
  description?: string;
  schema?: any;
}

interface GeneratedTool {
  name: string;
  domain: string;
  method: string;
  path: string;
  description: string;
  readOnly: boolean;
  deprecated: boolean;
  pathParams: string[];
  queryParams: Array<{ name: string; type: string; description: string; enum?: string[] }>;
  hasBody: boolean;
  bodyRef?: string;
}

const HTTP_METHODS = ['get', 'post', 'patch', 'delete', 'put'] as const;

/** `/v1/apps/{id}/builds` -> `apps` */
function rootResource(path: string): string {
  const segments = path.replace(/^\//, '').split('/');
  return /^v\d+$/.test(segments[0]) ? segments[1] : segments[0];
}

/** camelCase -> snake_case, preserving digit boundaries sensibly. */
function snake(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * Turns Apple's operationId into a stable, readable tool name.
 *
 *   apps_getCollection                    -> apps.list
 *   apps_getInstance                      -> apps.get
 *   apps_builds_getToManyRelated          -> apps.builds.list
 *   betaGroups_createInstance             -> beta_groups.create
 */
function toolNameFrom(operationId: string, method: string): string {
  const parts = operationId.split('_');
  const verb = parts.pop() ?? '';
  const resourcePath = parts.map(snake).join('.');

  const verbMap: Record<string, string> = {
    getCollection: 'list',
    getInstance: 'get',
    getToManyRelated: 'list',
    getToOneRelated: 'get',
    getToManyRelationship: 'list_ids',
    getToOneRelationship: 'get_id',
    createInstance: 'create',
    updateInstance: 'update',
    deleteInstance: 'delete',
    createToManyRelationship: 'add',
    deleteToManyRelationship: 'remove',
    replaceToManyRelationship: 'replace',
    updateToOneRelationship: 'set',
    getMetrics: 'metrics',
  };

  const suffix = verbMap[verb] ?? snake(verb);
  return `${resourcePath}.${suffix}`;
}

function schemaType(schema: any): string {
  if (!schema) return 'string';
  if (schema.type === 'array') return 'array';
  if (schema.type === 'integer' || schema.type === 'number') return 'number';
  if (schema.type === 'boolean') return 'boolean';
  return 'string';
}

function enumValues(schema: any): string[] | undefined {
  if (!schema) return undefined;
  if (Array.isArray(schema.enum)) return schema.enum;
  if (schema.type === 'array' && Array.isArray(schema.items?.enum)) {
    return schema.items.enum;
  }
  return undefined;
}

/**
 * Query parameter sets in this spec can run to hundreds of `fields[...]`
 * entries. Passing all of them to the model is pure token cost for almost no
 * benefit, so we keep the ones that change *which* records come back and drop
 * the ones that only change which columns come back.
 */
function isUsefulQueryParam(name: string): boolean {
  if (name.startsWith('fields[')) return false;
  if (name === 'include') return true;
  if (name.startsWith('filter[')) return true;
  if (name === 'limit' || name === 'sort' || name === 'cursor') return true;
  if (name.startsWith('limit[')) return false;
  if (name.startsWith('exists[')) return true;
  return true;
}


function main(): void {
  const specPath = resolve(ROOT, 'spec/openapi.json');
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));

  const tools: GeneratedTool[] = [];
  const seen = new Set<string>();

  for (const [path, pathItem] of Object.entries<any>(spec.paths ?? {})) {
    const sharedParams: OpenApiParameter[] = pathItem.parameters ?? [];

    for (const method of HTTP_METHODS) {
      const op: OpenApiOperation | undefined = pathItem[method];
      if (!op?.operationId) continue;

      const allParams = [...sharedParams, ...(op.parameters ?? [])];

      const pathParams = allParams
        .filter((p) => p.in === 'path')
        .map((p) => p.name);

      const queryParams = allParams
        .filter((p) => p.in === 'query' && isUsefulQueryParam(p.name))
        .map((p) => ({
          name: p.name,
          type: schemaType(p.schema),
          description: (p.description ?? '').replace(/\s+/g, ' ').slice(0, 200),
          enum: enumValues(p.schema)?.slice(0, 40),
        }));

      const bodySchema = op.requestBody?.content?.['application/json']?.schema;
      const bodyRef: string | undefined = bodySchema?.$ref
        ? String(bodySchema.$ref).split('/').pop()
        : undefined;

      let name = toolNameFrom(op.operationId, method);
      if (seen.has(name)) {
        // Extremely rare, but never silently drop an operation.
        name = `${name}_${method}`;
      }
      seen.add(name);

      tools.push({
        name,
        domain: domainFor(rootResource(path)),
        method: method.toUpperCase(),
        path,
        description: describe({
          operationId: op.operationId,
          method: method.toUpperCase(),
          path,
          toolName: name,
          deprecated: Boolean(op.deprecated),
        }),
        readOnly: method === 'get',
        deprecated: Boolean(op.deprecated),
        pathParams,
        queryParams,
        hasBody: Boolean(bodySchema),
        bodyRef,
      });
    }
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));

  const byDomain = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.domain] = (acc[t.domain] ?? 0) + 1;
    return acc;
  }, {});

  mkdirSync(resolve(ROOT, 'src/generated'), { recursive: true });

  const header = `// AUTO-GENERATED — do not edit by hand.
// Source: Apple App Store Connect OpenAPI specification v${spec.info?.version ?? 'unknown'}
// Regenerate with: npm run generate
`;

  writeFileSync(
    resolve(ROOT, 'src/generated/operations.ts'),
    `${header}
import type { Operation } from '../core/types.js';

export const SPEC_VERSION = ${JSON.stringify(spec.info?.version ?? 'unknown')};

export const OPERATIONS: Operation[] = ${JSON.stringify(tools, null, 2)};
`
  );

  // Emit domain descriptions alongside operations so the runtime has no
  // dependency on the scripts/ directory.
  const domainInfoSource = readFileSync(resolve(__dirname, 'domains.ts'), 'utf8');
  const descMatch = /export const DOMAIN_DESCRIPTIONS[^=]*=\s*\{([\s\S]*?)\n\};/.exec(
    domainInfoSource
  );
  writeFileSync(
    resolve(ROOT, 'src/generated/domain-info.ts'),
    `${header}
export const DOMAIN_DESCRIPTIONS: Record<string, string> = {${descMatch ? descMatch[1] : ''}
};
`
  );

  const report = [
    `Spec version:   ${spec.info?.version}`,
    `Paths:          ${Object.keys(spec.paths ?? {}).length}`,
    `Tools:          ${tools.length}`,
    `  read-only:    ${tools.filter((t) => t.readOnly).length}`,
    `  mutating:     ${tools.filter((t) => !t.readOnly).length}`,
    `  deprecated:   ${tools.filter((t) => t.deprecated).length}`,
    '',
    'By domain:',
    ...Object.entries(byDomain)
      .sort((a, b) => b[1] - a[1])
      .map(([d, c]) => `  ${d.padEnd(20)} ${c}`),
  ].join('\n');

  writeFileSync(resolve(ROOT, 'src/generated/REPORT.txt'), report + '\n');
  console.log(report);

  const unmapped = tools.filter((t) => t.domain === 'misc');
  if (unmapped.length) {
    const roots = [...new Set(unmapped.map((t) => rootResource(t.path)))];
    console.warn(
      `\n${unmapped.length} operations fell through to "misc" across ${roots.length} resources:\n  ` +
        roots.join('\n  ')
    );
  }
}

main();
