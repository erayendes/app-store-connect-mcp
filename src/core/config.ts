import { ConfigError } from './errors.js';
import { readKeychainPassword } from './keychain.js';
import type { JwtCredentials } from './jwt.js';

export interface ServerConfig {
  credentials: JwtCredentials;
  /** Required by the sales and finance report endpoints. */
  vendorNumber?: string;
  /** App Store Server API (StoreKit 2) settings. */
  storekit?: {
    bundleId: string;
    appAppleId?: number;
    environment: 'Sandbox' | 'Production';
  };
  /** When set, only these domains are exposed as tools. */
  domains?: string[];
  /** Blocks every mutating tool. */
  readOnly: boolean;
  /** Include operations Apple has marked deprecated. */
  includeDeprecated: boolean;
}

function parseList(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

export function loadConfig(argv: string[] = process.argv.slice(2)): ServerConfig {
  const env = process.env;

  const flag = (name: string) => argv.includes(`--${name}`);
  const option = (name: string): string | undefined => {
    const inline = argv.find((a) => a.startsWith(`--${name}=`));
    if (inline) return inline.slice(name.length + 3);
    const idx = argv.indexOf(`--${name}`);
    if (idx !== -1 && argv[idx + 1] && !argv[idx + 1].startsWith('--')) {
      return argv[idx + 1];
    }
    return undefined;
  };

  const keyId = env.ASC_KEY_ID;
  const issuerId = env.ASC_ISSUER_ID;
  const privateKeyPath = env.ASC_PRIVATE_KEY_PATH;
  const keychainRef = env.ASC_PRIVATE_KEY_KEYCHAIN;
  // Resolve the key from the Keychain unless an inline PEM already wins.
  // Precedence: ASC_PRIVATE_KEY > ASC_PRIVATE_KEY_KEYCHAIN > ASC_PRIVATE_KEY_PATH.
  const privateKey =
    env.ASC_PRIVATE_KEY ?? (keychainRef ? readKeychainPassword(keychainRef) : undefined);

  const missing: string[] = [];
  if (!keyId) missing.push('ASC_KEY_ID');
  if (!issuerId) missing.push('ASC_ISSUER_ID');
  if (!privateKeyPath && !privateKey) {
    missing.push('ASC_PRIVATE_KEY_PATH (or ASC_PRIVATE_KEY, or ASC_PRIVATE_KEY_KEYCHAIN)');
  }

  if (missing.length) {
    throw new ConfigError(
      `Missing required configuration: ${missing.join(', ')}.\n` +
        `Create an API key at https://appstoreconnect.apple.com/access/integrations/api ` +
        `and set these as environment variables in your MCP client config.`
    );
  }

  const bundleId = env.ASC_BUNDLE_ID;

  return {
    credentials: {
      keyId: keyId!,
      issuerId: issuerId!,
      privateKeyPath,
      privateKey,
    },
    vendorNumber: env.ASC_VENDOR_NUMBER,
    storekit: bundleId
      ? {
          bundleId,
          appAppleId: env.ASC_APP_APPLE_ID ? Number(env.ASC_APP_APPLE_ID) : undefined,
          environment: env.ASC_ENVIRONMENT === 'Production' ? 'Production' : 'Sandbox',
        }
      : undefined,
    domains: parseList(option('domains') ?? env.ASC_DOMAINS),
    readOnly: flag('read-only') || env.ASC_READ_ONLY === 'true',
    includeDeprecated:
      flag('include-deprecated') || env.ASC_INCLUDE_DEPRECATED === 'true',
  };
}
