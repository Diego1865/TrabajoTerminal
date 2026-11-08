#!/usr/bin/env bash
# Script de inicio de la plantilla grafia-demo-plantilla. Corre como root en cada arranque.
# Primera vez: instala Docker, clona el repositorio, genera .env.demo, carga la conexión a
# Cloud SQL y el correo desde Secret Manager y arranca la demo. Los datos viven en Cloud SQL,
# así que una VM nueva no restaura nada. Arranques siguientes: solo verifica que esté arriba.
# Salida: sudo journalctl -u google-startup-scripts.service
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
md='http://metadata.google.internal/computeMetadata/v1'
meta() { curl -sf -H 'Metadata-Flavor: Google' "$md/$1" || true; }
repo='https://github.com/Diego1865/TrabajoTerminal.git'
branch=$(meta instance/attributes/grafia-branch); branch=${branch:-main}
project=$(meta project/project-id)
ip=$(meta instance/network-interfaces/0/access-configs/0/external-ip)
app=/opt/grafia
dc() { docker compose --project-directory "$app" --env-file "$app/.env.demo" -f "$app/compose.demo.yml" "$@"; }

if [ -e "$app/compose.demo.yml" ] && [ ! -d "$app/.git" ]; then
    echo "$app fue instalado a mano (sin Git): este script no lo modifica."
    exit 0
fi

if ! command -v docker >/dev/null || ! command -v git >/dev/null; then
    echo '== Instalando Docker y Git'
    apt-get update
    apt-get install -y ca-certificates curl python3 git
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    cat > /etc/apt/sources.list.d/docker.sources <<'EOF'
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
EOF
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable --now docker
fi

# Al apagar, el shutdown-script (respaldo) debe correr antes de que se detenga Docker.
orden=/etc/systemd/system/google-shutdown-scripts.service.d/grafia.conf
if [ ! -f "$orden" ]; then
    install -d "$(dirname "$orden")"
    printf '[Unit]\nAfter=docker.service\nWants=docker.service\n' > "$orden"
    systemctl daemon-reload
fi

if ! swapon --show=NAME --noheadings | grep -qx /swapfile; then
    echo '== Creando swap de 2 GB'
    [ -f /swapfile ] || { fallocate -l 2G /swapfile; chmod 600 /swapfile; mkswap /swapfile; }
    swapon /swapfile
    grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

if [ -f "$app/.instalado" ]; then
    echo '== Ya instalado: comprobando contenedores'
    dc up -d
    exit 0
fi

if [ ! -d "$app/.git" ]; then
    echo "== Clonando $branch"
    install -d -m 0750 "$app"
    git clone --branch "$branch" --depth 1 "$repo" "$app"
fi
cd "$app"
if [ ! -f .env.demo ]; then
    python3 deploy/configure.py --domain "$ip.sslip.io" --project "$project"
    bash deploy/cargar-correo.sh || true
fi
if ! grep -q '^DB_SERVER=.' .env.demo; then
    echo '== Cargando la conexión a Cloud SQL'
    bash deploy/cargar-sql.sh
fi

echo '== Construyendo imágenes (una a la vez por memoria)'
dc build db-init backend
dc build frontend
dc up -d
cat > /etc/cron.d/grafia-respaldo <<EOF
# Respaldo diario a Cloud Storage (08:00 UTC)
0 8 * * * root bash $app/deploy/respaldo-nube.sh >> /var/log/grafia-respaldo.log 2>&1
EOF
touch "$app/.instalado"
echo "== Listo: https://$ip.sslip.io"
