$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
# Entorno de prueba exclusivo: no reutiliza contenedores/volúmenes de TrabajoTerminal.
$env:APP_DOMAIN = 'demo.example.com'
$env:GOOGLE_CLOUD_PROJECT = 'test-project'
$env:GOOGLE_VISION_ENABLED = 'false'
$env:DB_PASSWORD = 'Aa1' + [Guid]::NewGuid().ToString('N')
$env:SECRET_KEY = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
$composeArgs = @('compose','--env-file','deploy/.env.demo.example','-p','grafia-deploy-check','-f','compose.demo.yml')
function Invoke-Compose {
    param([string[]]$Arguments)
    & docker @composeArgs @Arguments
    if ($LASTEXITCODE -ne 0) { throw 'Falló la verificación de Compose.' }
}
try {
    Invoke-Compose -Arguments @('config','--quiet')
    Invoke-Compose -Arguments @('up','-d','--wait','database')
    Invoke-Compose -Arguments @('run','--rm','--build','--no-deps','db-init')
    Invoke-Compose -Arguments @('run','--rm','--no-deps','db-init')
    $check = "from Modelo.database import connect_to_database; c=connect_to_database(); q=c.cursor(); q.execute('SELECT COUNT(*) FROM Ejercicios'); assert q.fetchone()[0] == 10; q.execute('SELECT COUNT(*) FROM Usuario'); assert q.fetchone()[0] == 0; q.execute('SELECT COUNT(*) FROM SchemaMigrations'); assert q.fetchone()[0] == 2; print('OK: 10 ejercicios, 0 usuarios, 2 migraciones; reinicio sin duplicados'); c.close()"
    Invoke-Compose -Arguments @('run','--rm','--no-deps','backend','python','-c',$check)
    Invoke-Compose -Arguments @('run','--rm','--no-deps','web','caddy','validate','--config','/etc/caddy/Caddyfile')
    Invoke-Compose -Arguments @('build','frontend')
} finally {
    # Solo retira el proyecto desechable creado arriba.
    & docker @composeArgs down --volumes --remove-orphans
}
