import { describe, it, expect, vi, afterEach } from 'vitest';
import { readKeychainPassword } from '../src/core/keychain.js';
import { ConfigError } from '../src/core/errors.js';

const realPlatform = process.platform;

function setPlatform(value: string): void {
  Object.defineProperty(process, 'platform', { value, configurable: true });
}

afterEach(() => {
  setPlatform(realPlatform);
  vi.restoreAllMocks();
});

describe('readKeychainPassword', () => {
  it('reads the password and passes service/account to the security CLI', () => {
    setPlatform('darwin');
    const exec = vi.fn().mockReturnValue('-----BEGIN PRIVATE KEY-----\nMIG...\n');
    const pem = readKeychainPassword('asc-mcp/AuthKey_ABC123', exec);

    expect(pem).toBe('-----BEGIN PRIVATE KEY-----\nMIG...');
    expect(exec).toHaveBeenCalledWith(
      'security',
      ['find-generic-password', '-s', 'asc-mcp', '-a', 'AuthKey_ABC123', '-w'],
      { encoding: 'utf8' }
    );
  });

  it('splits only on the first slash so accounts may contain slashes', () => {
    setPlatform('darwin');
    const exec = vi.fn().mockReturnValue('pem');
    readKeychainPassword('svc/team/AuthKey_ABC123', exec);

    expect(exec).toHaveBeenCalledWith(
      'security',
      ['find-generic-password', '-s', 'svc', '-a', 'team/AuthKey_ABC123', '-w'],
      { encoding: 'utf8' }
    );
  });

  it('throws ConfigError when the ref has no slash', () => {
    setPlatform('darwin');
    expect(() => readKeychainPassword('no-separator', vi.fn())).toThrow(ConfigError);
  });

  it('throws ConfigError when service or account is empty', () => {
    setPlatform('darwin');
    expect(() => readKeychainPassword('/account', vi.fn())).toThrow(ConfigError);
    expect(() => readKeychainPassword('service/', vi.fn())).toThrow(ConfigError);
  });

  it('wraps a security CLI failure in an actionable ConfigError', () => {
    setPlatform('darwin');
    const exec = vi.fn().mockImplementation(() => {
      throw new Error('The specified item could not be found in the keychain.');
    });
    expect(() => readKeychainPassword('asc-mcp/missing', exec)).toThrow(
      /add-generic-password/
    );
  });

  it('decodes hex output (how security returns keys containing newlines)', () => {
    setPlatform('darwin');
    const pem = '-----BEGIN PRIVATE KEY-----\nMIG...\n-----END PRIVATE KEY-----';
    const hex = Buffer.from(pem, 'utf8').toString('hex');
    const exec = vi.fn().mockReturnValue(hex + '\n');

    expect(readKeychainPassword('asc-mcp/AuthKey', exec)).toBe(pem);
  });

  it('throws ConfigError when the entry is empty', () => {
    setPlatform('darwin');
    const exec = vi.fn().mockReturnValue('   \n');
    expect(() => readKeychainPassword('asc-mcp/blank', exec)).toThrow(/empty/);
  });

  it('refuses to run on non-macOS platforms', () => {
    setPlatform('linux');
    const exec = vi.fn();
    expect(() => readKeychainPassword('asc-mcp/AuthKey_ABC123', exec)).toThrow(
      /only supported on macOS/
    );
    expect(exec).not.toHaveBeenCalled();
  });
});
