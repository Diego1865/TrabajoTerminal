param(
    [string]$Project = 'trabajoterminal-510018',
    [string]$Region = 'us-central1',
    [string]$Zone = 'us-central1-a',
    [switch]$Apply
)
$ErrorActionPreference = 'Stop'
if ($Project -notmatch '^[a-z][a-z0-9-]+$' -or $Region -notmatch '^[a-z]+-[a-z]+[0-9]+$' -or $Zone -ne "$Region-a") {
    throw 'Revisa proyecto, región y zona (se usa la zona a de la región).'
}
Write-Output "Proyecto: $Project; VM: grafia-demo; zona: $Zone"
Write-Output 'Plan: e2-standard-2 (2 vCPU, 8 GB), Ubuntu 24.04, disco balanced 40 GB, IPv4 regional fija.'
Write-Output 'Red propia; puertos web 80/443; SSH solo a través de IAP; cuenta de servicio para Vision.'
Write-Output 'Estimación orientativa: USD 60-80/mes encendida 24/7; verificar precios y saldo antes de aplicar.'
if (-not $Apply) {
    Write-Output 'Solo plan. Para crear recursos facturables, volver a ejecutar con -Apply.'
    exit 0
}
$gcloudCommand = Get-Command gcloud -ErrorAction SilentlyContinue
$gcloudPath = if ($gcloudCommand) { $gcloudCommand.Source } else { Join-Path $env:LOCALAPPDATA 'Google/Cloud SDK/google-cloud-sdk/bin/gcloud.cmd' }
if (-not (Test-Path -LiteralPath $gcloudPath)) { throw 'No se encontró Google Cloud CLI.' }
function Invoke-Gcloud {
    param([string[]]$Arguments)
    & $gcloudPath @Arguments --project=$Project --quiet
    if ($LASTEXITCODE -ne 0) { throw "Falló gcloud: $($Arguments[0..1] -join ' '). Inspecciona recursos parciales antes de reintentar." }
}
Invoke-Gcloud -Arguments @('services','enable','compute.googleapis.com','iam.googleapis.com','iap.googleapis.com','vision.googleapis.com')
# Los nombres son dedicados a esta demo; no se modifica una VM preexistente.
Invoke-Gcloud -Arguments @('compute','networks','create','grafia-demo','--subnet-mode=custom')
Invoke-Gcloud -Arguments @('compute','networks','subnets','create','grafia-demo',"--region=$Region",'--network=grafia-demo','--range=10.42.0.0/24')
Invoke-Gcloud -Arguments @('compute','firewall-rules','create','grafia-demo-web','--network=grafia-demo','--allow=tcp:80,tcp:443','--source-ranges=0.0.0.0/0','--target-tags=grafia-demo')
Invoke-Gcloud -Arguments @('compute','firewall-rules','create','grafia-demo-iap','--network=grafia-demo','--allow=tcp:22','--source-ranges=35.235.240.0/20','--target-tags=grafia-demo')
Invoke-Gcloud -Arguments @('iam','service-accounts','create','grafia-demo','--display-name=Grafia demo Vision')
$serviceAccount = "grafia-demo@$Project.iam.gserviceaccount.com"
Invoke-Gcloud -Arguments @('projects','add-iam-policy-binding',$Project,"--member=serviceAccount:$serviceAccount",'--role=roles/serviceusage.serviceUsageConsumer','--condition=None')
Invoke-Gcloud -Arguments @('compute','addresses','create','grafia-demo',"--region=$Region")
$address = & $gcloudPath compute addresses describe grafia-demo --project=$Project --region=$Region '--format=value(address)'
if ($LASTEXITCODE -ne 0 -or $address -notmatch '^\d+\.\d+\.\d+\.\d+$') { throw 'No se pudo obtener la dirección IP.' }
$startup = Join-Path $PSScriptRoot 'install-docker.sh'
Invoke-Gcloud -Arguments @('compute','instances','create','grafia-demo',"--zone=$Zone",'--machine-type=e2-standard-2',
    '--image-family=ubuntu-2404-lts-amd64','--image-project=ubuntu-os-cloud','--boot-disk-size=40GB',
    '--boot-disk-type=pd-balanced','--no-boot-disk-auto-delete','--subnet=grafia-demo',"--address=$address",
    '--tags=grafia-demo',"--service-account=$serviceAccount",'--scopes=cloud-platform',
    "--metadata-from-file=startup-script=$startup",'--labels=app=grafia,environment=demo')
Write-Output "Servidor creado. Dominio temporal propuesto: $address.sslip.io"
Write-Output 'Consulta deploy/README.md para transferir el código, generar secretos y arrancar la aplicación.'
