# GitHub Pages Setup Guide for LCP Specification

This guide will help you deploy the LCP documentation website to GitHub Pages.

## Quick Start

The documentation website is now fully configured and ready to deploy. Follow these steps:

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/Turf-Tech/lcp-spec

2. Click on **Settings** (top navigation)

3. In the left sidebar, click **Pages**

4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
   - This will use the automated deployment workflow we've set up

5. Click **Save**

### Step 2: Trigger the Deployment

The deployment will automatically trigger when you:
- Push changes to the `main` branch that affect:
  - `website/**` directory
  - `docs/**` directory
  - `.github/workflows/deploy-docs.yml` file

Or you can manually trigger it:
1. Go to **Actions** tab
2. Click on "Deploy Documentation to GitHub Pages" workflow
3. Click "Run workflow" dropdown
4. Click "Run workflow" button

### Step 3: Wait for Deployment

The deployment process takes about 2-3 minutes:

1. Go to **Actions** tab to watch the progress
2. You'll see two jobs:
   - **Build Docusaurus** - Builds the static website
   - **Deploy to GitHub Pages** - Deploys to GitHub Pages

3. Wait for both to complete (green checkmark ✓)

### Step 4: Access Your Site

Once deployed, your documentation will be available at:

**https://turf-tech.github.io/lcp-spec/**

## Verifying the Deployment

1. **Check the Actions tab** for successful workflow runs
2. **Visit the URL** to see your live documentation
3. **Test navigation** - ensure all pages and links work
4. **Check the sidebar** - verify category structure is correct

## Features of the Documentation Site

### Navigation
- **Documentation** - Access all specification documents
- **Website** - Return to main site
- **GitHub** - Link to repository

### Sidebar Structure
```
Overview
├─ Introduction to LCP

Specification
├─ 1. Introduction
├─ 2. Architecture
└─ 3. Core Components

Protocol Layers
├─ 4. Discovery
├─ 5. Negotiation
├─ 6. Verification
└─ 7. Settlement

Advanced Topics
├─ 8. Trust Model
└─ 9. Extensions
```

### Design Features
- ✨ Minimalistic research-focused theme
- 🎨 Clean indigo/blue color palette
- 📱 Fully responsive design
- 🌓 Light/dark mode support
- 🔍 Collapsible sidebar categories
- 📊 Clean typography and spacing
- 💻 Syntax-highlighted code blocks
- 🔗 Smooth navigation and scroll

## Troubleshooting

### Build Fails
If the GitHub Actions workflow fails:

1. **Check the Actions tab** for error messages
2. **Verify package.json** - ensure all dependencies are listed
3. **Test locally**:
   ```bash
   cd website
   npm install
   npm run build
   ```
4. **Fix any errors** and push again

### Pages Not Found (404)
If you get 404 errors after deployment:

1. **Verify baseUrl** in `website/docusaurus.config.ts`:
   ```typescript
   baseUrl: '/lcp-spec/',
   ```

2. **Check repository name** matches the baseUrl

3. **Wait a few minutes** - DNS propagation can take time

### Links Not Working
If internal links are broken:

1. **Check markdown links** use relative paths without file extensions:
   ```markdown
   [Architecture](./architecture)  ✓ Correct
   [Architecture](./architecture.md)  ✗ Incorrect
   ```

2. **Rebuild** the site after fixing links

## Updating the Documentation

### Make Changes Locally
```bash
cd website
# Edit files in docs/ or website/
npm start  # Test locally at http://localhost:3000
```

### Deploy Changes
```bash
git add -A
git commit -m "Update documentation"
git push origin main
# Deployment happens automatically!
```

## Configuration Files

### Deployment Workflow
`.github/workflows/deploy-docs.yml` - Automated deployment configuration

### Docusaurus Config
`website/docusaurus.config.ts` - Main website configuration

### Sidebar Structure
`website/sidebars.ts` - Documentation navigation structure

### Custom Styling
`website/src/css/custom.css` - Theme customization

## Custom Domain (Optional)

To use a custom domain like `docs.lcp-spec.org`:

1. **Add DNS records** at your domain provider:
   ```
   Type: CNAME
   Name: docs
   Value: turf-tech.github.io
   ```

2. **Add custom domain** in GitHub Pages settings:
   - Settings → Pages → Custom domain
   - Enter: `docs.lcp-spec.org`
   - Wait for DNS check to pass

3. **Update baseUrl** in `docusaurus.config.ts`:
   ```typescript
   url: 'https://docs.lcp-spec.org',
   baseUrl: '/',
   ```

4. **Enable HTTPS** (checkbox appears after DNS verification)

## Maintenance

### Regular Updates
- Keep dependencies updated: `npm update` in website directory
- Monitor GitHub Actions for failed deployments
- Test build locally before pushing major changes

### Performance
- Website is pre-built static HTML (fast loading)
- Optimized for search engines
- Minimal JavaScript for better performance

## Support

If you encounter issues:

1. Check the [Docusaurus documentation](https://docusaurus.io)
2. Review [GitHub Pages documentation](https://docs.github.com/en/pages)
3. Open an issue in the repository

---

**Your documentation site is now ready to go live!** 🚀

Just follow Step 1 above to enable GitHub Pages, and your minimalistic, professional documentation will be available to the world.
