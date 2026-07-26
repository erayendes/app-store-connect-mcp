/**
 * Write confirmation guard.
 *
 * Mutating tools (anything not marked readOnlyHint) can change real App Store
 * Connect data — prices, submissions, deletions. Before running one, we ask the
 * user to confirm via MCP elicitation, so a vague or misread instruction ("set
 * the price to 0.99") can't execute unchecked. The guard is on by default and
 * turned off with ASC_CONFIRM_WRITES=0 / --no-confirm.
 *
 * Elicitation only works on clients that declared the capability. On clients
 * that didn't, we can't pop a prompt, so we proceed and rely on the client's own
 * per-call approval — warning once on stderr so the weaker guarantee is visible
 * rather than silent.
 */

/** The slice of the MCP Server we need — kept tiny so the logic is unit-testable. */
export interface WriteConfirmer {
  // `form` is only checked for truthiness — the SDK types it as an object, so
  // `unknown` keeps this compatible with the real ClientCapabilities shape.
  getClientCapabilities(): { elicitation?: { form?: unknown } } | undefined;
  elicitInput(params: unknown): Promise<{ action: string; content?: Record<string, unknown> }>;
}

export interface ConfirmDecision {
  allowed: boolean;
  /** Present when blocked: 'decline' | 'cancel' | 'not confirmed'. */
  reason?: string;
}

/**
 * Decides whether a write may proceed. Pure but for the injected confirmer and
 * the one-time warn callback, so tests drive it with fakes.
 */
export async function confirmWrite(
  confirmer: WriteConfirmer,
  toolName: string,
  warnNoElicitation: () => void
): Promise<ConfirmDecision> {
  if (!confirmer.getClientCapabilities()?.elicitation?.form) {
    warnNoElicitation();
    return { allowed: true };
  }

  const result = await confirmer.elicitInput({
    mode: 'form',
    message:
      `Heimdall is about to run "${toolName}", which changes your App Store ` +
      `Connect data. Allow it?`,
    requestedSchema: {
      type: 'object',
      properties: {
        confirm: {
          type: 'boolean',
          title: `Allow "${toolName}"?`,
          description: 'Leave unchecked to cancel this write.',
        },
      },
      required: ['confirm'],
    },
  });

  if (result.action === 'accept' && result.content?.confirm === true) {
    return { allowed: true };
  }
  return { allowed: false, reason: result.action === 'accept' ? 'not confirmed' : result.action };
}
