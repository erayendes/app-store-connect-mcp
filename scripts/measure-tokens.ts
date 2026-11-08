/**
 * What each server costs a client's context, measured from the tool list it
 * actually answers.
 *
 *   tsx scripts/measure-tokens.ts               against src/
 *   tsx scripts/measure-tokens.ts --from=dist   against the last build
 *
 * `TOKENS_PER_TOOL` times a tool count is an estimate; this is the sum over
 * the definitions `tools/list` returns, so macros, the meta tools and a
 * profile's own mix of long and short schemas are all in it. Same unit as the
 * generator's token report (JSON length / 4) and no tokenizer dependency. The
 * `--from=dist` mode exists so a structural change can be measured before and
 * after against the same script: build, measure, change, measure again.
 */
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { estimateTokens } from './schema-defs.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export interface ServerCost {
  server: string;
  tools: number;
  tokens: number;
}

/** One row per profile server, every sub-profile loaded, no flags. */
export async function measureServers(from: 'src' | 'dist' = 'src'): Promise<ServerCost[]> {
  const ext = from === 'src' ? 'ts' : 'js';
  const load = (path: string) => import(pathToFileURL(resolve(ROOT, from, `${path}.${ext}`)).href);
  const { createServer } = await load('server');
  const { PROFILES, resolveSelection } = await load('profiles');
  const config = {
    credentials: { keyId: 'MEASURE', issuerId: 'measure', privateKey: 'not-used' },
    readOnly: false,
    confirmWrites: 'off',
    dryRun: true,
  };

  const rows: ServerCost[] = [];
  for (const profile of PROFILES as Array<{ name: string }>) {
    const server = createServer(config, resolveSelection(profile.name));
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'measure', version: '0' }, { capabilities: {} });
    await Promise.all([server.connect(st), client.connect(ct)]);
    const { tools } = await client.listTools();
    rows.push({
      server: profile.name,
      tools: tools.length,
      tokens: tools.reduce((n, t) => n + estimateTokens(t), 0),
    });
    await client.close();
  }
  return rows;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const from = process.argv.includes('--from=dist') ? 'dist' : 'src';
  const rows = await measureServers(from);
  console.log(`Tool-definition tokens per server (${from}/, JSON length / 4):\n`);
  for (const r of rows) {
    console.log(`  ${r.server.padEnd(20)}${String(r.tools).padStart(5)} tools${String(r.tokens).padStart(8)} tok`);
  }
  const total = rows.reduce((n, r) => n + r.tokens, 0);
  console.log(`\n  ${'all servers'.padEnd(20)}${''.padStart(11)}${String(total).padStart(8)} tok`);
}
