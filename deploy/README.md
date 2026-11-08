# Demo en Google Cloud

Plan preparado para `trabajoterminal-510019`: una VM e2-medium (2 vCPU compartidas, 4 GB),
Ubuntu 24.04 x86_64, disco balanced de 40 GB y una IPv4 fija en us-central1-a.
Estimación orientativa: USD 30–40/mes encendida 24/7, tráfico ligero y pocos OCR.
Verificar la calculadora, saldo y fecha de vencimiento antes de crear recursos.
Los créditos de prueba vencen a los 90 días del alta. Detener la VM reduce el
cómputo, pero discos y direcciones IP pueden seguir generando cargos.

## Arquitectura

Internet → Caddy (80/443, HTTPS) → frontend Next.js y `/api/*` → FastAPI → Cloud SQL.
Solo Caddy publica puertos. La base es Cloud SQL para SQL Server 2022 Express
(instancia `grafia-sql`) con IP privada en la red `grafia-demo`: no es accesible
desde Internet y los datos no dependen del disco de la VM (sección 8). Express no
cobra licencia de SQL Server; tiene límites de memoria y de tamaño de base
(10 GB por base). Los archivos e imágenes base64 guardados en la base consumen ese espacio.
Cloud SQL se cobra aparte de la VM.

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
gcloud compute ssh grafia-demo --project trabajoterminal-510019 --zone us-central1-a --tunnel-through-iap
```

En la VM: `sudo journalctl -u google-startup-scripts.service` y `sudo docker version`.

## 2. Subir el código actual, sin archivos privados

Desde PowerShell en la raíz del repositorio (incluye cambios aún sin commit):

```powershell
tar --exclude=.env --exclude='.env.*' --exclude=.venv --exclude=__pycache__ --exclude=node_modules --exclude=.next --exclude=credentials --exclude='*-credentials.json' -czf deploy/demo.tar.gz BackEnd FrontEnd deploy/Caddyfile deploy/configure.py deploy/cargar-sql.sh deploy/cargar-correo.sh deploy/backup.sh deploy/respaldo-nube.sh compose.demo.yml
gcloud compute scp deploy/demo.tar.gz grafia-demo:demo.tar.gz --project trabajoterminal-510019 --zone us-central1-a --tunnel-through-iap
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
sudo python3 deploy/configure.py --domain IP_PUBLICA.sslip.io --project trabajoterminal-510019
sudo bash deploy/cargar-sql.sh      # requiere la instancia y el secreto grafia-sql (sección 8)
sudo docker compose --env-file .env.demo -f compose.demo.yml up -d --build
sudo docker compose --env-file .env.demo -f compose.demo.yml ps -a
sudo docker compose --env-file .env.demo -f compose.demo.yml logs --tail=50 db-init web
```

`configure.py` genera secretos aleatorios y NO sobreescribe una configuración existente.
`.env.demo` solo es legible por el propietario (root si usaste sudo).
No se imprimen secretos. Los contenedores reinician automáticamente con Docker.
Para actualizar código, respaldar primero y repetir transferencia/extracción/`up`;
no ejecutar nuevamente `configure.py`. Para cambiar la contraseña de Cloud SQL, cambiarla
en la instancia y en el secreto `grafia-sql`, y repetir `cargar-sql.sh` y el `up`.

La inicialización crea TT si no existe, carga diez ejercicios solo si el catálogo
está vacío y registra las migraciones aplicadas. Un fallo detiene db-init y evita
arrancar el backend. No elimina tablas ni crea usuarios o entregas ficticias.
Si falta memoria al compilar, construir los servicios secuencialmente antes del `up`.
Con e2-medium (4 GB) conviene crear antes un swap de 2 GB:
`sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`.

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

Hay dos respaldos independientes:

1. **Respaldos automáticos de Cloud SQL**: diarios, se conservan 7 y se restauran con
   `gcloud sql backups list/restore`. Se borran si se borra la instancia.
2. **Exportación `.bak` al bucket** `gs://trabajoterminal-510019-grafia-respaldos`: la hace
   `deploy/respaldo-nube.sh` cada día a las 08:00 UTC (cron) y al apagar la VM. Es portable:
   sobrevive al borrado de la instancia y se importa con `gcloud sql import bak`.
   El bucket borra los de más de 30 días.

Respaldo bajo demanda, antes de actualizar (espera a que termine):

```bash
cd /opt/grafia
sudo bash deploy/backup.sh
```

Ninguno sustituye un ensayo de restauración (sección 8, paso 7, en una base de prueba).
La creación de la VM preserva el disco al eliminarla;
ese disco continúa facturándose hasta retirarlo expresamente.

Configurar presupuesto con alertas al 50/80/100% y revisar costos diarios al inicio.
Una alerta no es un corte de consumo. Revisar también el saldo y la fecha de los créditos.
No usar `down -v` sobre la demo: eliminaría el volumen de certificados HTTPS.

## 6. Recrear desde la plantilla

`deploy/template.ps1` (sin `-Apply` solo imprime el plan) crea:
- el bucket `gs://trabajoterminal-510019-grafia-respaldos`, que borra respaldos de más de 30 días;
- permiso de la cuenta de servicio de la VM solo sobre ese bucket;
- la plantilla `grafia-demo-plantilla`.

También agrega a la VM actual el respaldo al apagar. Crea recursos y cambia permisos:
lo ejecuta una cuenta con rol de propietario.

```powershell
.\deploy\template.ps1 -Apply
```

Respaldos a Cloud Storage: `deploy/respaldo-nube.sh` pide a Cloud SQL exportar TT como `.bak`
al bucket. Corre al apagar la VM (shutdown-script; la exportación sigue en Cloud SQL aunque la
VM se apague) y, en VMs creadas desde la plantilla, cada día a las 08:00 UTC.
Para forzarlo: `sudo bash deploy/respaldo-nube.sh`.

La plantilla y la VM guardan una COPIA de `startup.sh` y `respaldo-nube.sh` en sus metadatos.
Al cambiar esos scripts hay que actualizar la VM (sección 8, paso 6) y recrear la plantilla:
una plantilla no se puede modificar; borrarla con
`gcloud compute instance-templates delete grafia-demo-plantilla` y volver a crearla con el
comando `instance-templates create` de `template.ps1` (el bucket y los permisos ya existen).

Si la VM se borró, crear otra con la misma IP fija:

```powershell
gcloud compute instances create grafia-demo --source-instance-template=grafia-demo-plantilla --zone us-central1-a --subnet=grafia-demo --address=34.121.15.214 --project trabajoterminal-510019
```

`--subnet` es obligatorio junto con `--address`: sin él, gcloud reemplaza la red de la plantilla
por la red `default`, donde 80/443 están cerrados. Antes, borrar la VM anterior con
`--delete-disks=all`: su disco no se borra solo y tiene el mismo nombre.

`deploy/startup.sh` hace la instalación sola en unos 15 minutos:
1. Docker, swap y clon de la rama del metadato `grafia-branch` (por defecto `main`).
2. `.env.demo` con un `SECRET_KEY` nuevo, la cuenta de correo (`grafia-smtp`) y la conexión
   a Cloud SQL (`grafia-sql`), ambas desde Secret Manager.
3. Construye y arranca. `db-init` aplica las migraciones pendientes en Cloud SQL.

Seguimiento: `sudo journalctl -u google-startup-scripts.service -f`.

En arranques posteriores solo comprueba que los contenedores estén arriba. No modifica una
`/opt/grafia` instalada a mano (sin `.git`).

Los datos están en Cloud SQL, así que recrear la VM no pierde nada ni restaura respaldos.
El `SECRET_KEY` es nuevo, así que las sesiones abiertas se cierran. El disco de una VM
borrada se conserva y se sigue cobrando hasta eliminarlo (`gcloud compute disks list`).

Actualizar una VM creada desde la plantilla (respaldar antes):

```bash
cd /opt/grafia && sudo git pull && sudo docker compose --env-file .env.demo -f compose.demo.yml up -d --build
```

## 7. Correo: verificación y recuperación de contraseña

El registro de tutores, el cambio de correo y "¿Olvidaste tu contraseña?" mandan un código
de 6 dígitos desde una cuenta de Gmail del proyecto. El código vence en 10 minutos, sirve
una vez y admite 5 intentos; no se guarda en la base de datos. A los alumnos (sin correo)
les restablece la contraseña su tutor desde la lista de alumnos.

1. Cuenta de Gmail del proyecto con verificación en 2 pasos y una
   [contraseña de aplicación](https://myaccount.google.com/apppasswords).
2. Guardarla en Secret Manager (una sola vez, desde la PC). El archivo temporal `smtp.txt`
   tiene dos líneas, `SMTP_USER=cuenta@gmail.com` y `SMTP_PASSWORD=contraseña de aplicación`;
   borrarlo después:

   ```bash
   gcloud services enable secretmanager.googleapis.com --project trabajoterminal-510019
   gcloud secrets create grafia-smtp --data-file=smtp.txt --project trabajoterminal-510019
   gcloud secrets add-iam-policy-binding grafia-smtp --member=serviceAccount:grafia-demo@trabajoterminal-510019.iam.gserviceaccount.com --role=roles/secretmanager.secretAccessor --project trabajoterminal-510019
   ```

3. En la VM: `sudo bash deploy/cargar-correo.sh` y volver a levantar el backend. Una VM
   nueva creada desde la plantilla lo hace sola al instalarse.

Para cambiar la cuenta: `gcloud secrets versions add grafia-smtp --data-file=smtp.txt` y
repetir el paso 3. Sin el secreto, la demo funciona pero esas pantallas responden
"El envío de correos no está configurado". En local, `docker compose` imprime los códigos
en `docker logs BackEnd` en lugar de enviarlos.

Referencias:
- https://cloud.google.com/products/compute/pricing/general-purpose
- https://docs.cloud.google.com/free/docs/free-cloud-features
- https://docs.cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances
- https://docs.docker.com/engine/install/ubuntu/

## 8. Base de datos en Cloud SQL

Instancia `grafia-sql`, la configuración más barata posible para pruebas: SQL Server 2022
Express (sin costo de licencia), 1 vCPU y 3.75 GB (el mínimo de Cloud SQL para Express),
SSD de 10 GB que crece sola, una zona (sin alta disponibilidad), IP privada en la red
`grafia-demo`, respaldos automáticos diarios (06:00 UTC, se conservan 7) y protección
contra borrado. Para más carga, subir con `gcloud sql instances patch grafia-sql --cpu=2 --memory=7680MiB`
(reinicia la instancia unos minutos).
El usuario es `sqlserver` (Cloud SQL no ofrece `sa` ni `sysadmin`; `sqlserver` puede crear
bases). Genera cargos: revisar la calculadora antes del paso 3.

Desde la Mac o Linux (bash), con una cuenta propietaria del proyecto:

```bash
PROYECTO=trabajoterminal-510019
BUCKET=$PROYECTO-grafia-respaldos
VM_SA=grafia-demo@$PROYECTO.iam.gserviceaccount.com
```

**1. Red privada** (una sola vez). Reserva un rango para los servicios de Google y lo conecta
a `grafia-demo`:

```bash
gcloud services enable sqladmin.googleapis.com servicenetworking.googleapis.com secretmanager.googleapis.com --project $PROYECTO
gcloud compute addresses create google-managed-services-grafia-demo --global --purpose=VPC_PEERING \
  --prefix-length=20 --network=grafia-demo --project $PROYECTO
gcloud services vpc-peerings connect --service=servicenetworking.googleapis.com \
  --ranges=google-managed-services-grafia-demo --network=grafia-demo --project $PROYECTO
```

**2. Collation.** Se fija al crear la instancia y no se puede cambiar. Usar la de la base actual
(en la VM, antes de migrar):

```bash
cd /opt/grafia && sudo docker compose --env-file .env.demo -f compose.demo.yml exec database bash -c \
  '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -h -1 -W -Q "SELECT SERVERPROPERTY('"'"'Collation'"'"')"'
```

**3. Crear la instancia** (genera cargos; tarda unos 15 minutos). La contraseña se genera aquí y
no se imprime; el paso 4 la guarda en Secret Manager. Hacer los pasos 3 y 4 en la misma terminal:

```bash
DB_PASSWORD="Aa1$(openssl rand -hex 24)"
gcloud sql instances create grafia-sql --project $PROYECTO \
  --database-version=SQLSERVER_2022_EXPRESS --edition=ENTERPRISE \
  --cpu=1 --memory=3840MiB --zone=us-central1-a --availability-type=zonal \
  --storage-type=SSD --storage-size=10GB --storage-auto-increase \
  --collation=SQL_Latin1_General_CP1_CI_AS \
  --network=projects/$PROYECTO/global/networks/grafia-demo --no-assign-ip \
  --backup-start-time=06:00 --retained-backups-count=7 \
  --deletion-protection --root-password="$DB_PASSWORD"
```

Cambiar `--collation` si el paso 2 devolvió otra.

**4. Secreto y permisos**:

```bash
IP=$(gcloud sql instances describe grafia-sql --project $PROYECTO --format='value(ipAddresses[0].ipAddress)')
SQL_SA=$(gcloud sql instances describe grafia-sql --project $PROYECTO --format='value(serviceAccountEmailAddress)')
# Conexión para la VM (deploy/cargar-sql.sh la copia a .env.demo)
printf 'DB_SERVER=%s\nDB_PASSWORD=%s\n' "$IP" "$DB_PASSWORD" | gcloud secrets create grafia-sql --data-file=- --project $PROYECTO
unset DB_PASSWORD
gcloud secrets add-iam-policy-binding grafia-sql --member=serviceAccount:$VM_SA \
  --role=roles/secretmanager.secretAccessor --project $PROYECTO
# Cloud SQL lee y escribe los .bak del bucket (importar y exportar)
gcloud storage buckets add-iam-policy-binding gs://$BUCKET --member=serviceAccount:$SQL_SA --role=roles/storage.objectAdmin
# La VM solo puede ver la instancia y pedir exportaciones (respaldo-nube.sh)
gcloud iam roles create grafiaExportarSql --project $PROYECTO --title='Grafia: exportar Cloud SQL' \
  --permissions=cloudsql.instances.get,cloudsql.instances.export
gcloud projects add-iam-policy-binding $PROYECTO --member=serviceAccount:$VM_SA \
  --role=projects/$PROYECTO/roles/grafiaExportarSql --condition=None
```

**5. Migrar los datos de la VM actual.** Cortar el acceso para que nadie escriba durante la
migración, respaldar con los scripts que la VM tiene ahora (todavía con SQL Server en contenedor)
y anotar el nombre del `.bak` que imprime:

```bash
# En la VM, ANTES de actualizar el código
sudo -i
cd /opt/grafia
dc() { docker compose --env-file .env.demo -f compose.demo.yml "$@"; }
dc stop web
bash deploy/respaldo-nube.sh
```

Importarlo en Cloud SQL (desde la Mac). No crear TT antes: la importación la crea.

```bash
gcloud sql import bak grafia-sql gs://$BUCKET/TT-AAAAMMDDTHHMMSSZ.bak --database=TT --project $PROYECTO
```

Actualizar el código y apuntar a Cloud SQL (en la VM). `.env.demo.contenedor` es la
configuración anterior, para volver atrás:

```bash
cp .env.demo .env.demo.contenedor
git pull
bash deploy/cargar-sql.sh
dc up -d --remove-orphans
dc ps -a
dc logs --tail=30 db-init backend
```

`db-init` debe terminar en `Exited (0)` sin aplicar migraciones (ya vienen en el `.bak`) y el
backend en `healthy`. `--remove-orphans` retira el contenedor de SQL Server, pero NO su volumen:
los datos anteriores siguen en el disco (paso 9). Probar la aplicación (sección 4).

**6. Metadatos de la VM** (desde la Mac), para que el respaldo diario y el del apagado exporten
desde Cloud SQL. Después probarlo en la VM con `sudo bash deploy/respaldo-nube.sh`:

```bash
gcloud compute instances add-metadata grafia-demo --zone us-central1-a --project $PROYECTO \
  --metadata=grafia-sql=grafia-sql --metadata-from-file=shutdown-script=deploy/respaldo-nube.sh
```

**7. Ensayo de restauración**, en una base aparte para no tocar TT:

```bash
gcloud sql import bak grafia-sql gs://$BUCKET/TT-AAAAMMDDTHHMMSSZ.bak --database=TT_prueba --project $PROYECTO
gcloud sql databases delete TT_prueba --instance=grafia-sql --project $PROYECTO
```

**8. Volver atrás** si el paso 5 falla (en la VM). Recupera la base del contenedor tal como estaba
al cortar el acceso; lo escrito después en Cloud SQL no se copia de vuelta:

```bash
cd /opt/grafia
cp .env.demo.contenedor .env.demo
git switch --detach HEAD@{1}      # el commit anterior al git pull
dc up -d
```

**9. Retirar el contenedor anterior**, solo cuando Cloud SQL lleve unos días funcionando y haya
exportaciones en el bucket (borra los datos del contenedor de forma permanente):

```bash
docker volume rm grafia-demo_database grafia-demo_backups
rm -rf /opt/grafia/backups /opt/grafia/.env.demo.contenedor
```

**10. Pausar o eliminar la instancia.** Detenida no cobra CPU ni memoria, pero sí el disco
y los respaldos; la demo no funciona mientras está detenida:

```bash
gcloud sql instances patch grafia-sql --activation-policy=NEVER --project $PROYECTO    # detener
gcloud sql instances patch grafia-sql --activation-policy=ALWAYS --project $PROYECTO   # volver a encender
```

Al terminar las pruebas, exportar un último respaldo (`sudo bash deploy/backup.sh` en la VM)
y eliminarla. Borrarla elimina también sus respaldos automáticos; el `.bak` del bucket queda
(el bucket lo borra a los 30 días):

```bash
gcloud sql instances patch grafia-sql --no-deletion-protection --project $PROYECTO
gcloud sql instances delete grafia-sql --project $PROYECTO
```

Sin la instancia, el backend no arranca hasta volver a la base en contenedor (paso 8) o
crear otra instancia e importar el `.bak` (pasos 3 a 5).

Referencias:
- https://docs.cloud.google.com/sql/docs/sqlserver/create-instance
- https://docs.cloud.google.com/sql/docs/sqlserver/configure-private-services-access
- https://docs.cloud.google.com/sql/docs/sqlserver/import-export/import-export-bak
- https://docs.cloud.google.com/sql/docs/sqlserver/users

## Módulo de dictado

En **Profesor → Ejercicios → Nuevo dictado**, selecciona palabras de los seis
bancos iniciales, agrega un pool completo o combina palabras propias. Se permiten
de 1 a 50 palabras de hasta 40 letras; se eliminan duplicados sin distinguir
mayúsculas y se conserva el orden de selección. El dictado se crea y activa en
una sola transacción para todos los alumnos del profesor autenticado. El catálogo
compartido se conserva; cada dictado personalizado solo aparece para su creador.
Se puede desactivar o volver a activar como los demás ejercicios. Las referencias
de un dictado creado son inmutables para conservar la evaluación de las entregas.

El alumno escucha una palabra por vez, puede repetirla y avanzar a su ritmo, y
entrega mediante lienzo o fotografía. Las palabras no se muestran en la interfaz
del alumno. La reproducción usa la voz española del navegador; si falla, se indica
que el profesor puede leerlas. Las palabras se envían al navegador para sintetizar
la voz: este flujo no pretende ocultarlas de las herramientas de desarrollo.
El OCR y CLS usan la secuencia seleccionada como referencia y requieren revisión
del profesor, igual que los ejercicios existentes.

Antes de arrancar el backend actualizado sobre una base existente, aplica
`BackEnd/BD/migraciones/003_dictados.sql` a SQL Server. Añade la columna nullable
`Ejercicios.id_tutor_creador` y su clave foránea sin modificar las entregas.
`compose.demo.yml` la aplica con el inicializador de migraciones al arrancar;
el entorno local antiguo requiere ejecutar el archivo manualmente. Los dictados
guardan fechas límite en UTC y las muestran en la hora local del navegador.
La entrega de un dictado vencido se rechaza aunque el cierre periódico no haya corrido.

Pruebas (desde `BackEnd`, con un entorno virtual activo):

```bash
python -m pip install -r requirements-dev.txt
python -m unittest discover -s tests -v
```

Desde `FrontEnd`: `npm run build`. Las pruebas de API y persistencia usan una
conexión simulada; para la verificación con SQL Server, aplicar la migración dos
veces (debe ser idempotente), crear un dictado, comprobar su aislamiento entre
profesores, entregar como alumno y revisar OCR/CLS en el panel del profesor.
- https://caddyserver.com/docs/automatic-https
