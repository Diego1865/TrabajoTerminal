#!/usr/bin/env bash
# Script de inicio de la plantilla grafia-demo-plantilla. Corre como root en cada arranque.
# Primera vez: instala Docker, clona el repositorio, genera .env.demo, restaura el último
# respaldo del bucket y arranca la demo. Arranques siguientes: solo verifica que esté arriba.
# Salida: sudo journalctl -u google-startup-scripts.service
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
md='http://metadata.google.internal/computeMetadata/v1'
meta() { curl -sf -H 'Metadata-Flavor: Google' "$md/$1" || true; }
repo='https://github.com/Diego1865/TrabajoTerminal.git'
branch=$(meta instance/attributes/grafia-branch); branch=${branch:-David-deploy-gcp}
bucket=$(meta instance/attributes/grafia-bucket)
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

echo '== Arrancando SQL Server'
dc up -d database
for _ in $(seq 1 60); do
    [ "$(docker inspect -f '{{.State.Health.Status}}' "$(dc ps -q database)")" = healthy ] && break
    sleep 5
done
dc exec -T -u 0 database chown mssql /var/opt/mssql/backup
sql() { dc exec -T database bash -c '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -b -h -1 -W -Q "$1"' _ "$1"; }

existe=$(sql "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name = 'TT'" | tr -d '[:space:]')
if [ "$existe" = 0 ] && [ -n "$bucket" ]; then
    token=$(meta instance/service-accounts/default/token | python3 -c 'import json, sys; print(json.load(sys.stdin)["access_token"])')
    ultimo=$(curl -sf -H "Authorization: Bearer $token" \
        "https://storage.googleapis.com/storage/v1/b/$bucket/o?prefix=TT-" \
        | python3 -c 'import json, sys; n = [o["name"] for o in json.load(sys.stdin).get("items", []) if o["name"].endswith(".bak")]; print(max(n) if n else "")')
    if [ -n "$ultimo" ]; then
        echo "== Restaurando gs://$bucket/$ultimo"
        curl -sf -H "Authorization: Bearer $token" -o /tmp/restaurar.bak \
            "https://storage.googleapis.com/storage/v1/b/$bucket/o/$ultimo?alt=media"
        dc cp /tmp/restaurar.bak database:/var/opt/mssql/backup/restaurar.bak
        rm -f /tmp/restaurar.bak
        dc exec -T -u 0 database chown mssql /var/opt/mssql/backup/restaurar.bak
        sql "RESTORE DATABASE TT FROM DISK = '/var/opt/mssql/backup/restaurar.bak' WITH CHECKSUM"
        dc exec -T -u 0 database rm -f /var/opt/mssql/backup/restaurar.bak
    else
        echo "== gs://$bucket no tiene respaldos: se crea una base nueva"
    fi
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
