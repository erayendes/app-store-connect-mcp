# Dockerfile — used only for automated introspection: it boots the MCP server so a
# directory or scanner can call tools/list. Nothing about installing Heimdall goes
# through it; real users run `npx -y @erayendes/asc-mcp setup`, see README.
#
# Named consumers, because the header claimed two that do not read this file:
#   Glama          builds from its own spec, not from here — debian:trixie-slim, pnpm,
#                  mcp-proxy, cloning the repo at a pinned commit. Editing this file
#                  changes nothing about a Glama build, and a Glama build failure is
#                  not evidence of anything in it.
#   MCP Registry   server.json declares one npm package and no Docker image, so the
#                  registry installs from npm and never builds this either.
# What is left is any directory that looks for a Dockerfile and boots it. That is worth
# supporting and costs one file — but nobody specific is known to, so do not read a
# green build here as a consumer being satisfied.
#
# The ASC_* values below are throwaway placeholders: the key is generated during the
# build, is NOT registered with Apple and authorizes nothing — it only lets the server
# start for introspection, which never calls Apple.
#
# Generated rather than pasted. The literal that used to sit here was inert, and it was
# still a PEM in a public repository: every secret scanner flags one, and a reader has to
# take "throwaway" on trust. A fresh key per build costs nothing and claims nothing.
FROM node:26-alpine@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV ASC_KEY_ID=AAAAAAAAAA
ENV ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000
# node, not openssl: the CLI is not in node:*-alpine, and node is the one thing
# every stage here already depends on.
RUN node -e "const {generateKeyPairSync}=require('node:crypto'); \
  const {privateKey}=generateKeyPairSync('ec',{namedCurve:'prime256v1'}); \
  require('node:fs').writeFileSync('/app/introspection-key.pem', privateKey.export({type:'pkcs8',format:'pem'}));"
ENV ASC_PRIVATE_KEY_PATH=/app/introspection-key.pem
# A profile, because that is how the server is meant to be run: `setup` writes one,
# the guide documents one, and the whole surface at once is the configuration the docs
# warn against. Booting bare showed introspection a shape no real install has.
# `distribution` is representative rather than flattering — release, builds and review,
# the most common workflow. A smaller profile would score better and prove less.
CMD ["node", "dist/index.js", "distribution"]
