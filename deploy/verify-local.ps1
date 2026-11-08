$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
# Entorno de prueba exclusivo: no reutiliza contenedores/volúmenes de TrabajoTerminal.
$env:APP_DOMAIN = 'demo.example.com'
$env:GOOGLE_CLOUD_PROJECT = 'test-project'
$env:GOOGLE_VISION_ENABLED = 'false'
$env:DB_PASSWORD = 'Aa1' + [Guid]::NewGuid().ToString('N')
$env:SECRET_KEY = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
# En la VM la base es Cloud SQL; aquí se sustituye por SQL Server en un contenedor.
$env:DB_SERVER = 'database'
$env:DB_USER = 'sa'
$composeArgs = @('compose','--env-file','deploy/.env.demo.example','-p','grafia-deploy-check','-f','compose.demo.yml','-f','deploy/compose.sqlserver-local.yml')
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
    $check = "from pathlib import Path; from Modelo.database import connect_to_database; c=connect_to_database(); q=c.cursor(); q.execute('SELECT COUNT(*) FROM Ejercicios'); assert q.fetchone()[0] == 10; q.execute('SELECT COUNT(*) FROM Usuario'); assert q.fetchone()[0] == 0; esperadas = {p.name for p in Path('BD/migraciones').glob('*.sql')}; q.execute('SELECT nombre FROM SchemaMigrations'); aplicadas = {r[0] for r in q.fetchall()}; assert aplicadas == esperadas, (aplicadas, esperadas); print(f'OK: 10 ejercicios, 0 usuarios, {len(aplicadas)} migraciones; reinicio sin duplicados'); c.close()"
    Invoke-Compose -Arguments @('run','--rm','--no-deps','backend','python','-c',$check)
    Invoke-Compose -Arguments @('run','--rm','--no-deps','web','caddy','validate','--config','/etc/caddy/Caddyfile')
    Invoke-Compose -Arguments @('build','frontend')
} finally {
    # Solo retira el proyecto desechable creado arriba.
    & docker @composeArgs down --volumes --remove-orphans
}
