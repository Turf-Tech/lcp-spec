#!/bin/bash

# LCP Documentation Deployment Script
# Deploys to GitHub Pages (gh-pages branch)

set -e  # Exit on error

echo "🚀 Deploying LCP Documentation to GitHub Pages..."

# Navigate to website directory
cd website

# Build the site
echo "📦 Building Docusaurus site..."
npm run build

# Navigate to build output
cd build

# Initialize git
echo "🔧 Preparing deployment..."
rm -rf .git
git init
git add -A
git commit -m "Deploy documentation - $(date)"

# Push to gh-pages branch
echo "📤 Pushing to gh-pages branch..."
git branch -M gh-pages

# Use GITHUB_TOKEN environment variable
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable not set"
  echo "Run: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

git remote add origin https://code-wiki:${GITHUB_TOKEN}@github.com/Turf-Tech/lcp-spec.git
git push -f origin gh-pages

# Clean up
cd ../..

echo "✅ Deployment complete!"
echo "🌐 Your site will be live at: https://turf-tech.github.io/lcp-spec/"
echo "⏱️  Allow 2-5 minutes for changes to appear"
