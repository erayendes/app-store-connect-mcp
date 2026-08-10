# Dockerfile — used only for automated introspection (Glama / MCP Registry checks).
# It boots the MCP server so a harness can call tools/list. The ASC_* values below are
# throwaway placeholders: a self-generated EC key that is NOT registered with Apple and
# authorizes nothing — it only lets the server start for introspection (which never calls
# Apple). Real users configure credentials via `npx -y @erayendes/asc-mcp setup`; see README.
FROM node:26-alpine@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV ASC_KEY_ID=AAAAAAAAAA
ENV ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000
ENV ASC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgB0n4fZRe2byJJ1e0\nKwadtouzBaZznbVIpcOyQOML5J+hRANCAAR69v/Z9bUioOKj8f0ld8f0/dGjn0fJ\nNyaO0nme1OCqeX8xqdTd1/5eDEgWtUHxvBpTmKz1fz3SI69W9kOcJYF7\n-----END PRIVATE KEY-----\n"
# A profile, because that is how the server is meant to be run: `setup` writes one,
# the guide documents one, and the whole surface at once is the configuration the docs
# warn against. Booting bare showed introspection a shape no real install has.
# `distribution` is representative rather than flattering — release, builds and review,
# the most common workflow. A smaller profile would score better and prove less.
CMD ["node", "dist/index.js", "distribution"]
