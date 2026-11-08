#!/usr/bin/env bash
# Exporta la base TT de Cloud SQL a un .bak en el bucket de respaldos y espera a que termine.
# Lo ejecutan cron (diario, 08:00 UTC) y el shutdown-script de la VM; también se puede correr
# a mano: sudo bash deploy/respaldo-nube.sh
# Metadatos de la VM: grafia-bucket (bucket) y grafia-sql (nombre de la instancia de Cloud SQL).
# La exportación la hace Cloud SQL: si la VM se apaga a la mitad, termina igual.
# Permisos: la cuenta de servicio de la VM necesita cloudsql.instances.get y .export
# (deploy/README.md, sección 8) y la de la instancia, storage.objectAdmin sobre el bucket.
set -euo pipefail
md='http://metadata.google.internal/computeMetadata/v1'
meta() { curl -sf -H 'Metadata-Flavor: Google' "$md/$1" || true; }
bucket=$(meta instance/attributes/grafia-bucket)
instancia=$(meta instance/attributes/grafia-sql)
project=$(meta project/project-id)
if [ -z "$bucket" ] || [ -z "$instancia" ]; then
    echo 'Faltan los metadatos grafia-bucket o grafia-sql de la VM: no se respalda.'
    exit 1
fi
token=$(meta instance/service-accounts/default/token \
    | python3 -c 'import json, sys; print(json.load(sys.stdin)["access_token"])')
api="https://sqladmin.googleapis.com/v1/projects/$project"
nombre="TT-$(date -u +%Y%m%dT%H%M%SZ).bak"
llamar() { curl -sS --fail-with-body -H "Authorization: Bearer $token" "$@"; }

respuesta=$(llamar -X POST -H 'Content-Type: application/json' \
    -d "{\"exportContext\":{\"fileType\":\"BAK\",\"uri\":\"gs://$bucket/$nombre\",\"databases\":[\"TT\"]}}" \
    "$api/instances/$instancia/export") || { echo "Cloud SQL rechazó la exportación: $respuesta"; exit 1; }
operacion=$(printf '%s' "$respuesta" | python3 -c 'import json, sys; print(json.load(sys.stdin)["name"])')
echo "Exportando TT a gs://$bucket/$nombre (operación $operacion)..."

# Una base pequeña tarda pocos minutos; se espera hasta 20.
for _ in $(seq 1 120); do
    sleep 10
    estado=$(llamar "$api/operations/$operacion" | python3 -c '
import json, sys
o = json.load(sys.stdin)
e = o.get("error")
print("ERROR " + json.dumps(e, ensure_ascii=False) if e else o.get("status", ""))' 2>/dev/null) || estado=''
    case "$estado" in
        DONE) echo "Respaldo exportado a gs://$bucket/$nombre"; exit 0 ;;
        ERROR*) echo "Falló la exportación: ${estado#ERROR }"; exit 1 ;;
    esac
done
echo "La exportación sigue en curso. Revisar: gcloud sql operations describe $operacion --project $project"
exit 1
