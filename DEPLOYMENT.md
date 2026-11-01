# Deployment Instructions for Dyslexia-Hub to Cloudflare Pages (Workers Builds)

This document provides step-by-step instructions to deploy the dyslexia-hub Vite/React application to Cloudflare Pages on the subdomain `dyslexia.yassinelaaziz.com`.

## Prerequisites
- Dyslexia-hub repository pushed to GitHub
- Cloudflare account with access to yassinelaaziz.com domain
- pnpm installed locally

## Files Added
- `.nvmrc` (Node 20) - Repository root
- `packages/web/wrangler.jsonc` (Workers config) - Wrangler configuration for SPA deployment

## Cloudflare Pages Deployment Steps (Workers Builds)

### 1. Create Pages Project
- Go to Cloudflare Dashboard → Workers & Pages
- Click "Create application" → "Pages" → "Connect to Git"
- Select the dyslexia-hub GitHub repository
- Configure build settings:
  - **Project name:** `dyslexia-hub`
  - **Production branch:** `main`
  - **Framework preset:** None
  - **Root directory:** `/` (runs pnpm commands at monorepo root)
  - **Build command:** `pnpm install && pnpm build`
  - **Deploy command:** `cd packages/web && npx wrangler deploy`
  - **Environment variables:** `NODE_VERSION = 20`

### 2. Configure Custom Domain
- In the dyslexia-hub Pages project → Settings → Domains & Routes
- Click "Add Custom Domain"
- Add: `dyslexia.yassinelaaziz.com`
- Cloudflare will automatically create the DNS record
- Wait for SSL certificate to provision (usually takes a few minutes)

### 3. Verify Deployment
- Push to GitHub → Cloudflare will auto-deploy
- Visit `https://dyslexia.yassinelaaziz.com`
- Test that SPA routing works (refresh on different routes)
- Verify assets load correctly

## Notes
- This is a **Workers Builds** project (not classic Pages), so it requires a deploy command
- The deploy command runs wrangler from the packages/web directory where wrangler.jsonc is located
- SPA fallback is configured in wrangler.jsonc (`not_found_handling: "single-page-application"`)
- Workers static assets does not read `_redirects` files (that's Pages-only)
- Auto-deployment is enabled by default on push to main branch
- Preview deployments are available for pull requests
- Build occurs in Cloudflare's environment using Node 20

## Local Build Testing
To test the build locally before deploying:
```bash
cd C:\Users\Yassi\Documents\a\Documents\apps\Research\dyslexia\projects\applications\dyslexia-hub
pnpm build
```

The build output will be in `packages/web/dist`.
