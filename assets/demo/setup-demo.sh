#!/usr/bin/env bash
# Sandbox for the setup recording. Sourced by assets/demo/setup.tape.
#
# Nothing here touches a real account. See the tape header for the reasoning;
# the short version:
#
#   * ASC_CONFIG_DIR moves the shared config out of ~/.config/asc-mcp.
#   * The Key ID is DEMO123456, so the Keychain entry is a different account
#     from any real one — `security add-generic-password -U` matches on
#     (service, account) — and it is deleted on exit.
#   * ASC_BASE_URL points at the fixture, so Apple is never contacted.
#
# HOME is deliberately NOT redirected: macOS resolves the login keychain under
# $HOME/Library/Keychains, and pointing HOME at an empty directory makes
# `security` pop a "no keychain found" dialog and hang the recording.
set -u

REPO="$PWD"
DEMO_DIR="/tmp/heimdall-setup-demo"
rm -rf "$DEMO_DIR" && mkdir -p "$DEMO_DIR/bin"

export ASC_CONFIG_DIR="$DEMO_DIR/config"
export ASC_BASE_URL="http://127.0.0.1:8787"

# Fixed path: vhs types literal text into the running wizard, which is not a
# shell, so "$VAR" would arrive as four characters.
openssl ecparam -genkey -name prime256v1 -noout 2>/dev/null \
  | openssl pkcs8 -topk8 -nocrypt -out "$DEMO_DIR/AuthKey_DEMO123456.p8" 2>/dev/null

# `asc-mcp` is the real bin name from package.json, so the command on screen is
# what a user with a global install types. It resolves to this checkout because
# the recording needs the unreleased build.
printf '#!/bin/sh\nexec node "%s/dist/index.js" "$@"\n' "$REPO" > "$DEMO_DIR/bin/asc-mcp"
chmod +x "$DEMO_DIR/bin/asc-mcp"
# Defence in depth. The recording clears the client picker so registration has
# nothing to apply, but a stray keystroke landing on "Apply these changes?
# [Y/n]" defaults to yes — that happened once and removed four real servers
# from ~/.claude.json. Shadowing the client CLIs makes the write a no-op even
# if the picker is somehow confirmed.
for shadowed in claude codex; do
  printf '#!/bin/sh\nexit 0\n' > "$DEMO_DIR/bin/$shadowed"
  chmod +x "$DEMO_DIR/bin/$shadowed"
done

export PATH="$DEMO_DIR/bin:$PATH"

lsof -ti tcp:8787 | xargs kill -9 2>/dev/null
node "$REPO/assets/demo/fixture-server.mjs" 8787 >/dev/null 2>&1 &!

cleanup_demo() {
  security delete-generic-password -s asc-mcp -a AuthKey_DEMO123456 >/dev/null 2>&1
  lsof -ti tcp:8787 | xargs kill -9 2>/dev/null
  rm -rf "$DEMO_DIR"
}
trap cleanup_demo EXIT
