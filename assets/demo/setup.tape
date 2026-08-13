# Heimdall setup demo — regenerate with: vhs assets/demo/setup.tape
#
# Records the real `asc-mcp setup` wizard. Nothing here touches a real account:
#
#   * ASC_CONFIG_DIR moves the shared config out of ~/.config/asc-mcp. HOME is
#     deliberately left alone: macOS looks for the login keychain under
#     $HOME/Library/Keychains, and an empty HOME makes `security` pop a
#     "no keychain found" dialog and hang the recording.
#   * The recording stops before client registration, so no MCP client config
#     is ever written.
#   * The Key ID is DEMO123456, so the Keychain entry it writes is
#     asc-mcp/AuthKey_DEMO123456 — a different account from any real one, since
#     `security add-generic-password -U` matches on (service, account).
#     assets/demo/setup-demo.sh deletes it afterwards.
#   * The .p8 is a throwaway EC key generated on the spot, registered with
#     nobody, at a fixed path because vhs types literal text — it is not a
#     shell, so a "$VAR" would arrive as four characters.
#   * ASC_BASE_URL points at the fixture server, so Apple is never contacted and
#     the credential check passes on invented data.
#
# Prerequisites: npm run build, vhs on PATH.

Output assets/setup.gif

Set Shell zsh
# Wide enough that the picker rows do not wrap — see picker.tape.
Set FontSize 15
Set Width 1400
Set Height 780
Set Padding 20
Set Theme "Catppuccin Mocha"
Set TypingSpeed 35ms
Set PlaybackSpeed 3.0

Hide
Type "cd $PWD && source assets/demo/setup-demo.sh && clear"
Enter
Sleep 3s
Show

Type "asc-mcp setup"
Enter
Sleep 3s

# "Open the keys page in your browser?" — no, this is a recording.
Type "n"
Enter
Sleep 1200ms

Type "DEMO123456"
Enter
Sleep 900ms

Type "57246e4f-1a2b-4c3d-9e8f-0123456789ab"
Enter
Sleep 900ms

Type "/tmp/heimdall-setup-demo/AuthKey_DEMO123456.p8"
Enter
# The wizard verifies against Apple here. Keystrokes sent while it waits are
# swallowed and every prompt after them lands one behind, so this sleep has to
# outlast the round trip.
Sleep 5s

# Vendor number — optional, skip it.
Enter
Sleep 3s

# Client picker, hidden and cleared with `a` `a` (select all, then clear).
#
# Not cosmetic. With no client selected there is nothing for the final
# "Apply these changes? [Y/n]" step to write, and that prompt defaults to yes —
# an earlier cut of this tape drifted by one keystroke, answered it, and
# removed four real servers from ~/.claude.json. Safety here has to be
# structural rather than a well-timed Ctrl+C.
Hide
Sleep 5s
Type "a"
Sleep 400ms
Type "a"
Sleep 400ms
Enter
Sleep 4s
Show

# Profile picker. Walk down to monetization and check it — the sub-profiles
# unfold underneath, which is the whole point of the picker and was invisible
# in the first cut of this recording.
Sleep 1500ms
Down
Sleep 200ms
Down
Sleep 200ms
Down
Sleep 200ms
Down
Sleep 200ms
Down
Sleep 200ms
Down
Sleep 200ms
Down
Sleep 200ms
Down
Sleep 1000ms
Space
Sleep 2500ms

# Drop the sub-profiles this job does not need: 197 tools becomes a handful.
Down
Sleep 400ms
Down
Sleep 350ms
Space
Sleep 600ms
Down
Sleep 350ms
Space
Sleep 600ms
Down
Sleep 350ms
Space
Sleep 1800ms
Enter
Sleep 4s

# Bundle ID — optional, skip it. Then the keychain write and the config path
# land, which is the part worth seeing.
Enter
Sleep 7s

# Stop here. The next prompt confirms writing to real MCP client configs, and
# the recording must never answer it.
Ctrl+C
Sleep 2s
