/**
 * `audit`: the write log as a page. It is built from what the log already
 * masked, opened from disk, and must survive a torn line and a value that
 * tries to close its script.
 */
import { describe, it, expect, vi } from 'vitest';
import { mkdtempSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readAuditLog, renderAuditPage, runAudit } from '../src/audit-view.js';

const entry = (over: object = {}) => ({
  at: '2026-11-24T04:50:09.239Z', tool: 'pricing__equalize_price', risk: 'revenue',
  confirmation: 'macOS dialog', outcome: 'error', args: { app: 'Hydramic', price: '29.99' },
  error: 'Network error: fetch failed.', ...over,
});

describe('the audit page', () => {
  it('reads every whole line and skips a torn one', () => {
    const dir = mkdtempSync(join(tmpdir(), 'asc-audit-'));
    writeFileSync(join(dir, 'audit.jsonl'), `${JSON.stringify(entry())}\n{"at":"2026-11-24T05:00:00Z","tool":"x"}\n{"at": "torn`);
    expect(readAuditLog({ ASC_STATE_DIR: dir })).toHaveLength(2);
    expect(readAuditLog({ ASC_STATE_DIR: join(dir, 'missing') })).toEqual([]);
  });

  it('says what each tool does, and a value cannot close the script', () => {
    const page = renderAuditPage([entry({ error: '</script><script>alert(1)</script>' })]);
    const script = page.split('<script>')[1].split('</script>')[0];
    expect(() => new Function(script)).not.toThrow();
    expect(script).toContain('\\u003c/script>');
    expect(script).toMatch(/"what":"Set one anchor price/);
  });

  it('writes the page next to the log, readable only by this user, without opening it when asked', () => {
    const dir = mkdtempSync(join(tmpdir(), 'asc-audit-'));
    writeFileSync(join(dir, 'audit.jsonl'), `${JSON.stringify(entry())}\n`);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const path = runAudit({ open: false }, { ASC_STATE_DIR: dir });
    expect(path).toBe(join(dir, 'audit.html'));
    expect(readFileSync(path, 'utf8')).toContain('What Heimdall changed');
    if (process.platform !== 'win32') expect(statSync(path).mode & 0o777).toBe(0o600);
    vi.restoreAllMocks();
  });
});
