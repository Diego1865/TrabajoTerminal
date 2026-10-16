#!/usr/bin/env bash
# Una sola vez, en una VM instalada a mano (sin startup.sh): hace que el respaldo al apagar
# corra antes de detener Docker y programa el respaldo diario a Cloud Storage.
# Uso: sudo bash activar-respaldo-nube.sh (con respaldo-nube.sh en el mismo directorio).
set -euo pipefail
origen=$(dirname "$0")
install -m 0644 "$origen/respaldo-nube.sh" /opt/grafia/deploy/respaldo-nube.sh
orden=/etc/systemd/system/google-shutdown-scripts.service.d/grafia.conf
install -d "$(dirname "$orden")"
printf '[Unit]\nAfter=docker.service\nWants=docker.service\n' > "$orden"
systemctl daemon-reload
cat > /etc/cron.d/grafia-respaldo <<'EOF'
# Respaldo diario a Cloud Storage (08:00 UTC)
0 8 * * * root bash /opt/grafia/deploy/respaldo-nube.sh >> /var/log/grafia-respaldo.log 2>&1
EOF
systemctl show google-shutdown-scripts.service -p After | grep -q docker.service
echo 'Activado: respaldo antes de detener Docker y respaldo diario a las 08:00 UTC.'
