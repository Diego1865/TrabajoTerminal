# Demo en Google Cloud

Plan preparado para `trabajoterminal-510018`: una VM e2-standard-2 (2 vCPU, 8 GB),
Ubuntu 24.04 x86_64, disco balanced de 40 GB y una IPv4 fija en us-central1-a.
Estimación orientativa: USD 60–80/mes encendida 24/7, tráfico ligero y pocos OCR.
Verificar la calculadora, saldo y fecha de vencimiento antes de crear recursos.
Los créditos de prueba vencen a los 90 días del alta. Detener la VM reduce el
cómputo, pero discos y direcciones IP pueden seguir generando cargos.

## Arquitectura

Internet → Caddy (80/443, HTTPS) → frontend Next.js y `/api/*` → FastAPI → SQL Server.
Solo Caddy publica puertos. SQL Server Express y FastAPI no son accesibles desde
Internet. Express permite esta demo sin licencia comercial de SQL Server; tiene
límites de memoria y de tamaño de base (SQL Server 2022: 10 GB por base).
Los archivos e imágenes base64 guardados en la base consumen ese espacio.

Compose `compose.demo.yml` es INDEPENDIENTE de los archivos locales. No combinarlo
con `docker-compose.yml` ni `docker-compose.ocr.yml`. No reutiliza tus volúmenes locales.
Vision usa ADC con la cuenta de servicio adjunta a la VM; no subir claves JSON.
El frontend usa la misma dirección HTTPS que la API; no incorpora localhost:8000.

## 1. Crear recursos (genera cargos)

Desde PowerShell en la raíz del repositorio:

```powershell
# Solo imprime el plan; no crea recursos.
.\deploy\provision.ps1
# Ejecutar únicamente tras revisar el plan y el presupuesto.
.\deploy\provision.ps1 -Apply
```

Requiere cuenta autorizada para Compute, IAM y habilitar APIs. Crea red/subred,
reglas web, SSH por IAP, cuenta de servicio, IPv4 y VM. Si falla parcialmente,
inspeccionar los recursos existentes antes de repetir; no borra ni reemplaza recursos.
El usuario que se conecta necesita acceso IAP (roles/iap.tunnelResourceAccessor)
y permisos de SSH/Compute apropiados; la cuenta propietaria puede concederlos.
No se habilita SSH público. El firewall solo permite el rango oficial de IAP para SSH.

La instalación inicial de Docker tarda unos minutos. Consultar su estado:

```powershell
gcloud compute ssh grafia-demo --project trabajoterminal-510018 --zone us-central1-a --tunnel-through-iap
```

En la VM: `sudo journalctl -u google-startup-scripts.service` y `sudo docker version`.

## 2. Subir el código actual, sin archivos privados

Desde PowerShell en la raíz del repositorio (incluye cambios aún sin commit):

```powershell
tar --exclude=.env --exclude='.env.*' --exclude=.venv --exclude=__pycache__ --exclude=node_modules --exclude=.next --exclude=credentials --exclude='*-credentials.json' -czf deploy/demo.tar.gz BackEnd FrontEnd deploy/Caddyfile deploy/configure.py deploy/backup.sh compose.demo.yml
gcloud compute scp deploy/demo.tar.gz grafia-demo:demo.tar.gz --project trabajoterminal-510018 --zone us-central1-a --tunnel-through-iap
```

La lista de rutas es deliberada: no incluye `.git`, credenciales personales, backups
ni reportes. Comprobar el contenido con `tar -tzf deploy/demo.tar.gz` antes de transferir.

## 3. Configurar dominio y arrancar (en la VM)

Usar la dirección fija que devuelve el script. Sin dominio propio se propone
`IP_PUBLICA.sslip.io`, un DNS de terceros que resuelve esa IP; su disponibilidad y
los límites de certificados no están bajo nuestro control. Confirmar resolución DNS.
Caddy obtiene HTTPS cuando el nombre apunta al servidor y 80/443 están accesibles.

```bash
sudo tar -xzf "$HOME/demo.tar.gz" -C /opt/grafia
cd /opt/grafia
sudo python3 deploy/configure.py --domain IP_PUBLICA.sslip.io --project trabajoterminal-510018
sudo docker compose --env-file .env.demo -f compose.demo.yml up -d --build
sudo docker compose --env-file .env.demo -f compose.demo.yml ps -a
sudo docker compose --env-file .env.demo -f compose.demo.yml logs --tail=50 db-init web
```

`configure.py` genera secretos aleatorios y NO sobreescribe una configuración existente.
`.env.demo` solo es legible por el propietario (root si usaste sudo).
No se imprimen secretos. Los contenedores reinician automáticamente con Docker.
Para actualizar código, respaldar primero y repetir transferencia/extracción/`up`;
no ejecutar nuevamente `configure.py` ni cambiar la contraseña de una base existente.

La inicialización crea TT si no existe, carga diez ejercicios solo si el catálogo
está vacío y registra las migraciones aplicadas. Un fallo detiene db-init y evita
arrancar el backend. No elimina tablas ni crea usuarios o entregas ficticias.
Si falta memoria al compilar, construir los servicios secuencialmente antes del `up`.

## 4. Prueba de aceptación

1. Abrir `https://IP_PUBLICA.sslip.io`; verificar certificado válido y permiso de cámara.
2. Registrar un tutor desde la interfaz, crear alumno y activar un ejercicio.
3. Entrar como alumno y entregar una fotografía/dibujo de una oración.
4. Revisar texto y evaluación preliminar en el panel del tutor.
5. Reiniciar contenedores y comprobar que usuarios/entregas persisten.

SQL y las credenciales se quedan en el servidor. La solicitud OCR envía la imagen
a Google Vision y consume cuota. Esta configuración es una demo de una sola VM;
no ofrece alta disponibilidad y no reemplaza una revisión de seguridad para uso escolar real.

## 5. Respaldos y gasto

```bash
cd /opt/grafia
sudo bash deploy/backup.sh
```

El script hace BACKUP con checksum y RESTORE VERIFYONLY; guarda una copia `.bak`
en `backups/`. Eso comprueba el archivo, no sustituye un ensayo de restauración.
Descargarlo a una ubicación privada fuera de la VM. No se ha programado un respaldo
automático; hacerlo antes de actualizaciones y después de las sesiones de prueba.
La creación de la VM preserva el disco al eliminarla para evitar perder datos;
ese disco continúa facturándose hasta retirarlo expresamente.

Configurar presupuesto con alertas al 50/80/100% y revisar costos diarios al inicio.
Una alerta no es un corte de consumo. Revisar también el saldo y la fecha de los créditos.
No usar `down -v` sobre la demo: eliminaría los volúmenes de datos y certificados.

Referencias:
- https://cloud.google.com/products/compute/pricing/general-purpose
- https://docs.cloud.google.com/free/docs/free-cloud-features
- https://docs.cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances
- https://docs.docker.com/engine/install/ubuntu/
- https://caddyserver.com/docs/automatic-https
