/**
 * Fetches the current App Store Connect OpenAPI specification from Apple and
 * replaces spec/openapi.json, reporting what changed.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_PATH = resolve(__dirname, '../spec/openapi.json');
const SPEC_URL =
  'https://developer.apple.com/sample-code/app-store-connect/app-store-connect-openapi-specification.zip';

function currentVersion(): string | null {
  if (!existsSync(SPEC_PATH)) return null;
  try {
    return JSON.parse(readFileSync(SPEC_PATH, 'utf8')).info?.version ?? null;
  } catch {
    return null;
  }
}

function main(): void {
  const before = currentVersion();
  const work = mkdtempSync(resolve(tmpdir(), 'asc-spec-'));

  console.log(`Downloading ${SPEC_URL}`);
  execSync(`curl -sL --fail -o "${work}/spec.zip" "${SPEC_URL}"`, { stdio: 'inherit' });
  execSync(`unzip -q -o "${work}/spec.zip" -d "${work}"`, { stdio: 'inherit' });

  const extracted = execSync(`find "${work}" -name "*.json" -size +1M`, {
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean)[0];

  if (!extracted) {
    console.error('No specification JSON found in the downloaded archive.');
    process.exit(1);
  }

  const spec = JSON.parse(readFileSync(extracted, 'utf8'));
  const after = spec.info?.version ?? 'unknown';

  writeFileSync(SPEC_PATH, JSON.stringify(spec, null, 2));

  console.log(
    before === after
      ? `Specification unchanged (v${after}).`
      : `Specification updated: v${before ?? 'none'} -> v${after}.`
  );
  console.log('Run `npm run generate` next, then review the diff and run the tests.');
}

main();
