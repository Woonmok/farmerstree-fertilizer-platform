#!/bin/bash

set -e

PROJECT_DIR="/Volumes/AI_DATA_CENTRE/AI_WORKSPACE/farmerstree-fertilizer-platform"
BACKUP_DIR="/Volumes/AI_DATA_CENTRE/AI_WORKSPACE/_BACKUPS/farmerstree-fertilizer-platform"

DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

cd "$PROJECT_DIR"

echo "=== Git status ==="
git status --short || true

echo "=== Creating zip backup ==="
cd "$(dirname "$PROJECT_DIR")"

zip -r "$BACKUP_DIR/farmerstree-fertilizer-platform-$DATE.zip" "farmerstree-fertilizer-platform" \
  -x "farmerstree-fertilizer-platform/.git/*" \
  -x "farmerstree-fertilizer-platform/node_modules/*" \
  -x "farmerstree-fertilizer-platform/.DS_Store"

echo "Backup complete:"
echo "$BACKUP_DIR/farmerstree-fertilizer-platform-$DATE.zip"
