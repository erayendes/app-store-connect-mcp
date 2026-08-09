import { ConfigError } from './errors.js';
import { readKeychainPassword } from './keychain.js';
import { readSharedConfig } from './shared-config.js';
import type { JwtCredentials } from './jwt.js';
import type { RateLimitOptions } from './rate-limit.js';

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
  /**
   * Ask the user to confirm (via MCP elicitation) before any mutating tool
   * runs. Opt-in — see the note at the assignment for why.
   */
  confirmWrites: boolean;
  /** Include operations Apple has marked deprecated. */
  includeDeprecated: boolean;
  /**
   * Override the API origin (ASC_BASE_URL) — for tests against a local
   * fixture server. Host-pinning then pins to this origin instead of Apple's.
   */
  baseUrl?: string;
  /**
   * Writes never reach Apple: each mutating call returns what WOULD have been
   * sent (method, path, query, body, risk) after passing validation. Reads run
   * normally. For CI and agent rehearsals.
   */
  dryRun: boolean;
  /**
   * Lowers the proactive pacing budget below Apple's own ceiling.
   *
   * The limiter counts per process, and each process assumes it is the only
   * client of the key. That holds for one editor; it does not hold for a team
   * key driving several agents at once, where the processes together burn the
   * hourly quota and block the humans sharing it.
   */
  rateLimit?: RateLimitOptions;
  /** Optional brand settings for the reviews-AI draft tools (ASC_REVIEWS_*). */
  reviewsBrand?: {
    voice?: string;
    bannedPhrases?: string[];
    supportUrl?: string;
  };
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

  // The environment wins outright; the shared file (written by `setup`) fills
  // in only when the env carries no credentials at all, so one stray env var
  // can't silently mix two accounts.
  const envHasCreds = Boolean(
    env.ASC_KEY_ID || env.ASC_ISSUER_ID || env.ASC_PRIVATE_KEY ||
    env.ASC_PRIVATE_KEY_KEYCHAIN || env.ASC_PRIVATE_KEY_PATH
  );
  const shared = envHasCreds ? undefined : readSharedConfig(env);

  const keyId = env.ASC_KEY_ID ?? shared?.keyId;
  const issuerId = env.ASC_ISSUER_ID ?? shared?.issuerId;
  const privateKeyPath = env.ASC_PRIVATE_KEY_PATH ?? shared?.privateKeyPath;
  const keychainRef = env.ASC_PRIVATE_KEY_KEYCHAIN ?? shared?.privateKeyKeychain;
  // Resolve the key from the Keychain unless an inline PEM already wins.
  // Precedence: ASC_PRIVATE_KEY > keychain reference > file path.
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
        `Either run "npx -y @erayendes/asc-mcp setup" once (shared by every profile), or ` +
        `create an API key at https://appstoreconnect.apple.com/access/integrations/api ` +
        `and set these as environment variables in your MCP client config.`
    );
  }

  const bundleId = env.ASC_BUNDLE_ID ?? shared?.bundleId;

  // A zero or a typo would silently stall every request, so only a positive
  // number counts; anything else falls back to Apple's documented ceiling.
  const positive = (raw: string | undefined) => {
    const n = Number(raw);
    return raw && Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const requestsPerHour = positive(env.ASC_RATE_LIMIT_PER_HOUR);
  const requestsPerMinute = positive(env.ASC_RATE_LIMIT_PER_MINUTE);

  return {
    credentials: {
      keyId: keyId!,
      issuerId: issuerId!,
      privateKeyPath,
      privateKey,
    },
    vendorNumber: env.ASC_VENDOR_NUMBER ?? shared?.vendorNumber,
    storekit: bundleId
      ? {
          bundleId,
          appAppleId: env.ASC_APP_APPLE_ID
            ? Number(env.ASC_APP_APPLE_ID)
            : shared?.appAppleId,
          environment:
            (env.ASC_ENVIRONMENT ?? shared?.environment) === 'Production'
              ? 'Production'
              : 'Sandbox',
        }
      : undefined,
    domains: parseList(option('domains') ?? env.ASC_DOMAINS),
    readOnly: flag('read-only') || env.ASC_READ_ONLY === 'true',
    // Off by default. Every MCP client already gates a tool call behind its own
    // approval, and this guard only works where the client renders an
    // elicitation form — on the ones that don't, it turned working writes into
    // an error that reads like the user said no. Turn it on with --confirm once
    // you have seen your client actually show the prompt.
    // ponytail: `--no-confirm` from older configs is now a no-op that lands on
    // this same default, so nobody's config breaks.
    confirmWrites:
      flag('confirm') || env.ASC_CONFIRM_WRITES === 'true' || env.ASC_CONFIRM_WRITES === '1',
    includeDeprecated:
      flag('include-deprecated') || env.ASC_INCLUDE_DEPRECATED === 'true',
    baseUrl: env.ASC_BASE_URL || undefined,
    dryRun: flag('dry-run') || env.ASC_DRY_RUN === 'true' || env.ASC_DRY_RUN === '1',
    rateLimit:
      requestsPerHour || requestsPerMinute ? { requestsPerHour, requestsPerMinute } : undefined,
    reviewsBrand:
      env.ASC_REVIEWS_BRAND_VOICE || env.ASC_REVIEWS_BANNED_PHRASES || env.ASC_REVIEWS_SUPPORT_URL
        ? {
            voice: env.ASC_REVIEWS_BRAND_VOICE || undefined,
            bannedPhrases: parseList(env.ASC_REVIEWS_BANNED_PHRASES),
            supportUrl: env.ASC_REVIEWS_SUPPORT_URL || undefined,
          }
        : undefined,
  };
}
