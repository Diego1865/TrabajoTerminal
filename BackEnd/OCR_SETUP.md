# Google Cloud Vision: configuración y prueba

La entrega existente (`POST /api/alumno/intento`, con JWT de alumno) procesa tanto
fotografías como dibujos. `GOOGLE_VISION_ENABLED=false` es el valor predeterminado:
permite seguir entregando sin llamar a Google. Con `true`, se utiliza
DOCUMENT_TEXT_DETECTION. La imagen sale del backend hacia Google; no se envían
credenciales al navegador. Las llamadas consumen la cuota/facturación de tu proyecto.

## 1. Base de datos y dependencias

Antes de iniciar el código actualizado en una base existente, ejecutar
`BD/migraciones/001_google_vision.sql` en SQL Server, seleccionando la base del proyecto.
La migración agrega `resultado_ocr_json` y conserva el texto como Unicode.
Para una base nueva, `BD/esquemaBD.sql` ya contiene esas columnas.
La migración NO se ejecuta automáticamente sobre bases existentes.

Desde BackEnd:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 2. Crear y autenticar el proyecto de Google Cloud

1. Crear o seleccionar un proyecto en https://console.cloud.google.com/.
2. Vincular facturación y habilitar Cloud Vision API (`vision.googleapis.com`).
3. Instalar Google Cloud CLI para desarrollo local.
4. Ejecutar estos comandos reemplazando TU_PROYECTO por el ID real:

```powershell
gcloud init
gcloud services enable vision.googleapis.com --project TU_PROYECTO
gcloud auth application-default login
gcloud auth application-default set-quota-project TU_PROYECTO
```

La identidad debe tener permiso `serviceusage.services.use` en el proyecto de cuota
(por ejemplo, rol Service Usage Consumer). El login abre el navegador para que
autentiques tu cuenta. No pegar tokens ni archivos de credenciales en el chat.

Agregar `GOOGLE_VISION_ENABLED=true` al `.env` existente de BackEnd y reiniciar:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

`GOOGLE_VISION_LANGUAGE_HINTS` es opcional, vacío por defecto (autodetección).
Se puede probar `es` como pista; no corrige la ortografía del alumno.

## 3. Si ejecutas con Docker

La autenticación local de Windows no se comparte automáticamente con el contenedor.
Usar una cuenta de servicio autorizada y un archivo de credenciales fuera del repositorio,
o ADC de la plataforma si se despliega en Google Cloud. Para el archivo local:

1. En el `.env` de la raíz, definir
   `GOOGLE_VISION_CREDENTIALS_FILE=C:/ruta/privada/google-vision.json`.
2. Aplicar la migración en la base existente.
3. Desde la raíz ejecutar:

```powershell
docker compose -f docker-compose.yml -f docker-compose.ocr.yml up -d --build
```

El archivo se monta solo para lectura; no se copia a la imagen Docker.
El Compose habitual mantiene OCR desactivado hasta configurar la autenticación.

## Resultado y comportamiento

La respuesta de entrega conserva `message` y agrega `ocr`:

- `estado`: `desactivado`, `procesado` o `sin_texto`.
- `texto`: texto reconocido, cadena vacía si no detectó texto, null si está desactivado.
- `full_text_annotation`: estructura completa del SDK con páginas, bloques, párrafos,
  palabras y símbolos. Los nombres son snake_case: `bounding_box`, `confidence`,
  `property`, `text`. Los vértices conservan su orden y sus coordenadas en píxeles.

Se guarda el resultado completo en `Intentos.resultado_ocr_json` y el texto en
`texto_detectado_ocr`; el texto ya se muestra en Ejercicios Completados.
Las cajas corresponden a la imagen entregada (después del recorte o redimensionado
del navegador), no a la fotografía original. Se compone transparencia sobre blanco.
No se asignan puntuaciones caligráficas ni se interpreta confidence como calificación.

Con OCR habilitado, si falla Google no se guarda el intento: se devuelve un error
controlado y la interfaz conserva la captura para reintentar. Una imagen válida sin
texto sí se guarda, sin inventar texto ni puntuación. Los intentos anteriores no se
reprocesan al activar OCR. Se aceptan PNG/JPEG hasta 10 MB y 20 millones de píxeles.

## Verificación

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Las pruebas usan respuestas simuladas: no consumen Google ni escriben en SQL Server.
Para verificar de extremo a extremo: iniciar sesión como alumno, entregar una foto
con texto conocido y un dibujo; abrir Ejercicios Completados y contrastar el texto.
Inspeccionar `ocr.full_text_annotation` en la respuesta de red o el JSON guardado
para comparar cajas con la imagen. La precisión manuscrita requiere muestras reales.

Referencias oficiales:
- https://docs.cloud.google.com/vision/docs/handwriting
- https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment
