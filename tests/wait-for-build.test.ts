/**
 * testflight__wait_for_build polls, so what matters is when it stops: on a
 * final state, at the deadline with "call again", and never on a build Apple
 * has not listed yet — that is still processing, not missing.
 */
import { describe, expect, it, vi } from 'vitest';
import { executeTestflightTool } from '../src/tools/testflight.js';

function fakeHttp(states: Array<string | undefined>) {
  let call = 0;
  return {
    get: vi.fn(async () => ({ data: [{ id: '1', attributes: { name: 'Notes', bundleId: 'com.example.notes' } }] })),
    collect: vi.fn(async () => {
      const state = states[Math.min(call++, states.length - 1)];
      return { items: state ? [{ id: 'b-1', attributes: { version: '42', processingState: state } }] : [], hasMore: false };
    }),
  } as any;
}
const run = (http: any, args: Record<string, unknown> = {}) => {
  let now = Date.parse('2026-10-27T12:00:00Z');
  vi.spyOn(Date, 'now').mockImplementation(() => now);
  const sleep = vi.fn(async (ms: number) => { now += ms; });
  return executeTestflightTool('testflight__wait_for_build', { app: 'com.example.notes', build: '42', ...args }, { http, sleep }) as Promise<any>;
};

describe('testflight__wait_for_build', () => {
  it('waits through processing and an unlisted build, then reports VALID', async () => {
    const res = await run(fakeHttp([undefined, 'PROCESSING', 'VALID']));
    expect(res).toMatchObject({ state: 'VALID', ready: true, buildId: 'b-1', waitedSeconds: 40 });
  });

  it('stops on a failed build and says it cannot be used', async () => {
    const res = await run(fakeHttp(['INVALID']));
    expect(res).toMatchObject({ state: 'INVALID', ready: false });
    expect(res.note).toMatch(/Upload a new one/);
  });

  it('gives up at the deadline and says to call again', async () => {
    const res = await run(fakeHttp(['PROCESSING']), { max_minutes: 1 });
    expect(res).toMatchObject({ state: 'PROCESSING', ready: false, timedOut: true });
    expect(res.waitedSeconds).toBeLessThanOrEqual(60);
  });

  it('stops when the call is cancelled', async () => {
    const controller = new AbortController();
    const http = fakeHttp(['PROCESSING']);
    const sleep = vi.fn(async () => { controller.abort(); });
    await expect(executeTestflightTool('testflight__wait_for_build', { app: 'com.example.notes', build: '42' }, { http, sleep, signal: controller.signal }))
      .rejects.toThrow(/cancelled/);
    expect(http.collect).toHaveBeenCalledTimes(1);
  });

  it('reports progress on every poll it waits through', async () => {
    let now = Date.parse('2026-10-27T12:00:00Z');
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    const progress = vi.fn();
    await executeTestflightTool('testflight__wait_for_build', { app: 'com.example.notes', build: '42' },
      { http: fakeHttp([undefined, 'PROCESSING', 'VALID']), sleep: async (ms) => { now += ms; }, progress });
    expect(progress.mock.calls).toEqual([[0, 300, 'Build 42 is not listed yet.'], [20, 300, 'Build 42 is PROCESSING.']]);
  });

  it('leaves no abort listener behind on its real timer, and does not sleep on an aborted signal', async () => {
    vi.useFakeTimers();
    try {
      const controller = new AbortController();
      const add = vi.spyOn(controller.signal, 'addEventListener');
      const remove = vi.spyOn(controller.signal, 'removeEventListener');
      const http = fakeHttp(['PROCESSING', 'VALID']);
      const done = executeTestflightTool('testflight__wait_for_build', { app: 'com.example.notes', build: '42' }, { http, signal: controller.signal });
      await vi.advanceTimersByTimeAsync(20_000);
      await expect(done).resolves.toMatchObject({ state: 'VALID' });
      expect(remove).toHaveBeenCalledTimes(add.mock.calls.length);
    } finally {
      vi.useRealTimers();
    }
  });

  it('refuses a wait longer than fifteen minutes', async () => {
    await expect(run(fakeHttp(['VALID']), { max_minutes: 30 })).rejects.toThrow(/from 1 to 15/);
  });
});
