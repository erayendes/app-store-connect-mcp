# Heimdall pricing demo — regenerate with: vhs assets/demo/pricing.tape
#
# A real interactive Claude Code session over MCP. The only account is the
# invented Nimbus Notes catalogue in fixture-server.mjs; ASC_BASE_URL pins
# every read and write to localhost. The fixture starts at 3.99 USD, accepts
# Apple's per-country subscription price requests and serves the updated table.
# It contains 22 storefronts, not Apple's full catalogue.
#
# pricing__equalize_price uses USA as the anchor, then writes Apple's derived
# price point once per country. Existing subscribers keep their current price.
# The macro's success response contains a count, so the agent reads prices
# afterwards to show the amounts and currencies.
#
# The gate in src/core/confirm.ts requests a form with one required string:
# confirmation, titled "Type CONFIRM to proceed". This tape types into that
# form, never into chat. --allowedTools grants Claude permission to CALL the
# macro; it does not answer Heimdall's separate confirmation.
#
# Claude Code documents interactive terminal forms here:
# https://code.claude.com/docs/en/mcp#respond-to-mcp-elicitation-requests
# Use a current terminal CLI (v2.1.287+), not -p or the desktop Code tab.
# ASC_NATIVE_CONFIRM=0 in mcp-config.json keeps the prompt in the terminal:
# Heimdall otherwise prefers a macOS dialog for clients named claude-code.
# --confirm keeps the gate on even if the parent environment disables it.
#
# The form keystrokes below are guarded by Wait+Screen. If this CLI version
# declines elicitation unseen, the wait fails and no CONFIRM is typed. Keep
# the tool's real refusal on screen; do not replace it with a staged approval
# or a success table. Re-record that refusal by omitting the guarded CONFIRM
# block. No live Claude session or GIF render was run when preparing this tape.
#
# Prerequisites: npm run build, vhs (brew install vhs), openssl, a signed-in
# Claude Code terminal with this checkout already trusted, and port 8787 free.
# Run from the repository root. The EC key generated below is unregistered,
# stays on disk only for the recording and is never printed. The config clears
# inherited key sources. Only this tape's fixture process is stopped afterwards.

Output assets/demo-pricing.gif

Set Shell zsh
Set FontSize 16
Set Width 1400
Set Height 900
Set Padding 20
Set Theme "Catppuccin Mocha"
Set TypingSpeed 35ms
Set PlaybackSpeed 2.0

Hide
Type "setopt interactive_comments"
Enter
Type "openssl ecparam -genkey -name prime256v1 -noout | openssl pkcs8 -topk8 -nocrypt -out assets/demo/demo-key.pem"
Enter
Type "node assets/demo/fixture-server.mjs 8787 >assets/demo/pricing-fixture.log 2>&1 & demo_fixture_pid=$!"
Enter
Type "trap 'kill $demo_fixture_pid 2>/dev/null; rm -f assets/demo/demo-key.pem assets/demo/pricing-fixture.log' EXIT"
Enter
Sleep 1s
# Do not record against a stale fixture if the port was already occupied.
Type "kill -0 $demo_fixture_pid 2>/dev/null || exit 1"
Enter
Type `export IS_DEMO=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`
Enter
# The recording must not pick up the recorder's own instructions (language, rules).
Type `claude() { command claude --append-system-prompt "Respond in English." "$@"; }`
Enter
Type "clear"
Enter
Show

Type "# Set one anchor price. Review the change before it runs."
Enter
Sleep 700ms

Type `claude --mcp-config assets/demo/mcp-config.json --strict-mcp-config \`
Enter
Type `  --setting-sources "" --tools "" \`
Enter
Type `  --allowedTools "mcp__ASC-Monetization__pricing__equalize_price" "mcp__ASC-Monetization__pricing__get_subscription_price"`
Enter
Sleep 5s

Type "Set the Nimbus Notes weekly subscription to $4.99 in the USA and let Apple equalize the rest. Keep existing subscribers on their current price. Use pricing__equalize_price, then read and list the new prices with currencies. If Heimdall refuses the write, quote its refusal and stop."
Enter

# Wait for the actual form title, rather than guessing when the model is done.
Wait+Screen@60s /Type CONFIRM to proceed/
Sleep 3s
Type "CONFIRM"
Enter
Sleep 1s
# The form moves to Accept after the field; press it.
Enter
Sleep 30s

Hide
Ctrl+C
Ctrl+C
Sleep 1s
Type "exit"
Enter
