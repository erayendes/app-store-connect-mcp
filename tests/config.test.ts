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

describe('loadConfig confirmWrites', () => {
  beforeEach(() => {
    process.env.ASC_PRIVATE_KEY = 'INLINE_PEM';
  });

  it('is off by default', () => {
    expect(loadConfig([]).confirmWrites).toBe(false);
  });

  it('is enabled by ASC_CONFIRM_WRITES=1', () => {
    process.env.ASC_CONFIRM_WRITES = '1';
    expect(loadConfig([]).confirmWrites).toBe(true);
  });

  it('is enabled by the --confirm flag', () => {
    expect(loadConfig(['--confirm']).confirmWrites).toBe(true);
  });

  it('leaves --no-confirm from an older config as a harmless no-op', () => {
    expect(loadConfig(['--no-confirm']).confirmWrites).toBe(false);
  });
});

describe('loadConfig rateLimit', () => {
  beforeEach(() => {
    process.env.ASC_PRIVATE_KEY = 'INLINE_PEM';
  });

  it('is unset by default, so the limiter keeps Apple’s ceiling', () => {
    expect(loadConfig([]).rateLimit).toBeUndefined();
  });

  it('carries either window through on its own', () => {
    process.env.ASC_RATE_LIMIT_PER_HOUR = '1200';
    expect(loadConfig([]).rateLimit).toEqual({
      requestsPerHour: 1200,
      requestsPerMinute: undefined,
    });
  });

  // A zero would stall every request forever; a typo would do it silently.
  it('ignores values that are not a positive number', () => {
    process.env.ASC_RATE_LIMIT_PER_HOUR = '0';
    process.env.ASC_RATE_LIMIT_PER_MINUTE = 'lots';
    expect(loadConfig([]).rateLimit).toBeUndefined();
  });
});
