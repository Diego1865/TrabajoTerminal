#!/usr/bin/env bash
# Recibe por stdin el script del commit validado por GitHub Actions.
# Uso en la VM: sudo bash deploy/deploy-main.sh <SHA completo>
set -euo pipefail

deploy_main() {
    local sha=${1:-}
    local app_dir=${2:-/opt/grafia}
    local state=${3:-/var/lib/grafia-deploy}
    local lock=${4:-/run/lock/grafia-deploy.lock}
    local previous domain status
    local -a compose
    if [[ ! "$sha" =~ ^[0-9a-f]{40}$ ]]; then
        echo 'Se requiere el SHA completo del commit validado.' >&2
        exit 1
    fi
    # También protege frente a ejecuciones manuales simultáneas de este script.
    exec 9>"$lock"
    flock -n 9 || { echo 'Ya hay un despliegue en curso.' >&2; exit 1; }
    cd "$app_dir"
    test -s .env.demo || { echo 'Falta /opt/grafia/.env.demo.' >&2; exit 1; }
    test "$(git branch --show-current)" = main || {
        echo 'La VM debe estar en la rama main.' >&2; exit 1;
    }
    if [[ -n "$(git status --porcelain)" ]]; then
        echo 'La VM tiene cambios pendientes; resuélvelos antes de desplegar.' >&2
        exit 1
    fi
    if [[ "$(git rev-parse --is-shallow-repository)" != false ]]; then
        echo 'Completa el historial de la VM con git fetch --unshallow origin.' >&2
        exit 1
    fi

    # Ref explícita: no depende de referencias antiguas a ramas eliminadas.
    git fetch origin '+refs/heads/main:refs/remotes/origin/main'
    if [[ "$sha" != "$(git rev-parse origin/main)" ]]; then
        echo 'Este workflow fue superado por otro commit de main; se omite el despliegue.'
        exit 0
    fi
    git merge-base --is-ancestor HEAD "$sha" || {
        echo 'main local diverge del commit validado; no se borrarán commits locales.' >&2
        exit 1
    }

    install -d -m 700 "$state"
    previous=$(git rev-parse HEAD)
    printf '%s\n' "$previous" > "$state/previous-checkout"
    git merge --ff-only "$sha"
    compose=(docker compose --env-file .env.demo -f compose.demo.yml)
    "${compose[@]}" config --quiet
    domain=$("${compose[@]}" config --format json | python3 -c \
        'import json, sys; print(json.load(sys.stdin)["services"]["web"]["environment"]["APP_DOMAIN"])')
    [[ "$domain" =~ ^[A-Za-z0-9.-]+$ ]] || { echo 'APP_DOMAIN no es un hostname válido.' >&2; exit 1; }

    # Compilar primero permite mantener la aplicación anterior si falla el build.
    # Secuencial para reducir el consumo de RAM en la e2-medium.
    "${compose[@]}" build backend
    "${compose[@]}" build db-init
    "${compose[@]}" build frontend

    # Este respaldo usa la cuenta de servicio de la VM y espera hasta terminar.
    # Si falla, no se ejecutan migraciones ni se reemplazan los contenedores.
    bash deploy/respaldo-nube.sh

    # Cada despliegue ejecuta db-init, aunque un contenedor anterior ya haya salido con 0.
    "${compose[@]}" run --rm --no-deps -T --interactive=false db-init
    "${compose[@]}" up -d --no-build --no-deps --force-recreate --wait --wait-timeout 180 backend frontend web

    # Comprueba frontend a través de HTTPS y API a través de Caddy.
    curl --fail --silent --show-error --location --max-time 30 \
        --retry 6 --retry-delay 5 --retry-all-errors "https://$domain/" -o /dev/null
    status=$(curl --silent --show-error --max-time 30 \
        -o /dev/null -w '%{http_code}' "https://$domain/api/tutor/perfil")
    if [[ "$status" != 401 ]]; then
        echo "La API debía rechazar el acceso anónimo con 401; respondió $status." >&2
        exit 1
    fi

    if [[ -f "$state/current" ]] && [[ "$(cat "$state/current")" != "$sha" ]]; then
        cp "$state/current" "$state/previous"
    fi
    printf '%s\n' "$sha" > "$state/current"
    echo "Despliegue verificado: $sha en https://$domain"
}

# SSH lo ejecuta con bash -s: sin archivo, BASH_SOURCE no tiene elementos.
if [[ "${BASH_SOURCE[0]:-$0}" == "$0" ]]; then
    if (( EUID != 0 )); then
        echo 'Ejecuta el despliegue con sudo.' >&2
        exit 1
    fi
    deploy_main "$@"
fi
