#!/bin/bash
# Simple git sync script for Vaultpay website

if [ -z "$1" ]; then
  echo "‚ùå Please provide a commit message, e.g.:"
  echo "   git sync \"Updated homepage\""
  exit 1
fi

echo "Ì¥Ñ Adding all changes..."
git add .

echo "Ì≤¨ Committing changes: $1"
git commit -m "$1"

echo "‚òÅÔ∏è Pushing to GitHub (origin)..."
git push origin master

echo "Ì∫Ä Deploying to Production (production)..."
git push production master

echo "‚úÖ Sync complete!"
