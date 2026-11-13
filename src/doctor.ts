/** Local, read-only diagnostics. This module must never loadConfig or mint a JWT. */
import { accessSync, constants, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  CLIENTS, PACKAGE, VERSION, presentTargets, readRegistrations, coreDecision,
  isDead, type McpClient,
} from './clients.js';
import { readSharedConfig } from './core/shared-config.js';

type MetadataExec = (file: string, args: string[], options: { stdio: 'ignore' }) => unknown;

/** Only item metadata is requested; stdout/stderr are discarded, even on failure. */
export function keychainItemPresent(ref: string, platform = process.platform, exec: MetadataExec = execFileSync): boolean {
  if (typeof ref !== 'string') return false;
  const slash = ref.indexOf('/');
  if (platform !== 'darwin' || slash < 1 || slash === ref.length - 1) return false;
  try {
    exec('security', ['find-generic-password', '-s', ref.slice(0, slash), '-a', ref.slice(slash + 1)], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function credentialPresence(
  env: NodeJS.ProcessEnv = process.env,
  hasItem: (ref: string) => boolean = keychainItemPresent
): string {
  const envHasCreds = Boolean(env.ASC_KEY_ID || env.ASC_ISSUER_ID || env.ASC_PRIVATE_KEY ||
    env.ASC_PRIVATE_KEY_KEYCHAIN || env.ASC_PRIVATE_KEY_PATH);
  let shared;
  try {
    shared = envHasCreds ? undefined : readSharedConfig(env);
  } catch {
    return `shared config could not be read. Next: run npx -y ${PACKAGE} setup in a real terminal.`;
  }
  const remedy = `Next: run npx -y ${PACKAGE} setup in a real terminal.`;
  const keyId = env.ASC_KEY_ID ?? shared?.keyId;
  const issuerId = env.ASC_ISSUER_ID ?? shared?.issuerId;
  if (typeof keyId !== 'string' || !keyId || typeof issuerId !== 'string' || !issuerId) {
    return `missing Key ID or Issuer ID. ${remedy}`;
  }
  if (typeof env.ASC_PRIVATE_KEY === 'string' && env.ASC_PRIVATE_KEY) return 'inline key configured; contents were not inspected.';
  const ref = env.ASC_PRIVATE_KEY_KEYCHAIN ?? shared?.privateKeyKeychain;
  if (ref) return hasItem(ref)
    ? 'Keychain item present; key contents were not read.'
    : `Keychain item missing or inaccessible. ${remedy}`;
  const path = env.ASC_PRIVATE_KEY_PATH ?? shared?.privateKeyPath;
  if (path) {
    try {
      accessSync(path, constants.R_OK);
      if (statSync(path).isFile()) return 'key file readable; key contents were not read.';
    } catch { /* Only report availability, never a path or error containing it. */ }
    return `key file missing or unreadable. ${remedy}`;
  }
  return `private key reference missing. ${remedy}`;
}

/** No client CLI is run, including when a config cannot be interpreted. */
export function doctorReport(clients: McpClient[] = CLIENTS, env: NodeJS.ProcessEnv = process.env): string {
  const lines = [
    'Heimdall doctor',
    `Node: ${process.version}`,
    `Package: @erayendes/asc-mcp ${VERSION}`,
    `Release channel: ${PACKAGE.endsWith('@beta') ? 'beta' : 'stable'}`,
    `Credentials: ${credentialPresence(env)}`,
    '',
  ];
  let found = false;
  for (const client of clients) {
    const targets = presentTargets(client, true);
    if (!targets.length) continue;
    found = true;
    lines.push(`${client.label}:`);
    const regs = readRegistrations(client, true);
    for (const target of targets) {
      const here = regs.filter((r) => r.target === target);
      lines.push(`  ${target.label ?? target.where}:`);
      for (const reg of here) {
        if (reg.name === '*') {
          lines.push('    Config could not be read in full. Next: review the client MCP settings, then run doctor again.');
          continue;
        }
        lines.push(`    ${reg.name}: ${reg.spec ?? 'profile could not be determined'}${reg.pkg ? ` (${reg.pkg})` : ''}`);
        if (isDead(reg)) {
          lines.push(`    Unknown profile. Next: run npx -y ${PACKAGE} setup in a real terminal and choose a current profile.`);
        }
        if (!reg.spec) lines.push('    Next: review this entry in the client MCP settings.');
        if (reg.pkg && reg.pkg !== PACKAGE) {
          const spec = isDead(reg) ? undefined : reg.spec;
          lines.push(`    Package/channel differs from this doctor. Next: run npx -y ${PACKAGE} ${spec ? `register ${spec} --clients=${client.id}` : 'setup in a real terminal'}, then restart the client.`);
        }
        if (!reg.entry) {
          lines.push('    Credential overrides could not be inspected. Next: review this entry in the client MCP settings, then call asc__status in that client.');
        } else if ('envFile' in reg.entry) {
          lines.push('    Credentials: envFile not inspected. Next: check its credential references locally, then run asc__status in the client.');
        } else if (reg.entry?.env && typeof reg.entry.env === 'object') {
          const own = reg.entry.env as NodeJS.ProcessEnv;
          if (Object.keys(own).some((k) => k === 'ASC_CONFIG_DIR' || k === 'ASC_KEY_ID' || k === 'ASC_ISSUER_ID' || k.startsWith('ASC_PRIVATE_KEY'))) {
            lines.push(`    Credentials for this entry: ${credentialPresence({ ...env, ...own })}`);
          }
        }
      }
      const profiles = here.filter((r) => r.name !== '*' && r.spec !== 'core' && !isDead(r));
      if (profiles.length) {
        const core = here.some((r) => r.spec === 'core');
        const embedded = profiles.every((r) => Array.isArray(r.entry?.args) && r.entry.args.includes('--with-core'));
        lines.push(`    ASC-Core: ${core ? 'registered' : embedded ? 'included with --with-core' : 'missing or could not be determined'}.`);
        if (!core && !embedded) {
          const decision = coreDecision(here);
          lines.push(decision.add
            ? `    Next: run npx -y ${PACKAGE} register ${profiles.map((r) => r.spec).filter(Boolean).join(' ') || 'general'} --clients=${client.id}, then restart the client.`
            : `    ASC-Core needs review: ${decision.reason}. Next: run setup in a real terminal and read the plan; do not add ASC-Core by hand.`);
        }
        lines.push('    Next: restart the client if registration changed; ask it to call asc__status for the live connection check.');
      } else if (!here.length) {
        lines.push(`    No Heimdall entries. Next: run npx -y ${PACKAGE} setup in a real terminal and choose this client.`);
      }
    }
  }
  if (!found) lines.push(`No MCP clients found. Next: run npx -y ${PACKAGE} setup in a real terminal; choose your client or copy the manual config.`);
  lines.push('', 'Local checks only. Credentials were not verified with Apple. For the live check, ask your MCP client to call asc__status.');
  return lines.join('\n');
}
