param(
    [string]$Project = 'trabajoterminal-510019',
    [string]$Region = 'us-central1',
    [string]$Zone = 'us-central1-a',
    [string]$Branch = 'David-deploy-gcp',
    [switch]$Apply
)
$ErrorActionPreference = 'Stop'
if ($Project -notmatch '^[a-z][a-z0-9-]+$' -or $Region -notmatch '^[a-z]+-[a-z]+[0-9]+$' -or $Zone -ne "$Region-a" -or $Branch -notmatch '^[A-Za-z0-9._/-]+$') {
    throw 'Revisa proyecto, región, zona y rama.'
}
$bucket = "$Project-grafia-respaldos"
$template = 'grafia-demo-plantilla'
$serviceAccount = "grafia-demo@$Project.iam.gserviceaccount.com"
Write-Output "Proyecto: $Project; zona: $Zone; rama del código: $Branch"
Write-Output "1. Bucket gs://$bucket ($Region, acceso uniforme, sin acceso público, borra respaldos de más de 30 días)."
Write-Output "2. Rol storage.objectAdmin para $serviceAccount solo sobre ese bucket."
Write-Output "3. Plantilla $template igual a la VM actual (e2-medium, Ubuntu 24.04, 40 GB) con startup.sh y respaldo-nube.sh."
Write-Output '4. VM actual grafia-demo: se le agrega solo el respaldo al apagar y el nombre del bucket.'
Write-Output 'Costo: plantilla gratis; bucket de centavos al mes con pocos respaldos.'
if (-not $Apply) {
    Write-Output 'Solo plan. Para crear los recursos, volver a ejecutar con -Apply.'
    exit 0
}
$gcloudCommand = Get-Command gcloud -ErrorAction SilentlyContinue
$gcloudPath = if ($gcloudCommand) { $gcloudCommand.Source } else { Join-Path $env:LOCALAPPDATA 'Google/Cloud SDK/google-cloud-sdk/bin/gcloud.cmd' }
if (-not (Test-Path -LiteralPath $gcloudPath)) { throw 'No se encontró Google Cloud CLI.' }
function Invoke-Gcloud {
    param([string[]]$Arguments)
    & $gcloudPath @Arguments --project=$Project --quiet
    if ($LASTEXITCODE -ne 0) { throw "Falló gcloud: $($Arguments[0..2] -join ' '). Inspecciona recursos parciales antes de reintentar." }
}
$startup = Join-Path $PSScriptRoot 'startup.sh'
$shutdown = Join-Path $PSScriptRoot 'respaldo-nube.sh'
$lifecycle = Join-Path ([System.IO.Path]::GetTempPath()) 'grafia-lifecycle.json'
Set-Content -LiteralPath $lifecycle -Encoding ascii -Value '{"rule":[{"action":{"type":"Delete"},"condition":{"age":30}}]}'

Invoke-Gcloud -Arguments @('storage','buckets','create',"gs://$bucket","--location=$Region",'--uniform-bucket-level-access','--public-access-prevention')
Invoke-Gcloud -Arguments @('storage','buckets','update',"gs://$bucket","--lifecycle-file=$lifecycle")
Invoke-Gcloud -Arguments @('storage','buckets','add-iam-policy-binding',"gs://$bucket","--member=serviceAccount:$serviceAccount",'--role=roles/storage.objectAdmin')
Invoke-Gcloud -Arguments @('compute','instance-templates','create',$template,'--machine-type=e2-medium',
    '--image-family=ubuntu-2404-lts-amd64','--image-project=ubuntu-os-cloud','--boot-disk-size=40GB',
    '--boot-disk-type=pd-balanced','--no-boot-disk-auto-delete','--network=grafia-demo','--subnet=grafia-demo',
    "--region=$Region",'--tags=grafia-demo',"--service-account=$serviceAccount",'--scopes=cloud-platform',
    "--metadata-from-file=startup-script=$startup,shutdown-script=$shutdown",
    "--metadata=grafia-branch=$Branch,grafia-bucket=$bucket",'--labels=app=grafia,environment=demo')
Invoke-Gcloud -Arguments @('compute','instances','add-metadata','grafia-demo',"--zone=$Zone",
    "--metadata-from-file=shutdown-script=$shutdown","--metadata=grafia-bucket=$bucket")
Remove-Item -LiteralPath $lifecycle -ErrorAction SilentlyContinue
Write-Output "Listo. Plantilla: $template; respaldos: gs://$bucket"
Write-Output 'Para recrear la VM, consulta "Recrear desde la plantilla" en deploy/README.md.'
