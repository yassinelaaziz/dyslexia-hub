# Cloudflare Pages Deployment Guide for AI Assistant

This guide provides step-by-step instructions for an AI assistant to deploy the dyslexia-hub application to Cloudflare Pages on the subdomain `dyslexia.yassinelaaziz.com`.

## Prerequisites (Verify Before Starting)

1. **Repository Location:**
   - Path: `C:\Users\Yassi\Documents\a\Documents\apps\Research\dyslexia\projects\applications\dyslexia-hub`
   - Must have its own git repository (initialized at `.git`)

2. **Repository Status:**
   - Check: `git status` - should show clean working directory
   - Check: `git log` - should show commit history
   - Latest commit should include deployment configuration files

3. **Required Files Present:**
   - `.nvmrc` (contains: `18`)
   - `packages/web/public/_redirects` (contains: `/*    /index.html   200`)
   - `DEPLOYMENT.md` (deployment instructions)
   - `packages/web/public/docs/` (documentation files, optional but recommended)

4. **Build Verification:**
   - Run: `pnpm build`
   - Expected: Build succeeds with output in `packages/web/dist/`
   - Build time: ~10-12 seconds
   - Output should include: index.html, assets/, _redirects

## Step 1: Push Repository to GitHub

**Action Required:** The dyslexia-hub repository must be pushed to GitHub first.

**If not already on GitHub:**
1. Create a new repository on GitHub (name: `dyslexia-hub`)
2. Initialize local repository if needed: `git init` (already done)
3. Add remote: `git remote add origin https://github.com/YOUR_USERNAME/dyslexia-hub.git`
4. Push: `git push -u origin master`

**If already on GitHub:**
1. Verify remote: `git remote -v`
2. Push latest commits: `git push origin master`

## Step 2: Access Cloudflare Dashboard

1. Log in to Cloudflare Dashboard: https://dash.cloudflare.com/
2. Navigate to: Workers & Pages
3. Click: "Create application"
4. Select: "Pages" → "Connect to Git"

## Step 3: Connect GitHub Repository

1. Click: "Connect to Git"
2. Authorize Cloudflare to access your GitHub account (if not already authorized)
3. Select the `dyslexia-hub` repository from the list
4. Click: "Begin setup"

## Step 4: Configure Build Settings

**Project Configuration:**
- **Project name:** `dyslexia-hub`
- **Production branch:** `master`
- **Framework preset:** None (or select "Vite" if available)
- **Build command:** `pnpm install && pnpm build`
- **Build output directory:** `packages/web/dist`
- **Root directory:** `/` (leave as default)

**Environment Variables:**
- Add: `NODE_VERSION = 18`
- This ensures Cloudflare uses Node.js 18 (as specified in .nvmrc)

**Advanced Settings:**
- Ensure "Git integration" is enabled (for auto-deployment)
- No need to change other advanced settings

## Step 5: Deploy and Verify

1. Click: "Save and Deploy"
2. Wait for initial deployment to complete (typically 2-5 minutes)
3. Cloudflare will:
   - Clone the repository
   - Install dependencies with pnpm
   - Run build command
   - Serve from `packages/web/dist`
4. Monitor deployment logs for any errors

**If deployment fails:**
- Check build logs for errors
- Common issues:
  - pnpm not found → Ensure Node version is set correctly
  - Build command fails → Test locally with `pnpm build`
  - Missing files → Verify all files are committed to git

## Step 6: Configure Custom Domain

1. In the dyslexia-hub Pages project, click: "Custom domains"
2. Click: "Set up a custom domain"
3. Enter: `dyslexia.yassinelaaziz.com`
4. Click: "Continue"

**DNS Configuration:**
- Cloudflare will automatically create the DNS record
- Record type: CNAME
- Points to: Cloudflare Pages (automatic)
- Wait for DNS propagation (usually 1-5 minutes)

**SSL Certificate:**
- Cloudflare will automatically provision SSL certificate
- Wait for certificate to be issued (usually 2-10 minutes)
- Status will show "Active" when ready

## Step 7: Verify Deployment

1. Visit: `https://dyslexia.yassinelaaziz.com`
2. Test navigation:
   - Home page loads
   - Understand Dyslexia works
   - Screening works
   - Training works
   - Research works
3. Test SPA routing:
   - Navigate to `/understand/brain-neurology`
   - Refresh the page
   - Should still load correctly (thanks to _redirects)
4. Test assets:
   - CSS loads correctly
   - JavaScript loads correctly
   - No 404 errors in browser console

## Step 8: Test Documentation (Development Only)

Documentation is only available in development mode and will NOT be visible in production.

**To verify production behavior:**
1. Open browser DevTools
2. Check that "Documentation" link is NOT visible in navigation
3. Try accessing `/docs` directly - should show 404 page
4. This confirms the environment check is working correctly

## Step 9: Configure Auto-Deployment

Auto-deployment is enabled by default for pushes to the `master` branch.

**To disable (if needed):**
1. Go to Pages project → Settings
2. Navigate to: Builds & deployments
3. Toggle off: "Auto-deploy commits"

**Preview Deployments:**
- Cloudflare automatically creates preview deployments for pull requests
- Accessible via Cloudflare dashboard
- Useful for testing before merging to master

## Troubleshooting

**Issue: Build fails with "pnpm not found"**
- Solution: Ensure `NODE_VERSION = 18` is set in environment variables

**Issue: SPA routing doesn't work on refresh**
- Solution: Verify `packages/web/public/_redirects` exists and contains `/*    /index.html   200`

**Issue: Assets return 404**
- Solution: Verify build output directory is set to `packages/web/dist`

**Issue: Documentation shows in production**
- Solution: Verify the environment check is using `import.meta.env.MODE === 'development'`

**Issue: DNS doesn't resolve**
- Solution: Wait for DNS propagation (up to 24 hours), check DNS records in Cloudflare

## Post-Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Cloudflare Pages project created
- [ ] Build settings configured correctly
- [ ] Custom domain added: dyslexia.yassinelaaziz.com
- [ ] SSL certificate provisioned
- [ ] Site loads at https://dyslexia.yassinelaaziz.com
- [ ] SPA routing works on refresh
- [ ] All navigation links work
- [ ] No console errors
- [ ] Documentation hidden in production
- [ ] Auto-deployment enabled (if desired)

## Maintenance

**To update the site:**
1. Make changes locally
2. Commit changes: `git add -A && git commit -m "description"`
3. Push: `git push origin master`
4. Cloudflare auto-deploys (typically within 1-2 minutes)

**To rollback:**
1. Revert commit locally: `git revert HEAD`
2. Push: `git push origin master`
3. Cloudflare auto-deploys the rollback

## Contact Information

For issues with:
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Domain issues:** Contact domain administrator
- **Build issues:** Check local build with `pnpm build`
