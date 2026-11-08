/** Apple 4.4.1 deprecations that the checked-in OpenAPI spec does not flag. */
export interface DeprecatedOverride { operationId: string; url: string; apiVersion: string }

export function validateDeprecatedOverrides(
  spec: { paths: Record<string, Record<string, any>> },
  overrides: DeprecatedOverride[]
): Set<string> {
  const byId = new Map<string, any>();
  for (const path of Object.values(spec.paths ?? {})) {
    for (const op of Object.values(path)) {
      if (op?.operationId) byId.set(op.operationId, op);
    }
  }
  const ids = new Set<string>();
  for (const override of overrides) {
    if (ids.has(override.operationId)) throw new Error(`Duplicate deprecated override: ${override.operationId}`);
    ids.add(override.operationId);
    const op = byId.get(override.operationId);
    if (!op) throw new Error(`Deprecated override absent from spec: ${override.operationId}`);
    if (op.deprecated) throw new Error(`Deprecated override now marked by Apple: ${override.operationId}`);
    if (!override.url || !override.apiVersion) throw new Error(`Incomplete deprecated override: ${override.operationId}`);
  }
  return ids;
}
