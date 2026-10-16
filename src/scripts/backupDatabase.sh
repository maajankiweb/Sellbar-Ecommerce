#!/usr/bin/env bash
# ==============================================================================
# SELBAR — Automated Daily MongoDB Backup to Cloudflare R2 / AWS S3
# Designed for MongoDB Atlas Free/Shared tiers (M0/M2/M5) without continuous backup.
#
# Requirements:
# - mongodump (from mongodb-database-tools)
# - aws-cli or rclone configured with Cloudflare R2 endpoint
#
# Recommended Cron (Daily at 02:00 AM UTC):
# 0 2 * * * /path/to/Sellbar/src/scripts/backupDatabase.sh >> /var/log/selbar-backup.log 2>&1
# ==============================================================================

set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/selbar_mongo_backups"
ARCHIVE_NAME="selbar_backup_${TIMESTAMP}.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting MongoDB Atlas backup..."

# Verify MONGO_URI is set
if [ -z "${MONGO_URI:-}" ]; then
  echo "❌ Error: MONGO_URI is not set in environment."
  exit 1
fi

# Execute mongodump with gzip compression
mongodump --uri="${MONGO_URI}" --archive="${ARCHIVE_PATH}" --gzip

echo "✅ Backup archive created: ${ARCHIVE_PATH} ($(du -h "${ARCHIVE_PATH}" | cut -f1))"

# Upload to Cloudflare R2 / S3 if configured
if [ -n "${R2_BUCKET_NAME:-}" ]; then
  echo "Uploading archive to Cloudflare R2: s3://${R2_BUCKET_NAME}/backups/${ARCHIVE_NAME}..."
  
  # AWS CLI with Cloudflare R2 custom endpoint
  aws s3 cp "${ARCHIVE_PATH}" "s3://${R2_BUCKET_NAME}/backups/${ARCHIVE_NAME}" \
    --endpoint-url "${R2_ENDPOINT_URL}"
    
  echo "✅ Upload to Cloudflare R2 completed successfully."
fi

# Cleanup local temporary archive
rm -f "${ARCHIVE_PATH}"
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup process finished cleanly."
