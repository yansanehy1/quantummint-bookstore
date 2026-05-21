#!/bin/bash
# Automated backup script for QuantumMint VPS
BACKUP_DIR="/home/quantummint/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec quantummint-postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploaded files (adjust path as needed)
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /home/quantummint/app public/uploads

# Delete old backups
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
