import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigError } from '../src/core/errors.js';

const readKeychainPassword = vi.fn();
vi.mock('../src/core/keychain.js', () => ({
  readKeychainPassword: (...args: unknown[]) => readKeychainPassword(...args),
}));

// Import after the mock is registered.
const { loadConfig } = await import('../src/core/config.js');

const BASE = {
  ASC_KEY_ID: 'ABCD123456',
  ASC_ISSUER_ID: '11111111-2222-3333-4444-555555555555',
};

let saved: NodeJS.ProcessEnv;

beforeEach(() => {
  saved = process.env;
  process.env = { ...BASE };
  readKeychainPassword.mockReset();
});

afterEach(() => {
  process.env = saved;
});

describe('loadConfig private key source', () => {
  it('uses the Keychain ref when no inline key is set', () => {
    process.env.ASC_PRIVATE_KEY_KEYCHAIN = 'asc-mcp/AuthKey_ABC';
    readKeychainPassword.mockReturnValue('PEM_FROM_KEYCHAIN');

    const config = loadConfig([]);

    expect(readKeychainPassword).toHaveBeenCalledWith('asc-mcp/AuthKey_ABC');
    expect(config.credentials.privateKey).toBe('PEM_FROM_KEYCHAIN');
  });

  it('prefers an inline key over the Keychain ref', () => {
    process.env.ASC_PRIVATE_KEY = 'INLINE_PEM';
    process.env.ASC_PRIVATE_KEY_KEYCHAIN = 'asc-mcp/AuthKey_ABC';

    const config = loadConfig([]);

    expect(readKeychainPassword).not.toHaveBeenCalled();
    expect(config.credentials.privateKey).toBe('INLINE_PEM');
  });

  it('keeps the path when only a path is set', () => {
    process.env.ASC_PRIVATE_KEY_PATH = '/abs/AuthKey.p8';

    const config = loadConfig([]);

    expect(readKeychainPassword).not.toHaveBeenCalled();
    expect(config.credentials.privateKeyPath).toBe('/abs/AuthKey.p8');
    expect(config.credentials.privateKey).toBeUndefined();
  });

  it('throws when no key source is provided', () => {
    expect(() => loadConfig([])).toThrow(ConfigError);
  });
});
