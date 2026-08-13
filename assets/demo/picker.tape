# Heimdall profile picker — regenerate with: vhs assets/demo/picker.tape
#
# The picker is the part of setup that is hard to describe and easy to show:
# checking a profile unfolds its sub-profiles under the cursor, so
# `monetization` at 206 tools narrows to the 24 you actually want without
# anyone editing a config by hand.
#
# The credential half of the wizard is recorded but hidden — only the picker
# is in frame. Sandbox rules are the same as setup.tape: see that header.
#
# The client picker is cleared with `a` `a` (select all, then clear), which
# does two things: nothing can be registered, and the profile picker then opens
# with nothing pre-checked instead of mirroring whatever this machine already
# has registered.

Output assets/picker.gif

Set Shell zsh
# Wide on purpose: each row is label + token estimate + description, and at a
# narrower width every row wraps onto two lines and the list stops being
# scannable — which is the one thing the picker is for.
Set FontSize 15
Set Width 1400
Set Height 660
Set Padding 20
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms
Set PlaybackSpeed 1.6

Hide
Type "cd $PWD && source assets/demo/setup-demo.sh && clear"
Enter
Sleep 3s
Type "asc-mcp setup"
Enter
Sleep 3s
Type "n"
Enter
Sleep 1s
Type "DEMO123456"
Enter
Sleep 1s
Type "57246e4f-1a2b-4c3d-9e8f-0123456789ab"
Enter
Sleep 1s
Type "/tmp/heimdall-setup-demo/AuthKey_DEMO123456.p8"
Enter
Sleep 6s
Enter
Sleep 4s
# Client picker: clear it so nothing registers and the next picker opens clean.
Type "a"
Sleep 400ms
Type "a"
Sleep 400ms
Enter
Sleep 4s
Show

# Profile picker is on screen now. Walk down to monetization.
Sleep 1500ms
Down
Sleep 250ms
Down
Sleep 250ms
Down
Sleep 250ms
Down
Sleep 250ms
Down
Sleep 250ms
Down
Sleep 250ms
Down
Sleep 250ms
Down
Sleep 1200ms

# Check it — the sub-profiles unfold underneath.
Space
Sleep 2500ms

# Step into the sub-profiles and drop the ones this job does not need.
Down
Sleep 500ms
Down
Sleep 400ms
Space
Sleep 700ms
Down
Sleep 400ms
Space
Sleep 700ms
Down
Sleep 400ms
Space
Sleep 2000ms

Enter
Sleep 2500ms

Hide
Ctrl+C
Sleep 1s
