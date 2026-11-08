import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from 'vitest/config';

// The audit log, failure log and report cache go to ASC_STATE_DIR; a test run
// must never write into the developer's own. (Not ASC_CONFIG_DIR: the live gate tests need the real key.)
export default defineConfig({
  test: { env: { ASC_STATE_DIR: mkdtempSync(join(tmpdir(), 'heimdall-test-')) } },
});
