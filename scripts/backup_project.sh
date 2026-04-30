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

# 최신 zip을 downloads/ 폴더에 복사 (홈 화면 다운로드 버튼용)
DOWNLOADS_DIR="$PROJECT_DIR/downloads"
mkdir -p "$DOWNLOADS_DIR"
# 기존 zip 제거 후 최신 파일로 교체
rm -f "$DOWNLOADS_DIR"/farmerstree-fertilizer-platform-*.zip
cp "$BACKUP_DIR/farmerstree-fertilizer-platform-$DATE.zip" "$DOWNLOADS_DIR/farmerstree-fertilizer-platform-$DATE.zip"

# index.html의 다운로드 링크 파일명 업데이트
FILENAME="farmerstree-fertilizer-platform-$DATE.zip"
sed -i '' "s|farmerstree-fertilizer-platform-[0-9_]*\.zip|$FILENAME|g" "$PROJECT_DIR/index.html"

echo "Downloads folder updated: $DOWNLOADS_DIR/$FILENAME"
