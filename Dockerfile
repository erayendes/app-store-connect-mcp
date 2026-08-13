# Dockerfile — used only for automated introspection (Glama / MCP Registry checks).
# It boots the MCP server so a harness can call tools/list. The ASC_* values below are
# throwaway placeholders: the key is generated during the build, is NOT registered with
# Apple and authorizes nothing — it only lets the server start for introspection (which
# never calls Apple). Real users configure credentials via `npx -y @erayendes/asc-mcp
# setup`; see README.
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
# The image already carries a private key file, throwaway or not. Running as
# root gives anything that reaches this process write access to the whole app
# tree; `node` ships in the base image and needs nothing root can offer.
RUN chown -R node:node /app && chmod 600 /app/introspection-key.pem
USER node
# A profile, because that is how the server is meant to be run: `setup` writes one,
# the guide documents one, and the whole surface at once is the configuration the docs
# warn against. Booting bare showed introspection a shape no real install has.
# `distribution` is representative rather than flattering — release, builds and review,
# the most common workflow. A smaller profile would score better and prove less.
CMD ["node", "dist/index.js", "distribution"]
