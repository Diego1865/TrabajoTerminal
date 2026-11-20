# Graf-IA

Graf-IA es una aplicación web para practicar y dar seguimiento a la escritura manuscrita en español en primer grado de primaria. El alumno resuelve ejercicios en un lienzo digital o entrega una foto de su trabajo en papel. El profesor revisa la entrega y registra su evaluación desde el panel de tutor.

## Qué puedes hacer

- **Como profesor**, registra alumnos, activa ejercicios de la ruta de lectoescritura, crea dictados y consulta los intentos de cada alumno desde Inicio. Al revisar una entrega puedes calificarla, agregar comentarios y confirmar o corregir las sugerencias del sistema.
- **Como alumno**, consulta tus ejercicios y dictados, entrega tus respuestas manuscritas y revisa tus calificaciones, tu progreso y las prácticas de refuerzo disponibles.

Google Cloud Vision transcribe la imagen y devuelve las regiones del texto. El backend usa ese resultado para sugerir una evaluación ortográfica mediante **CLS (secuencias correctas de letras)** cuando el ejercicio tiene una respuesta de referencia. También estima la legibilidad del trazo a partir de su alineación, tamaño, espaciado e inclinación. El progreso de ortografía y legibilidad se calcula con los valores confirmados por el profesor.

## Inicio rápido con Docker

Necesitas Git, Docker con Compose para contenedores Linux y credenciales de un proyecto de Google Cloud con Vision API habilitada. Ejecuta los comandos desde la raíz de este repositorio.

```bash
git clone https://github.com/Diego1865/TrabajoTerminal.git
cd TrabajoTerminal
```

Crea un archivo `.env` en esa carpeta con estas variables. Sustituye `CAMBIA_ESTA_CONTRASENA` por una contraseña robusta para SQL Server y `CAMBIA_ESTA_CLAVE` por una clave aleatoria para la firma de sesiones. En `GOOGLE_VISION_CREDENTIALS_FILE`, escribe la ruta absoluta al archivo JSON de credenciales, guardado fuera del repositorio.

```dotenv
DB_DRIVER={ODBC Driver 18 for SQL Server}
DB_SERVER=database
DB_NAME=TT
DB_USER=sa
DB_PASSWORD=CAMBIA_ESTA_CONTRASENA
SECRET_KEY=CAMBIA_ESTA_CLAVE
NEXT_PUBLIC_API_URL=http://localhost:8000
CORREO_MODO=consola
GOOGLE_VISION_CREDENTIALS_FILE=/ruta/privada/credenciales-google.json
GOOGLE_VISION_LANGUAGE_HINTS=es
```

Construye y levanta los servicios.

```bash
docker compose up -d --build
docker compose ps -a
```

En el primer arranque, `db-init` crea la base `TT`, aplica las migraciones y carga el catálogo de ejercicios. Es normal que este servicio termine con código `0`. SQL Server conserva los datos en el volumen `mssql_data`.

Compose monta el JSON en modo de solo lectura. El backend comprueba que puede cargar las credenciales antes de iniciar y la interfaz espera a que la API esté lista. Las entregas se envían a Google Cloud Vision desde el backend y consumen cuota del proyecto.

- [Abrir Graf-IA](http://localhost:3000)
- [Consultar la API en Swagger](http://localhost:8000/docs)

### Probar el flujo de aula

1. Registra una cuenta de tutor. Con `CORREO_MODO=consola`, consulta el código de verificación en los registros del backend con `docker compose logs --tail=30 backend`.
2. Inicia sesión como tutor, registra un alumno en **Alumnos** y activa un ejercicio en **Ejercicios**.
3. Entra con la cuenta del alumno y entrega un ejercicio desde el lienzo o con una foto.
4. Vuelve al panel del tutor, abre la tarjeta del alumno en **Inicio** y selecciona un intento **Sin calificar**. Guarda la calificación y comprueba que se refleje en la cuenta del alumno.

Puedes detener el entorno con `docker compose down`. Los datos del volumen se conservan.

## Desarrollo local

El proyecto utiliza **Next.js, React y Tailwind CSS** en el frontend, **FastAPI y Python** en el backend, y **SQL Server** para persistencia. Las imágenes Docker usan Node.js 20 y Python 3.11. Para ejecutar el backend fuera de Docker, instala también el controlador ODBC 18 de Microsoft para SQL Server.

Para ejecutar el frontend y el backend con recarga automática, deja sus contenedores detenidos y arranca la base y el inicializador desde la raíz.

```bash
docker compose up -d --build database db-init
docker compose logs db-init
```

Comprueba que `db-init` haya terminado correctamente. En `BackEnd/.env`, copia las variables de base de datos, sesión y correo del ejemplo anterior y cambia `DB_SERVER` a `localhost,1433`. Agrega `GOOGLE_VISION_ENABLED=true` y configura ADC mediante `GOOGLE_APPLICATION_CREDENTIALS` con la ruta al JSON o con `gcloud auth application-default login`. [Configuración de ADC para desarrollo local](https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment).

En una terminal de PowerShell inicia FastAPI.

```powershell
cd BackEnd
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

En `FrontEnd/.env.local` define `NEXT_PUBLIC_API_URL=http://localhost:8000`. En otra terminal, desde la raíz del repositorio, inicia Next.js.

```bash
cd FrontEnd
npm ci
npm run dev
```

Abre la interfaz en [localhost:3000](http://localhost:3000), el origen que la API admite de forma predeterminada.

## Verificación

Desde `BackEnd`, instala las dependencias de desarrollo y ejecuta las pruebas del backend. Las pruebas utilizan servicios simulados para SQL Server y Google Cloud Vision.

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Desde `FrontEnd`, ejecuta el análisis estático y la compilación con las dependencias instaladas.

```bash
npm run lint
npm run build
```

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| [`FrontEnd/`](FrontEnd/) | Interfaz de Next.js y paneles de alumno y tutor. |
| [`BackEnd/Control/`](BackEnd/Control/) | Rutas de FastAPI, autenticación y permisos. |
| [`BackEnd/Modelo/`](BackEnd/Modelo/) | Acceso a datos y esquemas de la API. |
| [`BackEnd/Servicios/`](BackEnd/Servicios/) | OCR, CLS, legibilidad, dictados y retroalimentación. |
| [`BackEnd/BD/`](BackEnd/BD/) | Esquema SQL, migraciones y catálogo. |
| [`deploy/`](deploy/) | Configuración y guías para la demo en Google Cloud. |

El [manual de despliegue](deploy/README.md) describe la demo con Caddy, Compute Engine y Cloud SQL. Usa [`compose.demo.yml`](compose.demo.yml) como configuración independiente para ese entorno.
