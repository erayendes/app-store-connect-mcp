/**
 * The audit log is the answer to "who changed this, the agent or me?", so it
 * has to record refusals as well as runs, and must not become a second place
 * a credential leaks to.
 */
import { mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditArgs, logFailure, logWrite } from '../src/core/audit-log.js';

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

describe('auditArgs', () => {
  it('keeps names, ids, codes, numbers and flags, and masks credentials by name', () => {
    expect(auditArgs({ app: 'Notes', product_id: 'com.x.pro', territory: 'TUR', days: 7, dry: false, app_account_token: 'u-1', privateKey: 'p' })).toEqual({
      app: 'Notes', product_id: 'com.x.pro', territory: 'TUR', days: 7, dry: false, app_account_token: '[masked]', privateKey: '[masked]',
    });
  });

  it('leaves out free text, URLs and JSON sent as text, whatever secret they might carry', () => {
    expect(auditArgs({
      header: 'Before you go',
      url: 'https://bot:s3cret@hooks.example.com/r?api_key=abc',
      raw: '{"data":{"attributes":{"secret":"abc"}}}',
    })).toEqual({ header: '[not recorded]', url: '[not recorded]', raw: '[not recorded]' });
  });

  it('records a body as the resource and the fields it sets, never their values', () => {
    expect(auditArgs({ body: { data: { type: 'webhooks', id: 'w-1', attributes: { url: 'https://x.test', secret: 's' }, relationships: { app: {} } } } }))
      .toEqual({ body: { type: 'webhooks', id: 'w-1', fields: ['url', 'secret', 'app'] } });
  });

  it('keeps a short list of codes and counts anything else', () => {
    expect(auditArgs({ territories: ['TUR', 'USA'], notes: ['a b', 'c'] })).toEqual({ territories: ['TUR', 'USA'], notes: '[2 items not recorded]' });
  });
});

