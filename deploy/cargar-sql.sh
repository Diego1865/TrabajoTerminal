#!/usr/bin/env bash
# Copia la conexión a Cloud SQL del secreto grafia-sql de Secret Manager a .env.demo.
# El secreto tiene dos líneas:
#   DB_SERVER=IP privada de la instancia (gcloud sql instances describe grafia-sql)
#   DB_PASSWORD=contraseña del usuario sqlserver
# Uso en la VM: sudo bash deploy/cargar-sql.sh   (después: docker compose ... up -d)
set -euo pipefail
cd "$(dirname "$0")/.."
md='http://metadata.google.internal/computeMetadata/v1'
project=$(curl -sf -H 'Metadata-Flavor: Google' "$md/project/project-id")
token=$(curl -sf -H 'Metadata-Flavor: Google' "$md/instance/service-accounts/default/token" \
    | python3 -c 'import json, sys; print(json.load(sys.stdin)["access_token"])')

if ! valor=$(curl -sf -H "Authorization: Bearer $token" \
    "https://secretmanager.googleapis.com/v1/projects/$project/secrets/grafia-sql/versions/latest:access" \
    | python3 -c 'import base64, json, sys; print(base64.b64decode(json.load(sys.stdin)["payload"]["data"]).decode())' 2>/dev/null); then
    echo 'No se pudo leer el secreto grafia-sql: sin él el backend no puede conectarse a la base.'
    exit 1
fi

# Solo se aceptan DB_SERVER y DB_PASSWORD; se reemplazan las anteriores sin mostrar su valor.
nuevas=$(printf '%s\n' "$valor" | tr -d '\r' | grep -E '^DB_(SERVER|PASSWORD)=.+' || true)
if [ "$(printf '%s\n' "$nuevas" | grep -c '^DB_')" -ne 2 ]; then
    echo 'El secreto grafia-sql debe tener las líneas DB_SERVER=... y DB_PASSWORD=...'
    exit 1
fi
umask 077
touch .env.demo
{ grep -vE '^DB_(SERVER|PASSWORD)=' .env.demo || true; printf '%s\n' "$nuevas"; } > .env.demo.nuevo
mv .env.demo.nuevo .env.demo
echo 'Conexión a Cloud SQL cargada en .env.demo.'
