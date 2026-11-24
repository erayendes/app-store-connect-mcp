/**
 * What setup asks beyond the key: how careful to be with changes (#139) and
 * how review replies should sound (#140). Both land in the shared config next
 * to the key, so no app config is touched and a re-run keeps them.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { askReviewsBrand, askWriteMode, draftsReviewReplies, runRegister, updateSharedConfig, type Row } from '../src/setup.js';

const answers = (...a: string[]) => vi.fn(async () => a.shift() ?? '');
let dir: string;
const saved = () => JSON.parse(readFileSync(join(dir, 'config.json'), 'utf8'));

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'asc-prefs-'));
  process.env.ASC_CONFIG_DIR = dir;
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  delete process.env.ASC_CONFIG_DIR;
  vi.restoreAllMocks();
});

describe('how careful Heimdall is with changes', () => {
  it('keeps the current answer on Enter, and asks again on nonsense', async () => {
    expect(await askWriteMode(answers(''))).toBe('strong');
    expect(await askWriteMode(answers(''), 'readOnly')).toBe('readOnly');
    expect(await askWriteMode(answers('7', '2'))).toBe('all');
    expect(await askWriteMode(answers('3'), 'all')).toBe('readOnly');
  });

  it('lets register set it without the key, and says when there is nowhere to save it', () => {
    runRegister([], undefined, 'readOnly');
    expect(vi.mocked(console.log).mock.calls[0][0]).toMatch(/No credentials stored yet/);

    writeFileSync(join(dir, 'config.json'), JSON.stringify({ keyId: 'ABCD123456', issuerId: 'i', vendorNumber: '85000000' }));
    runRegister([], undefined, 'readOnly');
    expect(saved()).toMatchObject({ keyId: 'ABCD123456', vendorNumber: '85000000', writeMode: 'readOnly' });
    runRegister([], undefined, 'readOnly');
    expect(vi.mocked(console.log).mock.calls.at(-1)![0]).toMatch(/Already set/);
  });
});

describe('how review replies sound', () => {
  it('is asked only for a pick that drafts review replies', () => {
    const row = (profile: string, sub?: string) => ({ profile: { name: profile }, subProfile: sub ? { name: sub } : undefined }) as unknown as Row;
    expect(draftsReviewReplies(row('marketing'))).toBe(true);
    expect(draftsReviewReplies(row('marketing', 'customer-reviews'))).toBe(true);
    expect(draftsReviewReplies(row('marketing', 'events'))).toBe(false);
    expect(draftsReviewReplies(row('analytics'))).toBe(false);
  });

  it('keeps saved values on Enter, clears one with -, and checks the URL', async () => {
    expect(await askReviewsBrand(answers('', '', ''))).toBeUndefined();
    expect(await askReviewsBrand(answers('friendly, short', 'sorry,  unfortunately ', 'example.com', 'https://example.com/help'))).toEqual({
      voice: 'friendly, short',
      bannedPhrases: ['sorry', 'unfortunately'],
      supportUrl: 'https://example.com/help',
    });
    const current = { voice: 'warm', bannedPhrases: ['sorry'], supportUrl: 'https://example.com/help' };
    expect(await askReviewsBrand(answers('', '-', ''), current)).toEqual({ voice: 'warm', supportUrl: 'https://example.com/help' });
  });
});

describe('saving what setup asked', () => {
  it('adds to the saved key, clears what is set to undefined and writes nothing when nothing changed', () => {
    expect(updateSharedConfig({ writeMode: 'all' })).toBeUndefined();
    writeFileSync(join(dir, 'config.json'), JSON.stringify({ keyId: 'ABCD123456', issuerId: 'i', reviewsBrand: { voice: 'warm' } }));
    expect(updateSharedConfig({ writeMode: 'all' })).toBe(join(dir, 'config.json'));
    expect(saved()).toEqual({ keyId: 'ABCD123456', issuerId: 'i', reviewsBrand: { voice: 'warm' }, writeMode: 'all' });
    expect(updateSharedConfig({ writeMode: 'all' })).toBeUndefined();
    updateSharedConfig({ reviewsBrand: undefined });
    expect(saved().reviewsBrand).toBeUndefined();
  });
});
