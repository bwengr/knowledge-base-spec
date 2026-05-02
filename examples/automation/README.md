# Automation Example

This folder contains a working example of how to automatically generate a knowledge-base.json file for an Astro site deployed on Cloudflare Pages.

## Files

- `generate-knowledge-base.mjs` - Node.js script that scans markdown/mdx content and outputs JSON matching the spec
- `.github/workflows/generate-knowledge-base.yml` - GitHub Actions workflow that runs on content changes

## How It Works

```
Push to main (content changes)
    │
    ▼
GitHub Actions triggers
    │
    ▼
Runs generate-knowledge-base.mjs
    │
    ▼
Commits knowledge-base.json
    │
    ▼
Cloudflare Pages auto-deploys
```

## Setup for Your Astro Site

1. Copy `generate-knowledge-base.mjs` to your `scripts/` directory
2. Update `CONFIG` object in the script for your site
3. Copy `.github/workflows/generate-knowledge-base.yml` to your `.github/workflows/` directory
4. Update the `paths` in the workflow trigger if your content is elsewhere

## Configuration

Edit the `CONFIG` object in `generate-knowledge-base.mjs`:

```javascript
const CONFIG = {
  siteUrl: 'https://your-site.com',
  siteName: 'Your Site Name',
  siteDescription: 'What your site does',
  contentDir: path.join(__dirname, '../src/content'),
  outputFile: path.join(__dirname, '../public/knowledge-base.json'),
  chunkSize: 3,
};
```

## Cloudflare Pages Deployment

The workflow commits the generated JSON to your repo. Cloudflare Pages will automatically deploy on each push to main, including these commits.

No additional Cloudflare configuration needed. The generated `knowledge-base.json` in your `public/` folder is deployed like any other static asset.

## Extending the Script

The script is deliberately simple. You may want to add:

- Support for frontmatter `type` field to override auto-detection
- Filtering of specific content types
- Custom chunking logic based on heading structure
- Integration with your existing build process