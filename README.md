# immich-modal-proxy

A Cloudflare Worker that acts as an authenticated reverse proxy for [Immich](https://immich.app/) machine learning inference hosted on [Modal](https://modal.com/).

## Architecture

```
Immich Server --> CF Worker (auth) --> Modal (GPU inference)
```

- Intercepts `/ping` locally for health checks
- Forwards all other requests (e.g. `/predict`) to the Modal endpoint
- Attaches a shared secret via `X-Modal-Proxy-Key` header for authentication

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure secrets

```bash
npx wrangler secret put MODAL_PROXY_KEY    # shared secret (must match Modal side)
npx wrangler secret put MODAL_URL          # e.g. https://your-user--immich-machine-learning-serve.modal.run
```

### 3. Deploy

```bash
npx wrangler deploy
```

### 4. Configure Immich

In Immich, go to **Administration > System Settings > Machine Learning** and set the URL to your Cloudflare Worker URL.

## Development

```bash
npx wrangler dev
```

## Related

- [immich-modal](https://github.com/zxzx1290/immich-modal) - The Modal-side GPU inference server with key verification
