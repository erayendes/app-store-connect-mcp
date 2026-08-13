# Heimdall README demo — regenerate with: vhs assets/demo/demo.tape
#
# A real agent session over real MCP against a real Heimdall server. Only the
# App Store Connect account is invented: assets/demo/fixture-server.mjs stands
# in for Apple so the GIF can be public without confirming what a real account
# holds. Playback is sped up; the session takes about 20 seconds in real time.
#
# The server needs a key to start, because TokenProvider signs an ES256 JWT
# per request — the fixture never checks it, but it has to be a real EC key.
# One is generated below and written to assets/demo/demo-key.pem, which
# .gitignore's *.pem already covers. Nothing about it is committed: a private
# key in a public repo is inert here and still trips every scanner that sees
# one, and a reader has to take "throwaway" on trust.
#
# Prerequisites: npm run build, `vhs` on PATH (brew install vhs), openssl.

Output assets/demo.gif

Set Shell zsh
Set FontSize 16
Set Width 1200
Set Height 500
Set Padding 20
Set Theme "Catppuccin Mocha"
Set TypingSpeed 40ms
Set PlaybackSpeed 3.0

# Stand-in for Apple. Killed first in case a previous run left one behind —
# a stale listener silently serves stale data and the recording looks fine.
Hide
Type "cd $PWD"
Enter
Type "lsof -ti tcp:8787 | xargs -r kill -9 2>/dev/null; sleep 1"
Enter
Type "openssl ecparam -genkey -name prime256v1 -noout | openssl pkcs8 -topk8 -nocrypt -out assets/demo/demo-key.pem"
Enter
Type "setopt interactive_comments; node assets/demo/fixture-server.mjs 8787 >/dev/null 2>&1 &!"
Enter
Sleep 2s
Type "clear"
Enter
Show

Type "# One question. 22 storefronts. One tool call."
Enter
Sleep 700ms

Type `claude -p "What does the Nimbus Notes weekly subscription cost around the world?" \`
Enter
Type `  --mcp-config assets/demo/mcp-config.json --strict-mcp-config \`
Enter
Type `  --allowedTools "mcp__asc-monetization__pricing__get_subscription_price" </dev/null`
Enter

Sleep 30s

Hide
Type "lsof -ti tcp:8787 | xargs -r kill -9 2>/dev/null"
Enter
Show
Sleep 2500ms
