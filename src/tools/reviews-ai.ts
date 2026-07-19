/**
 * AI-assisted review tools built on MCP Sampling — the calling client's own
 * model, not a separate API key. Every tool here only reads reviews or
 * returns a draft; none of them post to App Store Connect. Use
 * customer_review_responses__create yourself once you've reviewed a draft.
 */
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { McpToolDefinition } from '../core/registry.js';
import type { AscHttpClient } from '../core/http.js';

export const REVIEWS_AI_TOOLS: McpToolDefinition[] = [
  {
    name: 'reviews_ai__draft_response',
    description:
      "Draft a reply to one customer review using the client's own model (MCP Sampling). " +
      'Returns text only — never posts. Review the draft, then post it yourself with ' +
      'customer_review_responses__create if you approve it.',
    inputSchema: {
      type: 'object',
      properties: {
        review_id: {
          type: 'string',
          description: 'Customer review ID (from apps__customer_reviews__list).',
        },
        tone: {
          type: 'string',
          description: 'Optional tone guidance, e.g. "apologetic", "brief", "enthusiastic".',
        },
      },
      required: ['review_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'reviews_ai__triage',
    description:
      "Fetch recent reviews for an app and group them by theme (bug, feature request, " +
      "pricing complaint, praise, spam) using the client's own model. Read-only.",
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'App ID to triage reviews for.' },
        limit: {
          type: 'number',
          description: 'How many recent reviews to pull (default 50, max 200).',
        },
        unanswered_only: {
          type: 'boolean',
          description: 'Only include reviews without a developer response (default true).',
        },
      },
      required: ['app_id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'reviews_ai__daily_briefing',
    description:
      'Summarise the last N days of reviews for an app: volume and rating trend, top ' +
      "complaints, standout praise, one suggested action. Uses the client's own model. " +
      'Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'App ID to report on.' },
        days: { type: 'number', description: 'Lookback window in days (default 1, max 30).' },
      },
      required: ['app_id'],
    },
    annotations: { readOnlyHint: true },
  },
];

export const REVIEWS_AI_TOOL_NAMES = new Set(REVIEWS_AI_TOOLS.map((t) => t.name));

// Keeps the sampling prompt bounded regardless of how many reviews matched.
const MAX_REVIEW_CHARS = 6000;

function reviewText(r: any): string {
  const a = r?.attributes ?? {};
  return `[${r?.id}] ${a.rating ?? '?'}★ "${a.title ?? ''}" — ${a.body ?? ''} (${a.territory ?? ''}, ${a.createdDate ?? ''})`;
}

async function sample(
  server: Server,
  systemPrompt: string,
  userText: string,
  maxTokens: number
): Promise<string> {
  const res = await server.createMessage({
    messages: [{ role: 'user', content: { type: 'text', text: userText } }],
    systemPrompt,
    maxTokens,
  });
  return res.content?.type === 'text' ? res.content.text : JSON.stringify(res.content);
}

export interface ReviewsAiContext {
  server: Server;
  http: AscHttpClient;
}

export async function executeReviewsAiTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ReviewsAiContext
): Promise<unknown> {
  switch (name) {
    case 'reviews_ai__draft_response': {
      const reviewId = String(args.review_id ?? '');
      if (!reviewId) throw new Error('review_id is required.');

      const res: any = await ctx.http.get(`/v1/customerReviews/${encodeURIComponent(reviewId)}`);
      const review = res?.data;
      if (!review) throw new Error(`Review ${reviewId} not found.`);

      const tone = args.tone ? String(args.tone) : 'professional and warm';
      const draft = await sample(
        ctx.server,
        `You draft App Store review replies for a developer. Tone: ${tone}. ` +
          "Apple limits responses to 350 characters — stay under that. " +
          'Never invent facts about the app or promise unconfirmed fixes. Output the reply text only.',
        reviewText(review),
        300
      );

      return {
        review: { id: review.id, ...review.attributes },
        draft,
        note: 'Draft only. Post it with customer_review_responses__create if you approve it.',
      };
    }

    case 'reviews_ai__triage': {
      const appId = String(args.app_id ?? '');
      if (!appId) throw new Error('app_id is required.');
      const limit = Math.max(1, Math.min(Number(args.limit ?? 50), 200));
      const unansweredOnly = args.unanswered_only !== false;

      const items = await ctx.http.collect(
        `/v1/apps/${encodeURIComponent(appId)}/customerReviews`,
        {
          sort: '-createdDate',
          limit: Math.min(limit, 200),
          ...(unansweredOnly ? { 'exists[publishedResponse]': false } : {}),
        },
        Math.ceil(limit / 200)
      );

      const reviews = items.slice(0, limit);
      if (reviews.length === 0) {
        return { appId, reviewCount: 0, triage: 'No reviews matched the filters.' };
      }

      const body = reviews.map(reviewText).join('\n').slice(0, MAX_REVIEW_CHARS);
      const triage = await sample(
        ctx.server,
        'You triage App Store customer reviews for a developer. Group them into: ' +
          'Bug reports, Feature requests, Pricing complaints, Praise, Spam/irrelevant. ' +
          'Under each group, list the review IDs and a one-line summary. Flag anything ' +
          'urgent (crashes, data loss, billing issues) at the top. Be concise.',
        body,
        1200
      );

      return { appId, reviewCount: reviews.length, triage };
    }

    case 'reviews_ai__daily_briefing': {
      const appId = String(args.app_id ?? '');
      if (!appId) throw new Error('app_id is required.');
      const days = Math.max(1, Math.min(Number(args.days ?? 1), 30));
      const since = Date.now() - days * 86_400_000;

      const items = await ctx.http.collect(
        `/v1/apps/${encodeURIComponent(appId)}/customerReviews`,
        { sort: '-createdDate', limit: 200 },
        3
      );

      const recent = items.filter((r: any) => {
        const created = Date.parse(r?.attributes?.createdDate ?? '');
        return Number.isFinite(created) && created >= since;
      });

      if (recent.length === 0) {
        return { appId, days, reviewCount: 0, briefing: `No reviews in the last ${days} day(s).` };
      }

      const body = recent.map(reviewText).join('\n').slice(0, MAX_REVIEW_CHARS);
      const briefing = await sample(
        ctx.server,
        `Write a short daily briefing (under 200 words) for a developer covering the last ` +
          `${days} day(s) of App Store reviews: volume and rating trend, the most common ` +
          'complaint, the best praise, and one suggested action.',
        body,
        600
      );

      return { appId, days, reviewCount: recent.length, briefing };
    }

    default:
      throw new Error(`Unknown reviews AI tool: ${name}`);
  }
}
