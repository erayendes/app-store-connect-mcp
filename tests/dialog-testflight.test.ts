import { describe, it, expect, vi } from 'vitest';
import { testflightDialog, testflightPreviewArgs } from '../src/tools/testflight.js';

const uuid = (n: number) => `a1b2c3d4-0000-1111-2222-${String(n).padStart(12, '0')}`;

describe('testflightDialog', () => {
  it('names the build and the groups', () => {
    const d = testflightDialog({ app: 'Heimdall Test (com.example.heimdall)', build: '42', groups: ['External Testers', 'QA'] });
    expect(d.title).toBe('Assign build 42 to External Testers and QA?');
    expect(d.action).toBe('Assign');
    expect(d.body).toBe([
      'Heimdall Test · TestFlight',
      'Groups that already have it stay as they are.',
      'External groups may also need beta app review; this does not submit one.',
      '',
      'Every tester in these groups can install it.',
    ].join('\n'));
  });

  it('keeps a build UUID out of the title and lists every group when the title is capped', () => {
    const d = testflightDialog({ app: 'Heimdall Test', build: 'a1b2c3d4-0000-1111-2222-333344445555', groups: ['A', 'B', 'C', 'D', 'E'] });
    expect(d.title).toBe('Assign the build to A, B and 3 more?');
    expect(d.body).toContain('Groups: A, B, C, D, E');
    expect(d.body).not.toContain('a1b2c3d4');
  });

  it('caps a long group list so the body fits the 1500-character alert', () => {
    const groups = Array.from({ length: 60 }, (_, i) => `Beta testers group number ${i} with a long name`);
    const d = testflightDialog({ app: 'Heimdall Test', build: '42', groups });
    expect(d.body.length).toBeLessThan(1500);
    expect(d.body).toMatch(/Groups: .* and 45 more$/m);
  });

  it('never shows a group UUID: uses looked-up names, and counts the rest', () => {
    const named = testflightDialog({ app: 'Heimdall Test', build: uuid(9), buildLabel: '42', groups: [uuid(1), 'QA'], groupNames: { [uuid(1)]: 'Friends' } });
    expect(named.title).toBe('Assign build 42 to Friends and QA?');
    const counted = testflightDialog({ app: 'Heimdall Test', build: '42', groups: [uuid(1), uuid(2)] });
    expect(counted.title).toBe('Assign build 42 to 2 groups?');
    const mixed = testflightDialog({ app: 'Heimdall Test', build: '42', groups: ['QA', uuid(1)] });
    expect(mixed.title).toBe('Assign build 42 to QA and 1 other group?');
    for (const d of [named, counted, mixed]) expect(`${d.title}${d.body}`).not.toContain('a1b2c3d4');
  });
});

describe('testflightPreviewArgs', () => {
  it('looks up a UUID build version and UUID group names, and leaves names and numbers alone', async () => {
    const get = vi.fn(async (path: string, query: Record<string, string>) => {
      if (path === `/v1/builds/${uuid(9)}`) return { data: { id: uuid(9), attributes: { version: '42' } } };
      if (path === `/v1/betaGroups/${uuid(1)}`) return { data: { id: uuid(1), attributes: { name: 'Friends' } } };
      throw new Error(`unexpected ${path} ${JSON.stringify(query)}`);
    });
    const args = { app: 'Heimdall Test', build: uuid(9), groups: [uuid(1), 'QA', uuid(2)] };
    const out = await testflightPreviewArgs(args, { get } as any);
    // uuid(2) fails and is simply left unresolved.
    expect(out).toEqual({ ...args, buildLabel: '42', groupNames: { [uuid(1)]: 'Friends' } });
    expect(get).toHaveBeenCalledWith(`/v1/builds/${uuid(9)}`, { 'fields[builds]': 'version' });
    expect(get).toHaveBeenCalledWith(`/v1/betaGroups/${uuid(1)}`, { 'fields[betaGroups]': 'name' });
    expect(get).toHaveBeenCalledTimes(3);
    expect(testflightDialog(out).title).toBe('Assign build 42 to Friends, QA and 1 other group?');
  });

  it('makes at most ten lookups and none for a build number or group names', async () => {
    const get = vi.fn(async () => ({ data: { attributes: { name: 'G' } } }));
    await testflightPreviewArgs({ build: uuid(99), groups: Array.from({ length: 20 }, (_, i) => uuid(i)) }, { get } as any);
    expect(get).toHaveBeenCalledTimes(10);
    get.mockClear();
    expect(await testflightPreviewArgs({ build: '42', groups: ['QA'] }, { get } as any)).toEqual({ build: '42', groups: ['QA'] });
    expect(get).not.toHaveBeenCalled();
  });
});
