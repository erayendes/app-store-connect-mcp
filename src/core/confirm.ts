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
 * that didn't, we can't pop a prompt — and silently proceeding would mean the
 * guard the user thinks is on is actually off. So the default is fail-closed:
 * the write is blocked with an error naming the escape hatch. Passing
 * `allowUnconfirmed` (--allow-unconfirmed-writes / ASC_ALLOW_UNCONFIRMED_WRITES=1)
 * restores the old behaviour: proceed and rely on the client's own per-call
 * approval, warning once on stderr.
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
  /** Present when blocked: 'decline' | 'cancel' | 'not confirmed' | 'no-elicitation'. */
  reason?: string;
}

/**
 * Decides whether a write may proceed. Pure but for the injected confirmer and
 * the one-time warn callback, so tests drive it with fakes.
 */
export async function confirmWrite(
  confirmer: WriteConfirmer,
  toolName: string,
  warnNoElicitation: () => void,
  allowUnconfirmed = false
): Promise<ConfirmDecision> {
  if (!confirmer.getClientCapabilities()?.elicitation?.form) {
    // No way to ask the user. Fail closed unless they explicitly opted into
    // unconfirmed writes — a guard that silently stops guarding is worse than
    // an error that says why.
    if (allowUnconfirmed) {
      warnNoElicitation();
      return { allowed: true };
    }
    return { allowed: false, reason: 'no-elicitation' };
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
