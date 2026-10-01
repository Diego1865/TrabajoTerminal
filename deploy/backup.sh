#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
destination="backups/TT-$(date -u +%Y%m%dT%H%M%SZ).bak"
umask 077
mkdir -p backups
docker compose --env-file .env.demo -f compose.demo.yml exec -T backend python - <<'PY'
from Modelo.database import connect_to_database
c = connect_to_database()
if c is None:
    raise RuntimeError('No se pudo conectar para respaldar.')
c.autocommit = True
try:
    cursor = c.cursor()
    cursor.execute("BACKUP DATABASE TT TO DISK = '/var/opt/mssql/backup/TT.bak' WITH COPY_ONLY, INIT, CHECKSUM")
    while cursor.nextset():
        pass
    cursor.execute("RESTORE VERIFYONLY FROM DISK = '/var/opt/mssql/backup/TT.bak' WITH CHECKSUM")
    while cursor.nextset():
        pass
finally:
    c.close()
PY
docker compose --env-file .env.demo -f compose.demo.yml cp database:/var/opt/mssql/backup/TT.bak "$destination"
echo "Respaldo verificado: $destination. Copiar fuera de esta VM para recuperación ante pérdida del disco."
