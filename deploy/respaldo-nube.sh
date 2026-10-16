#!/usr/bin/env bash
# Respalda la base con deploy/backup.sh y sube el .bak al bucket de Cloud Storage
# indicado en el metadato de instancia "grafia-bucket". Se usa como shutdown-script
# y desde cron, así que no depende de otros archivos nuevos del repositorio.
set -euo pipefail
cd /opt/grafia
md='http://metadata.google.internal/computeMetadata/v1'
bucket=$(curl -sf -H 'Metadata-Flavor: Google' "$md/instance/attributes/grafia-bucket" || true)
if [ -z "$bucket" ]; then
    echo 'Sin metadato grafia-bucket: no se sube el respaldo a Cloud Storage.'
    exit 0
fi
if [ -z "$(docker compose --env-file .env.demo -f compose.demo.yml ps -q --status running backend)" ]; then
    echo 'El backend no está corriendo: no se puede respaldar.'
    exit 0
fi
bash deploy/backup.sh
archivo=$(ls -1 backups/TT-*.bak | sort | tail -n 1)
token=$(curl -sf -H 'Metadata-Flavor: Google' "$md/instance/service-accounts/default/token" \
    | python3 -c 'import json, sys; print(json.load(sys.stdin)["access_token"])')
curl -sf -o /dev/null -X POST -H "Authorization: Bearer $token" -H 'Content-Type: application/octet-stream' \
    --data-binary "@$archivo" \
    "https://storage.googleapis.com/upload/storage/v1/b/$bucket/o?uploadType=media&name=$(basename "$archivo")"
echo "Respaldo subido a gs://$bucket/$(basename "$archivo")"
