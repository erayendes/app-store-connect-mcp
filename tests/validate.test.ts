import { describe, it, expect, vi } from 'vitest';
import { validateBody } from '../src/core/validate.js';
import { BODY_SCHEMAS } from '../src/generated/body-schemas.js';
import { OPERATIONS } from '../src/generated/operations.js';
import { ToolRegistry, toMcpTool } from '../src/core/registry.js';
import { AscHttpClient } from '../src/core/http.js';
import { TokenProvider } from '../src/core/jwt.js';
import { generateKeyPairSync } from 'node:crypto';

const { privateKey } = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});
const creds = {
  keyId: 'ABCD123456',
  issuerId: '11111111-2222-3333-4444-555555555555',
  privateKey,
};

const versionCreate = BODY_SCHEMAS['AppStoreVersionCreateRequest'];

function goodBody() {
  return {
    data: {
      type: 'appStoreVersions',
      attributes: { versionString: '2.0', platform: 'IOS' },
      relationships: {
        app: { data: { type: 'apps', id: '6636549188' } },
      },
    },
  };
}

describe('validateBody (generated request-body schemas)', () => {
  it('accepts a well-formed JSON:API body', () => {
    expect(validateBody(versionCreate, goodBody())).toEqual([]);
  });

  it('reports a missing required field with its path', () => {
    const body = goodBody();
    delete (body.data.attributes as any).versionString;
    const errors = validateBody(versionCreate, body);
    expect(errors.some((e) => e.includes('body.data.attributes.versionString'))).toBe(true);
  });

  it('reports a wrong enum value with the allowed options', () => {
    const body = goodBody();
    (body.data.attributes as any).platform = 'ANDROID';
    const [error] = validateBody(versionCreate, body);
    expect(error).toContain('body.data.attributes.platform');
    expect(error).toContain('IOS');
  });

  it('reports a typo’d field name (closed-world objects)', () => {
    const body = goodBody();
    (body.data.attributes as any).verisonString = '2.0';
    const errors = validateBody(versionCreate, body);
    expect(errors.some((e) => e.includes('body.data.attributes.verisonString') && e.includes('unknown field'))).toBe(
      true
    );
  });

  it('allows null only where the schema is nullable', () => {
    const body = goodBody();
    (body.data.attributes as any).copyright = null; // nullable: true in the spec
    expect(validateBody(versionCreate, body)).toEqual([]);
    (body.data.attributes as any).versionString = null; // not nullable
    expect(validateBody(versionCreate, body).length).toBeGreaterThan(0);
  });

  it('reports array item errors with an index in the path', () => {
    const schema = {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
        },
      },
    };
    const errors = validateBody(schema, { data: [{ id: 'a' }, {}] });
    expect(errors[0]).toContain('body.data[1].id');
  });
});

describe('generated body schemas (invariants)', () => {
  it('covers every operation that takes a body — no write is a generic object', () => {
    for (const op of OPERATIONS) {
      if (!op.hasBody) continue;
      expect(op.bodyRef, `${op.name} has a body but no bodyRef`).toBeTruthy();
      expect(BODY_SCHEMAS[op.bodyRef!], `${op.name}: no schema for ${op.bodyRef}`).toBeTruthy();
    }
  });

  it('exposes the real schema in the tool definition', () => {
    const op = OPERATIONS.find((o) => o.name === 'app_store_versions.create')!;
    const body: any = toMcpTool(op).inputSchema.properties.body;
    expect(body.properties.data.properties.attributes.required).toContain('versionString');
    expect(body.properties.data.properties.type.enum).toEqual(['appStoreVersions']);
  });
});

describe('registry execute validation (bad body never reaches Apple)', () => {
  it('throws a field-path error and does not call fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    try {
      const registry = new ToolRegistry({ domains: ['versions'], readOnly: false, includeDeprecated: false });
      const http = new AscHttpClient(new TokenProvider(creds));
      const bad = goodBody();
      (bad.data.attributes as any).platform = 'ANDROID';

      await expect(
        registry.execute('app_store_versions__create', { body: bad }, http)
      ).rejects.toThrow(/body\.data\.attributes\.platform/);
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
