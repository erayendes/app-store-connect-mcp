/**
 * Minimal JSON Schema validator for generated request-body schemas.
 *
 * Not a general validator — it covers exactly the keyword set the generator
 * emits from Apple's spec (type, properties, required, additionalProperties,
 * items, enum, nullable, oneOf, minimum/maximum), which keeps it dependency-free
 * and small. Errors carry the field path so a bad write is caught with a
 * pointable message before it ever reaches Apple.
 */

interface Schema {
  type?: string;
  nullable?: boolean;
  enum?: unknown[];
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: boolean;
  items?: Schema;
  oneOf?: Schema[];
  minimum?: number;
  maximum?: number;
}

const MAX_ERRORS = 10;

export function validateBody(schema: unknown, value: unknown): string[] {
  const errors: string[] = [];
  walk(schema as Schema, value, 'body', errors);
  return errors;
}

function typeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function walk(schema: Schema | undefined, value: unknown, path: string, errors: string[]): void {
  if (!schema || errors.length >= MAX_ERRORS) return;

  if (value === null || value === undefined) {
    // `required` on the parent catches missing fields; here null is only an
    // error when the schema forbids it.
    if (value === null && !schema.nullable) {
      errors.push(`${path}: null is not allowed here`);
    }
    return;
  }

  if (schema.oneOf) {
    // Valid when any branch accepts the value; report compactly otherwise.
    const branchFails = schema.oneOf.map((branch) => {
      const branchErrors: string[] = [];
      walk(branch, value, path, branchErrors);
      return branchErrors;
    });
    if (!branchFails.some((f) => f.length === 0)) {
      errors.push(`${path}: matches none of the ${schema.oneOf.length} allowed variants`);
    }
    return;
  }

  const actual = typeOf(value);
  if (schema.type) {
    const expected = schema.type === 'integer' ? 'number' : schema.type;
    if (actual !== expected) {
      errors.push(`${path}: expected ${schema.type}, got ${actual}`);
      return; // structural checks below would only cascade
    }
    if (schema.type === 'integer' && !Number.isInteger(value)) {
      errors.push(`${path}: expected an integer`);
      return;
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    const options = schema.enum.map(String).join(' | ');
    errors.push(`${path}: "${String(value)}" is not one of ${options}`);
    return;
  }

  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path}: ${value} is below the minimum of ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path}: ${value} is above the maximum of ${schema.maximum}`);
    }
    return;
  }

  if (actual === 'array') {
    (value as unknown[]).forEach((item, i) =>
      walk(schema.items, item, `${path}[${i}]`, errors)
    );
    return;
  }

  if (actual === 'object' && schema.properties) {
    const obj = value as Record<string, unknown>;

    for (const key of schema.required ?? []) {
      if (obj[key] === undefined) {
        errors.push(`${path}.${key}: required field is missing`);
      }
    }

    for (const [key, sub] of Object.entries(obj)) {
      const propSchema = schema.properties[key];
      if (!propSchema) {
        if (schema.additionalProperties === false) {
          const known = Object.keys(schema.properties).join(', ');
          errors.push(`${path}.${key}: unknown field (known fields: ${known})`);
        }
        continue;
      }
      if (sub !== undefined) walk(propSchema, sub, `${path}.${key}`, errors);
    }
  }
}
