# Dockerfile — used only for automated introspection (Glama / MCP Registry checks).
# It boots the MCP server so a harness can call tools/list. The ASC_* values below are
# throwaway placeholders: a self-generated EC key that is NOT registered with Apple and
# authorizes nothing — it only lets the server start for introspection (which never calls
# Apple). Real users configure credentials via `npx -y @erayendes/asc-mcp setup`; see README.
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV ASC_KEY_ID=AAAAAAAAAA
ENV ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000
ENV ASC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgB0n4fZRe2byJJ1e0\nKwadtouzBaZznbVIpcOyQOML5J+hRANCAAR69v/Z9bUioOKj8f0ld8f0/dGjn0fJ\nNyaO0nme1OCqeX8xqdTd1/5eDEgWtUHxvBpTmKz1fz3SI69W9kOcJYF7\n-----END PRIVATE KEY-----\n"
CMD ["node", "dist/index.js"]
