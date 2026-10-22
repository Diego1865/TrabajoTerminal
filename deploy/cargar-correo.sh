#!/usr/bin/env bash
# Copia la cuenta de correo (Gmail con contraseña de aplicación) del secreto grafia-smtp
# de Secret Manager a .env.demo. El secreto tiene dos líneas:
#   SMTP_USER=cuenta@gmail.com
#   SMTP_PASSWORD=la contraseña de aplicación de 16 letras
# Uso en la VM: sudo bash deploy/cargar-correo.sh   (después: docker compose ... up -d)
# Sin el secreto, la demo funciona pero el registro y la recuperación responden
# "El envío de correos no está configurado".
set -euo pipefail
cd "$(dirname "$0")/.."
md='http://metadata.google.internal/computeMetadata/v1'
project=$(curl -sf -H 'Metadata-Flavor: Google' "$md/project/project-id")
token=$(curl -sf -H 'Metadata-Flavor: Google' "$md/instance/service-accounts/default/token" \
    | python3 -c 'import json, sys; print(json.load(sys.stdin)["access_token"])')

if ! valor=$(curl -sf -H "Authorization: Bearer $token" \
    "https://secretmanager.googleapis.com/v1/projects/$project/secrets/grafia-smtp/versions/latest:access" \
    | python3 -c 'import base64, json, sys; print(base64.b64decode(json.load(sys.stdin)["payload"]["data"]).decode())' 2>/dev/null); then
    echo 'No se pudo leer el secreto grafia-smtp: el envío de correos queda desactivado.'
    exit 1
fi

# Solo se aceptan líneas SMTP_*; se reemplazan las anteriores sin mostrar su valor.
nuevas=$(printf '%s\n' "$valor" | tr -d '\r' | grep -E '^SMTP_(USER|PASSWORD)=.+' || true)
if [ "$(printf '%s\n' "$nuevas" | grep -c '^SMTP_')" -ne 2 ]; then
    echo 'El secreto grafia-smtp debe tener las líneas SMTP_USER=... y SMTP_PASSWORD=...'
    exit 1
fi
umask 077
{ grep -v '^SMTP_' .env.demo || true; printf '%s\n' "$nuevas"; } > .env.demo.nuevo
mv .env.demo.nuevo .env.demo
echo 'Cuenta de correo cargada en .env.demo.'
