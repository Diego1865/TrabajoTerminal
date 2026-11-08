#!/usr/bin/env bash
# Respaldo bajo demanda. La base está en Cloud SQL, así que ya no se hace BACKUP TO DISK en la VM:
# se exporta un .bak al bucket de respaldos (ver deploy/respaldo-nube.sh).
# Uso en la VM: sudo bash deploy/backup.sh
set -euo pipefail
exec bash "$(dirname "$0")/respaldo-nube.sh"
