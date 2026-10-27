/**
 * The audit log is the answer to "who changed this, the agent or me?", so it
 * has to record refusals as well as runs, and must not become a second place
 * a credential leaks to.
 */
import { mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { logFailure, logWrite, maskArgs } from '../src/core/audit-log.js';

const lines = (path: string) => readFileSync(path, 'utf8').trim().split('\n').map((l) => JSON.parse(l));

describe('audit log', () => {
  it('appends one line per write, readable only by the owner', () => {
    const dir = mkdtempSync(join(tmpdir(), 'audit-'));
    const env = { ASC_STATE_DIR: dir } as NodeJS.ProcessEnv;
    logWrite({ tool: 'pricing__set_iap_price', risk: 'revenue', confirmation: 'typed CONFIRM', outcome: 'ok', args: { app: 'Notes', price: '0.99' } }, env);
    logWrite({ tool: 'apps__update', risk: 'public', confirmation: 'declined', outcome: 'not run', args: {} }, env);
    const path = join(dir, 'audit.jsonl');
    const [first, second] = lines(path);
    expect(first).toMatchObject({ tool: 'pricing__set_iap_price', confirmation: 'typed CONFIRM', outcome: 'ok', args: { app: 'Notes' } });
    expect(typeof first.at).toBe('string');
    expect(second.outcome).toBe('not run');
    if (process.platform !== 'win32') expect(statSync(path).mode & 0o777).toBe(0o600);
  });

  it('writes failures with Apple\'s request ID to a file of their own', () => {
    const dir = mkdtempSync(join(tmpdir(), 'audit-'));
    logFailure({ tool: 'apps__get', status: 404, appleRequestId: 'REQ-1', error: 'not found' }, { ASC_STATE_DIR: dir } as NodeJS.ProcessEnv);
    expect(lines(join(dir, 'failures.jsonl'))[0]).toMatchObject({ status: 404, appleRequestId: 'REQ-1' });
  });

  it('masks a credential quoted in an error message', () => {
    const dir = mkdtempSync(join(tmpdir(), 'audit-'));
    logFailure({ tool: 't', status: 400, error: 'bad URL https://x.test/hook?token=abc' }, { ASC_STATE_DIR: dir } as NodeJS.ProcessEnv);
    expect(lines(join(dir, 'failures.jsonl'))[0].error).toBe('bad URL https://x.test/hook?token=[masked]');
  });

  it('never fails the call when the log cannot be written', () => {
    expect(() =>
      logWrite({ tool: 't', risk: 'low', confirmation: 'not asked', outcome: 'ok', args: {} }, { ASC_STATE_DIR: '/dev/null/nope' } as NodeJS.ProcessEnv)
    ).not.toThrow();
  });
});

describe('maskArgs', () => {
  it('masks tokens and keys, keeps everything else', () => {
    expect(maskArgs({ app_account_token: 'u-1', privateKey: 'p', keywords: 'notes,todo', app: 'Notes' })).toEqual({
      app_account_token: '[masked]', privateKey: '[masked]', keywords: 'notes,todo', app: 'Notes',
    });
  });

  it('masks a secret list and a credential inside a URL', () => {
    expect(maskArgs({ secrets: ['a', 'b'], url: 'https://example.com/hook?token=abc&x=1' })).toEqual({
      secrets: '[masked]', url: 'https://example.com/hook?token=[masked]&x=1',
    });
  });

  it('cuts a huge body down rather than logging all of it', () => {
    const masked = maskArgs({ body: 'x'.repeat(5000) });
    expect(JSON.stringify(masked).length).toBeLessThan(2100);
  });
});
