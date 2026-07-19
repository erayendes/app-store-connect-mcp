import { execFileSync } from 'node:child_process';
import { ConfigError } from './errors.js';

/** Injectable for tests; matches the shape of execFileSync we rely on. */
export type ExecFile = (
  file: string,
  args: string[],
  options: { encoding: 'utf8' }
) => string;

/**
 * Resolve a `.p8` private key stored in the macOS Keychain as a generic
 * password. `ref` is `"service/account"` — the account may itself contain
 * slashes, so only the first slash is treated as the separator.
 *
 * The key is fetched with `security find-generic-password -w`, which prints
 * the raw password (the PEM contents) to stdout. Nothing is cached; the
 * caller reads it once at startup.
 */
export function readKeychainPassword(
  ref: string,
  exec: ExecFile = execFileSync
): string {
  if (process.platform !== 'darwin') {
    throw new ConfigError(
      `ASC_PRIVATE_KEY_KEYCHAIN is only supported on macOS. ` +
        `On this platform, use ASC_PRIVATE_KEY_PATH or ASC_PRIVATE_KEY instead.`
    );
  }

  const slash = ref.indexOf('/');
  if (slash === -1) {
    throw new ConfigError(
      `ASC_PRIVATE_KEY_KEYCHAIN must be "service/account" ` +
        `(e.g. "asc-mcp/AuthKey_ABC123"). Got: "${ref}".`
    );
  }
  const service = ref.slice(0, slash);
  const account = ref.slice(slash + 1);
  if (!service || !account) {
    throw new ConfigError(
      `ASC_PRIVATE_KEY_KEYCHAIN must be "service/account" ` +
        `(e.g. "asc-mcp/AuthKey_ABC123"). Got: "${ref}".`
    );
  }

  let output: string;
  try {
    output = exec(
      'security',
      ['find-generic-password', '-s', service, '-a', account, '-w'],
      { encoding: 'utf8' }
    );
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new ConfigError(
      `Could not read the private key from the macOS Keychain ` +
        `(service "${service}", account "${account}"): ${detail}\n` +
        `Add it once with:\n` +
        `  security add-generic-password -s ${service} -a ${account} -w "$(cat AuthKey_XXXXXXXXXX.p8)"`
    );
  }

  // `security -w` prints the password as hex when it contains a newline or
  // any non-printable byte — which every real .p8 does. A valid PEM contains
  // '-', '/', '+', '=' and newlines, so an all-hex string is unambiguously
  // the encoded form and safe to decode.
  const raw = output.trim();
  const pem = /^[0-9a-f]+$/i.test(raw) && raw.length % 2 === 0
    ? Buffer.from(raw, 'hex').toString('utf8').trim()
    : raw;

  if (!pem) {
    throw new ConfigError(
      `The macOS Keychain entry for service "${service}", account "${account}" ` +
        `is empty. Re-add it with the .p8 contents as the password.`
    );
  }
  return pem;
}
