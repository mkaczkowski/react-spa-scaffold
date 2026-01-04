# Deployment Guide

Automated deployment to Netlify with GitHub Actions for preview and production environments.

---

## Overview

```
PR Created/Updated → GitHub Actions → Build → Netlify Preview
                                               ↓
                               Comment with preview URL on PR

Push to main → GitHub Actions → Build → Netlify Production
```

**Features:**

- Automatic preview deploys for pull requests
- Production deploys on push to main/master
- PR comments with preview URLs
- Manual deploy via workflow_dispatch
- Security headers pre-configured

**Note:** Enable branch protection rules to require CI to pass before merging to main.

---

## Netlify Setup

### 1. Create Netlify Site

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### 2. Get API Credentials

1. **Personal Access Token** (for `NETLIFY_AUTH_TOKEN`):
   - User Settings → Applications → Personal access tokens
   - Click "New access token", name it, and copy the token

2. **Site ID** (for `NETLIFY_SITE_ID`):
   - Site Settings → General → Site details → Site ID

### 3. Add GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name          | Description                      |
| -------------------- | -------------------------------- |
| `NETLIFY_AUTH_TOKEN` | Personal access token from above |
| `NETLIFY_SITE_ID`    | Site ID from above               |

---

## Environment Variables

### Build-Time Variables

Set in Netlify Dashboard → Site Settings → Environment variables:

| Variable                     | Required      | Description           |
| ---------------------------- | ------------- | --------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | If using auth | Clerk publishable key |
| `VITE_SUPABASE_DATABASE_URL` | If using db   | Supabase project URL  |
| `VITE_SUPABASE_ANON_KEY`     | If using db   | Supabase anon key     |

### Context-Specific Variables

Use Netlify CLI to set variables for specific contexts:

```bash
# Set for all contexts
netlify env:set VAR_NAME value

# Set for production only
netlify env:set VAR_NAME value --context production

# Set for deploy previews only
netlify env:set VAR_NAME value --context deploy-preview
```

---

## Supabase Integration

If using the database feature, connect Supabase to Netlify for automatic environment variable sync.

### Extension Setup

1. **Netlify Dashboard** → Extensions → Search "Supabase" → Install
2. **Project Settings** → General → Supabase → Connect
3. Authorize with Supabase and select your project
4. For Vite projects:
   - Framework: Select "Other"
   - Environment variable prefix: Enter `VITE_`

### Auto-Configured Variables

After connecting, these are automatically injected:

| Variable                     | Description                              |
| ---------------------------- | ---------------------------------------- |
| `VITE_SUPABASE_DATABASE_URL` | Project URL                              |
| `VITE_SUPABASE_ANON_KEY`     | Client API key                           |
| `SUPABASE_SERVICE_ROLE_KEY`  | Server-side only (not exposed to client) |

### Local Development

Run `netlify dev` to inject Supabase variables locally:

```bash
npm install -g netlify-cli
netlify login
netlify link  # Link to your Netlify site
netlify dev   # Starts dev server with injected env vars
```

---

## Preview Deploys

Every pull request automatically gets a preview deployment:

1. Open a PR against main/master
2. GitHub Actions builds and deploys to Netlify
3. Bot comments on PR with preview URL
4. Preview updates on each push to the PR
5. Preview is deleted when PR is closed

### Preview URL Pattern

- PR previews: `https://pr-{number}--{site-name}.netlify.app`
- Branch deploys: `https://{branch}--{site-name}.netlify.app`

---

## Production Deploys

Pushing to main/master triggers production deployment:

1. Deploy workflow builds the app
2. Deploys to production URL: `https://your-site.netlify.app`

**Important:** Enable branch protection rules on main/master to require CI to pass before merging. This ensures production only gets code that passed all checks.

### Manual Deploys

Use workflow_dispatch for manual production deploys:

1. Go to Actions → Deploy → Run workflow
2. Select branch
3. Click "Run workflow"

---

## Configuration

### netlify.toml

The `netlify.toml` file in your project root configures:

- **Build settings**: Command and publish directory
- **Redirects**: SPA fallback to index.html
- **Headers**: Security headers and caching rules
- **Context overrides**: Environment-specific settings

### Customizing Headers

Add custom headers in `netlify.toml`:

```toml
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "https://example.com"
```

### Redirect Rules

Add redirects before the SPA fallback:

```toml
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301

# SPA fallback (keep last)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## CLI Commands

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and link
netlify login
netlify link

# Local development with Netlify env vars
netlify dev

# Manual deploys
npm run deploy:preview   # Deploy preview build
npm run deploy:prod      # Deploy to production

# Environment variables
netlify env:list                    # List all variables
netlify env:set KEY value           # Set variable
netlify env:get KEY                 # Get variable value
netlify env:unset KEY               # Remove variable

# Build locally
netlify build                       # Test production build
netlify build --context deploy-preview  # Test preview build

# Check status
netlify status
```

---

## Troubleshooting

| Issue                              | Cause                        | Solution                                      |
| ---------------------------------- | ---------------------------- | --------------------------------------------- |
| Deploy fails with "Site not found" | Missing `NETLIFY_SITE_ID`    | Add secret to GitHub repository               |
| Deploy fails with "Unauthorized"   | Invalid `NETLIFY_AUTH_TOKEN` | Regenerate token in Netlify                   |
| Preview not commenting on PR       | Missing permissions          | Check workflow has `pull-requests: write`     |
| Env vars undefined in build        | Not set in Netlify           | Add to Netlify Dashboard or use `netlify env` |
| 404 on page refresh                | SPA fallback not working     | Check `netlify.toml` has `/* -> /index.html`  |
| Production deploy not triggered    | CI workflow failed           | Check CI workflow status first                |

### Debug Build Locally

Test production build locally:

```bash
npm run build
npx serve dist

# Or with Netlify CLI:
netlify build
netlify deploy --dir=dist
```

---

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify CLI Reference](https://cli.netlify.com/)
- [File-based Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [GitHub Actions for Netlify](https://github.com/nwtgck/actions-netlify)
- [Netlify Supabase Extension](https://www.netlify.com/integrations/supabase/)
