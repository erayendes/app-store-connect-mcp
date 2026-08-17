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
import { riskFor } from '../src/core/risk.js';
import { estimateTokens, measureSchema, sharedDefsCeiling } from './schema-defs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

interface OpenApiOperation {
  operationId: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  parameters?: OpenApiParameter[];
  requestBody?: { content?: Record<string, { schema?: any }> };
  responses?: Record<string, { content?: Record<string, unknown> }>;
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
  queryParams: Array<{
    name: string;
    type: string;
    description: string;
    enum?: string[];
    required?: boolean;
  }>;
  hasBody: boolean;
  bodyRef?: string;
  accept?: string;
  risk?: string;
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
function isUsefulQueryParam(name: string, primaryType?: string): boolean {
  // Sparse fieldsets, but only for the resource the endpoint is *about*.
  //
  // Every `fields[...]` used to be dropped, on the reasoning that it changes
  // which columns come back rather than which records, and that a single
  // operation can carry a hundred of them — one per type it can include. The
  // first half of that is true and the second half is why the rule existed;
  // together they traded a smaller tool schema for a larger response on every
  // single call, which is the wrong way round. Measured on one live endpoint:
  // 50 localizations are 264 KB as we ship them and 16 KB with
  // `fields[appStoreVersionLocalizations]=locale`. Same rows, 17× smaller.
  //
  // Keeping only the primary type is what makes this affordable: one extra
  // parameter per operation instead of a hundred. The rest stay dropped — a
  // model narrowing an *included* type is a rarer need than a model drowning
  // in the main one.
  if (name.startsWith('fields[')) return primaryType !== undefined && name === `fields[${primaryType}]`;
  if (name === 'include') return true;
  if (name.startsWith('filter[')) return true;
  if (name === 'limit' || name === 'sort' || name === 'cursor') return true;
  if (name.startsWith('limit[')) return false;
  if (name.startsWith('exists[')) return true;
  return true;
}

/**
 * Facts Apple's spec leaves out, added to the parameter description at
 * generation time so every operation carrying the parameter says the same
 * thing.
 *
 * A territory is the measured case. Apple documents `filter[territory]` as
 * "filter by id(s) of related 'territory'" and nothing more, while the ids it
 * wants are ISO-3166 alpha-3 — even though Apple's own base64 price-point ids
 * decode to two-letter codes, so the wrong form is the one a model sees in the
 * data. Sending `US` is not an error: the API answers 200 with an empty list,
 * which reads as "this country has no price". A live session reported "no US
 * price configured" for a subscription priced at $4.99.
 *
 * Adding a fact belongs here rather than in a lookup table: it costs one entry
 * for all 25 territory parameters across 23 operations, and it stops the
 * mistake instead of correcting it afterwards.
 */
const PARAM_NOTES: Array<[RegExp, string]> = [
  // Repeated on 304 operations, so every word is paid for 304 times. The enum
  // below it already lists what is allowed; this only has to say why to bother.
  [/^fields\[/, 'Return only these attributes. A full row set can exceed 200 KB.'],
  // The N+1 that a spec cannot warn about. Asking which of 50 localizations
  // carry screenshots is 50 follow-up calls without this and one call with it,
  // and the same shape recurs wherever a list is walked to reach its children.
  [
    /^include$/,
    'Pull related records in the same call. Without it, checking a relationship ' +
      'costs one extra call per row returned.',
  ],
  [
    /^filter\[(review)?[Tt]erritory\]$/,
    'Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: ' +
      '"US" is accepted and silently returns an empty list.',
  ],
  // 11 parameters, and the one an agent gets wrong most: everything else it
  // knows an app by is the bundle ID, which matches nothing here.
  [
    /^filter\[app\]$/,
    'The numeric Apple ID from apps__list, not the bundle ID. A bundle ID matches ' +
      'nothing and comes back as 200 with an empty list.',
  ],
];

/**
 * Apple words every relationship filter as "filter by id(s) of related 'x'" and
 * stops there, which says what the parameter is called and nothing about what
 * goes in it. They all fail the same silent way territory did: a plausible
 * wrong value is not rejected, it answers 200 with an empty list, and an agent
 * reads that as "there is none".
 *
 * So anything left on Apple's clause alone gets the shape of the answer and the
 * trap, once, generated rather than hand-written per parameter — there are 64
 * of them and Apple adds more with every spec.
 */
const RELATIONSHIP_FILTER = /id\(s\) of related '([^']+)'\s*$/i;

function annotateParam(name: string, description: string): string {
  const note = PARAM_NOTES.find(([pattern]) => pattern.test(name))?.[1];
  if (note) return description ? `${description} ${note}` : note;

  const relationship = RELATIONSHIP_FILTER.exec(description ?? '')?.[1];
  if (!relationship) return description;
  return (
    // `${relationship}` is Apple's own field name and is sometimes plural, so
    // it is quoted rather than dropped into an article — no singularising.
    `${description} Takes a '${relationship}' resource id, read from the call that lists ` +
    `them — not a name. A value that matches nothing returns 200 with an empty list rather ` +
    `than an error.`
  );
}


/**
 * Resolves a request-body component schema into a self-contained, simplified
 * JSON Schema the model can actually follow: $ref/allOf/oneOf expanded, enums
 * and required kept, `title` dropped, descriptions clipped. Objects get
 * `additionalProperties: false` so a typo'd field fails validation locally
 * instead of surfacing as an opaque Apple 409.
 */
function simplifyBodySchema(
  schemas: Record<string, any>,
  node: any,
  refStack: string[] = [],
  depth = 0
): any {
  if (!node || typeof node !== 'object' || depth > 14) return { type: 'object' };

  if (node.$ref) {
    const name = String(node.$ref).split('/').pop()!;
    // A cycle can't be inlined — fall back to a plain object at the loop point.
    if (refStack.includes(name)) return { type: 'object' };
    return simplifyBodySchema(schemas, schemas[name], [...refStack, name], depth + 1);
  }

  if (Array.isArray(node.allOf)) {
    const merged: any = {};
    for (const part of node.allOf) {
      const resolved = simplifyBodySchema(schemas, part, refStack, depth + 1);
      // Later parts win on scalar keys; properties/required merge.
      merged.properties = { ...merged.properties, ...resolved.properties };
      merged.required = [...new Set([...(merged.required ?? []), ...(resolved.required ?? [])])];
      for (const [k, v] of Object.entries(resolved)) {
        if (k !== 'properties' && k !== 'required') merged[k] = v;
      }
    }
    if (!merged.required?.length) delete merged.required;
    return merged;
  }

  const out: any = {};
  for (const [key, value] of Object.entries<any>(node)) {
    switch (key) {
      case 'title':
        break; // pure token cost
      case 'description':
        out.description = String(value).replace(/\s+/g, ' ').slice(0, 160);
        break;
      case 'properties': {
        const props: any = {};
        for (const [p, sub] of Object.entries<any>(value)) {
          props[p] = simplifyBodySchema(schemas, sub, refStack, depth + 1);
        }
        out.properties = props;
        break;
      }
      case 'items':
        out.items = simplifyBodySchema(schemas, value, refStack, depth + 1);
        break;
      case 'oneOf':
        out.oneOf = value.map((v: any) => simplifyBodySchema(schemas, v, refStack, depth + 1));
        break;
      default:
        // type, required, enum, nullable, format, deprecated, minimum, maximum,
        // pattern — copy through untouched.
        out[key] = value;
    }
  }
  // Closed-world objects: unknown fields are almost always typos.
  if (out.type === 'object' && out.properties && out.additionalProperties === undefined) {
    out.additionalProperties = false;
  }
  return out;
}

/**
 * GET relationship endpoints (`.../relationships/x`) return only resource IDs.
 * Their full-object twin (`.../x`) returns the same records with the IDs
 * included, so exposing both doubles the tool count for zero capability.
 * A relationship endpoint is dropped only when its twin really exists in the
 * spec — an orphan (none today, but Apple's spec changes) is kept.
 */
/**
 * The resource an endpoint is about, as Apple names it in `fields[...]`.
 *
 * It is the last path segment that names something: `/v1/apps` is about apps,
 * `/v1/apps/{id}` still is, and `/v1/appStoreVersions/{id}/appStoreVersion-
 * Localizations` is about the localizations. `/relationships/` segments are
 * skipped for the same reason the twin endpoints are dropped — they describe
 * the link, not the record.
 */
function primaryResourceType(path: string): string | undefined {
  const segments = path
    .split('/')
    .filter((s) => s && s !== 'relationships' && !s.startsWith('{') && !/^v\d+$/.test(s));
  return segments.pop();
}

function relationshipTwinPath(path: string, method: string, opId: string): string | null {
  if (method !== 'get') return null;
  if (!/_(getToManyRelationship|getToOneRelationship)$/.test(opId)) return null;
  return path.replace('/relationships/', '/');
}

/**
 * What the generated tools actually cost a model, and what `$defs` could do
 * about it.
 *
 * Printed rather than written to `src/generated/`: the numbers are produced by
 * the real serving path (`toMcpTool`), so they move when the SERVER changes,
 * not only when the spec does. Committing them would make the drift check
 * ("regenerate and diff src/generated/") fail on unrelated server edits.
 *
 * The generated modules are imported here, after they have been written, so a
 * first-ever run on a clean checkout does not fail on a missing module and the
 * numbers always describe the tools this run just produced.
 *
 * Every build pays for the per-tool measurement, which is cheap. The
 * per-domain table and the shared-block ceiling are opt-in: the ceiling costs
 * ~1.2s to compute and reports a number that is provably unreachable, so it is
 * diagnostics, not a build step.
 */
async function tokenReport(verbose: boolean): Promise<string> {
  const { OPERATIONS } = await import('../src/generated/operations.js');
  const { toMcpTool } = await import('../src/core/registry.js');

  const byDomain = new Map<string, Array<{ definition: unknown; inputSchema: unknown }>>();
  for (const op of OPERATIONS) {
    const definition = toMcpTool(op);
    const list = byDomain.get(op.domain) ?? [];
    list.push({ definition, inputSchema: definition.inputSchema });
    byDomain.set(op.domain, list);
  }

  const table: string[] = [
    '',
    `  ${'domain'.padEnd(20)}${'tools'.padStart(6)}${'inline'.padStart(9)}` +
      `${'$defs'.padStart(9)}${'saved'.padStart(8)}${'pct'.padStart(7)}${'hit'.padStart(5)}`,
  ];

  let inlineTotal = 0;
  let defsTotal = 0;
  let hitTotal = 0;
  let definitionTotal = 0;
  let ceilingTotal = 0;

  for (const [domain, entries] of [...byDomain.entries()].sort()) {
    let inline = 0;
    let withDefs = 0;
    let hit = 0;
    for (const { definition, inputSchema } of entries) {
      const sizes = measureSchema(inputSchema);
      inline += sizes.inlineTokens;
      withDefs += sizes.defsTokens;
      if (sizes.defCount) hit++;
      definitionTotal += estimateTokens(definition);
    }

    inlineTotal += inline;
    defsTotal += withDefs;
    hitTotal += hit;
    if (verbose) ceilingTotal += sharedDefsCeiling(entries.map((e) => e.inputSchema));

    const pct = inline ? ((inline - withDefs) / inline) * 100 : 0;
    table.push(
      `  ${domain.padEnd(20)}${String(entries.length).padStart(6)}${String(inline).padStart(9)}` +
        `${String(withDefs).padStart(9)}${String(inline - withDefs).padStart(8)}` +
        `${`${pct.toFixed(1)}%`.padStart(7)}${String(hit).padStart(5)}`
    );
  }

  const saved = inlineTotal - defsTotal;
  const toolCount = OPERATIONS.length;

  const lines: string[] = ['', 'Tool-definition tokens (JSON.stringify(schema).length / 4):'];
  if (verbose) lines.push(...table);
  lines.push(
    '',
    `  inputSchema, inlined:        ${inlineTotal} tok`,
    `  inputSchema, with $defs:     ${defsTotal} tok ` +
      `(-${saved}, ${((saved / inlineTotal) * 100).toFixed(2)}%, ${hitTotal}/${toolCount} tools affected)`,
    `  full tool definitions:       ${definitionTotal} tok ` +
      `(avg ${Math.round(definitionTotal / toolCount)}/tool — the TOKENS_PER_TOOL input)`
  );

  if (verbose) {
    lines.push(
      '',
      `  ceiling if one $defs block could be shared across a served tool list:`,
      `    -${ceilingTotal} tok (${((ceilingTotal / inlineTotal) * 100).toFixed(1)}%) — NOT achievable.`,
      `    ListToolsResult is { tools: Tool[] } and each inputSchema is its own`,
      `    JSON Schema resource, so "#/$defs/..." only ever resolves inside the`,
      `    tool carrying it. Hosting the block behind a URL is no escape either:`,
      `    SEP-2106 says clients MUST NOT auto-dereference network URIs.`
    );
  } else {
    lines.push(
      '',
      `  Per-domain table and the (unreachable) shared-$defs ceiling:`,
      `    TOKEN_REPORT=verbose npm run generate`
    );
  }

  return lines.join('\n');
}

function main(): void {
  const specPath = resolve(ROOT, 'spec/openapi.json');
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));

  const tools: GeneratedTool[] = [];
  const seen = new Set<string>();
  let droppedTwins = 0;
  /** bodyRef -> simplified, self-contained JSON Schema (deduped across ops). */
  const bodySchemas: Record<string, unknown> = {};
  const componentSchemas: Record<string, any> = spec.components?.schemas ?? {};

  for (const [path, pathItem] of Object.entries<any>(spec.paths ?? {})) {
    const sharedParams: OpenApiParameter[] = pathItem.parameters ?? [];

    for (const method of HTTP_METHODS) {
      const op: OpenApiOperation | undefined = pathItem[method];
      if (!op?.operationId) continue;

      const twinPath = relationshipTwinPath(path, method, op.operationId);
      if (twinPath && spec.paths?.[twinPath]?.get) {
        droppedTwins++;
        continue;
      }

      const allParams = [...sharedParams, ...(op.parameters ?? [])];

      const pathParams = allParams
        .filter((p) => p.in === 'path')
        .map((p) => p.name);

      const primaryType = primaryResourceType(path);
      const queryParams = allParams
        // A required parameter is never "not useful" — dropping one makes the
        // endpoint permanently uncallable.
        .filter((p) => p.in === 'query' && (p.required || isUsefulQueryParam(p.name, primaryType)))
        .map((p) => ({
          name: p.name,
          type: schemaType(p.schema),
          description: annotateParam(
            p.name,
            (p.description ?? '').replace(/\s+/g, ' ').slice(0, 200)
          ),
          enum: enumValues(p.schema)?.slice(0, 40),
          ...(p.required ? { required: true } : {}),
        }));

      const bodySchema = op.requestBody?.content?.['application/json']?.schema;
      const bodyRef: string | undefined = bodySchema?.$ref
        ? String(bodySchema.$ref).split('/').pop()
        : undefined;
      if (bodyRef && !bodySchemas[bodyRef]) {
        bodySchemas[bodyRef] = simplifyBodySchema(componentSchemas, bodySchema);
      }

      // Most endpoints serve JSON; a handful (sales/finance reports) only serve
      // gzipped TSV and reject a JSON Accept header with 406.
      const responseTypes = Object.keys(
        op.responses?.['200']?.content ?? op.responses?.['201']?.content ?? {}
      );
      const accept = responseTypes.some((t) => t.includes('json'))
        ? undefined
        : responseTypes[0];

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
        accept,
        ...(method !== 'get' ? { risk: riskFor(name, method.toUpperCase()) } : {}),
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

  // Request-body schemas, keyed by Apple's component name (Operation.bodyRef).
  // Kept in their own file so operations.ts stays reviewable in diffs.
  writeFileSync(
    resolve(ROOT, 'src/generated/body-schemas.ts'),
    `${header}
/** Simplified JSON Schemas for request bodies, keyed by Operation.bodyRef. */
export const BODY_SCHEMAS: Record<string, unknown> = ${JSON.stringify(bodySchemas, null, 1)};
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
    `  id-only twins dropped: ${droppedTwins}`,
    `  read-only:    ${tools.filter((t) => t.readOnly).length}`,
    `  mutating:     ${tools.filter((t) => !t.readOnly).length}`,
    `  deprecated:   ${tools.filter((t) => t.deprecated).length}`,
    `Risk levels:    ${Object.entries(
      tools.reduce<Record<string, number>>((acc, t) => {
        if (t.risk) acc[t.risk] = (acc[t.risk] ?? 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .map(([l, c]) => `${l}:${c}`)
      .join(' ')}`,
    `Body schemas:   ${Object.keys(bodySchemas).length} ` +
      `(${Math.round(JSON.stringify(bodySchemas).length / 1024)} KB resolved, ` +
      `avg ${Math.round(JSON.stringify(bodySchemas).length / Math.max(1, Object.keys(bodySchemas).length))} chars)`,
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

// Token accounting runs against the files main() just wrote, so it is a
// separate pass rather than part of the generation itself. `npm run generate`
// swallows extra argv (it chains two scripts), so the env var is the form that
// actually reaches here.
const verbose =
  process.argv.includes('--verbose') || process.env.TOKEN_REPORT === 'verbose';

tokenReport(verbose).then(
  (report) => console.log(report),
  (err) => {
    console.error(`\nToken report failed: ${(err as Error).message}`);
    process.exitCode = 1;
  }
);
