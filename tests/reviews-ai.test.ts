import { describe, it, expect, vi } from 'vitest';
import { executeReviewsAiTool, type ReviewsAiContext } from '../src/tools/reviews-ai.js';

function makeCtx(overrides: {
  get?: any;
  collect?: any;
  createMessage?: any;
} = {}): ReviewsAiContext & { http: any; server: any } {
  const http = {
    get: overrides.get ?? vi.fn(),
    collect: overrides.collect ?? vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  const server = { createMessage: overrides.createMessage ?? vi.fn() };
  return { http, server } as unknown as ReviewsAiContext & { http: any; server: any };
}

describe('reviews_ai__draft_response', () => {
  it('drafts a reply from a fetched review without posting anything', async () => {
    const get = vi.fn().mockResolvedValue({
      data: {
        id: 'r1',
        attributes: {
          rating: 2,
          title: 'Crashes',
          body: 'App crashes on launch',
          territory: 'USA',
          createdDate: '2026-07-01',
        },
      },
    });
    const createMessage = vi
      .fn()
      .mockResolvedValue({ content: { type: 'text', text: 'Sorry about that — fixed in the next update.' } });
    const ctx = makeCtx({ get, createMessage });

    const result: any = await executeReviewsAiTool('reviews_ai__draft_response', { review_id: 'r1' }, ctx);

    expect(get).toHaveBeenCalledWith('/v1/customerReviews/r1');
    expect(result.draft).toContain('Sorry');
    expect(ctx.http.post).not.toHaveBeenCalled();
  });

  it('rejects a missing review_id', async () => {
    const ctx = makeCtx();
    await expect(executeReviewsAiTool('reviews_ai__draft_response', {}, ctx)).rejects.toThrow(/review_id/);
  });

  it('rejects an unknown review', async () => {
    const get = vi.fn().mockResolvedValue({ data: undefined });
    const ctx = makeCtx({ get });
    await expect(
      executeReviewsAiTool('reviews_ai__draft_response', { review_id: 'ghost' }, ctx)
    ).rejects.toThrow(/not found/);
  });
});

describe('reviews_ai__triage', () => {
  it('triages reviews with a single sampling call', async () => {
    const collect = vi.fn().mockResolvedValue([
      { id: 'a', attributes: { rating: 1, title: 'Bug', body: 'Crashes', territory: 'USA', createdDate: '2026-07-01' } },
      { id: 'b', attributes: { rating: 5, title: 'Great', body: 'Love it', territory: 'GBR', createdDate: '2026-07-02' } },
    ]);
    const createMessage = vi.fn().mockResolvedValue({ content: { type: 'text', text: 'Bugs: a\nPraise: b' } });
    const ctx = makeCtx({ collect, createMessage });

    const result: any = await executeReviewsAiTool('reviews_ai__triage', { app_id: 'app1' }, ctx);

    expect(result.reviewCount).toBe(2);
    expect(createMessage).toHaveBeenCalledTimes(1);
  });

  it('skips sampling entirely when nothing matches', async () => {
    const collect = vi.fn().mockResolvedValue([]);
    const createMessage = vi.fn();
    const ctx = makeCtx({ collect, createMessage });

    const result: any = await executeReviewsAiTool('reviews_ai__triage', { app_id: 'app1' }, ctx);

    expect(result.reviewCount).toBe(0);
    expect(createMessage).not.toHaveBeenCalled();
  });

  it('rejects a missing app_id', async () => {
    const ctx = makeCtx();
    await expect(executeReviewsAiTool('reviews_ai__triage', {}, ctx)).rejects.toThrow(/app_id/);
  });
});

describe('reviews_ai__daily_briefing', () => {
  it('filters to the lookback window before summarising', async () => {
    const now = Date.now();
    const collect = vi.fn().mockResolvedValue([
      { id: 'old', attributes: { rating: 3, title: 'x', body: 'x', createdDate: new Date(now - 5 * 86_400_000).toISOString() } },
      { id: 'new', attributes: { rating: 4, title: 'y', body: 'y', createdDate: new Date(now - 1000).toISOString() } },
    ]);
    const createMessage = vi.fn().mockResolvedValue({ content: { type: 'text', text: 'Briefing text' } });
    const ctx = makeCtx({ collect, createMessage });

    const result: any = await executeReviewsAiTool(
      'reviews_ai__daily_briefing',
      { app_id: 'app1', days: 1 },
      ctx
    );

    expect(result.reviewCount).toBe(1);
    expect(createMessage).toHaveBeenCalledTimes(1);
  });
});
