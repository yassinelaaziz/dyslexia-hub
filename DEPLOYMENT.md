# Deployment Instructions for Dyslexia-Hub to Cloudflare Pages

## Prerequisites
- Dyslexia-hub repository pushed to GitHub
- Cloudflare account with access to yassinelaaziz.com domain
- pnpm installed locally

## Files Added
- `.nvmrc` (Node 18) - Repository root
- `packages/web/public/_redirects` (SPA routing) - Ensures client-side routing works
- Updated `vite.config.ts` (no base path) - Configured for subdomain deployment

## Cloudflare Pages Deployment Steps

### 1. Create Pages Project
- Go to Cloudflare Dashboard → Workers & Pages
- Click "Create application" → "Pages" → "Connect to Git"
- Select the dyslexia-hub GitHub repository
- Configure build settings:
  - **Project name:** `dyslexia-hub`
  - **Production branch:** `main`
  - **Framework preset:** None (or React/Vite)
  - **Build command:** `pnpm install && pnpm build`
  - **Build output directory:** `packages/web/dist`
  - **Root directory:** `/`
  - **Environment variables:** Add `NODE_VERSION = 18`

### 2. Configure Custom Domain
- In the dyslexia-hub Pages project → Custom domains
- Add: `dyslexia.yassinelaaziz.com`
- Cloudflare will automatically create the DNS record
- Wait for SSL certificate to provision (usually takes a few minutes)

### 3. Verify Deployment
- Push to GitHub → Cloudflare will auto-deploy
- Visit `https://dyslexia.yassinelaaziz.com`
- Test that SPA routing works (refresh on different routes)
- Verify assets load correctly

## Notes
- Auto-deployment is enabled by default on push to main branch
- Preview deployments are available for pull requests
- No proxy logic needed - direct routing to subdomain
- Build occurs in Cloudflare's environment using Node 18
- The `_redirects` file ensures all routes serve index.html for client-side routing
- React Router uses default basename "/" which is correct for subdomain deployment

## Local Build Testing
To test the build locally before deploying:
```bash
cd C:\Users\Yassi\Documents\a\Documents\apps\Research\dyslexia\projects\applications\dyslexia-hub
pnpm build
```

The build output will be in `packages/web/dist`.
