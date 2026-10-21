"""Reconocimiento manuscrito. Las coordenadas corresponden a la imagen enviada."""
import base64
import binascii
import io
import os


class OcrError(Exception):
    def __init__(self, mensaje, status_code=503):
        super().__init__(mensaje)
        self.status_code = status_code


MAX_BYTES = 10 * 1024 * 1024
MAX_PIXELS = 20_000_000


def preparar_imagen(data_url):
    from PIL import Image, UnidentifiedImageError

    if len(data_url) > 4 * ((MAX_BYTES + 2) // 3) + 64:
        raise OcrError("La imagen excede el límite de 10 MB.", 413)
    encabezado, separador, contenido = data_url.partition(",")
    if not separador or encabezado not in ("data:image/png;base64", "data:image/jpeg;base64"):
        raise OcrError("Envía una imagen PNG o JPEG en formato data URL.", 422)
    try:
        datos = base64.b64decode(contenido, validate=True)
    except (ValueError, binascii.Error):
        raise OcrError("La imagen no contiene base64 válido.", 422) from None
    if len(datos) > MAX_BYTES:
        raise OcrError("La imagen excede el límite de 10 MB.", 413)
    try:
        with Image.open(io.BytesIO(datos)) as original:
            if original.format not in ("PNG", "JPEG"):
                raise OcrError("El contenido debe ser una imagen PNG o JPEG.", 422)
            if original.width * original.height > MAX_PIXELS:
                raise OcrError("La imagen excede los 20 millones de píxeles.", 413)
            original.load()
            # El lienzo usa transparencia: componer sobre blanco conserva los trazos.
            rgba = original.convert("RGBA")
            imagen = Image.new("RGBA", rgba.size, "white")
            imagen.alpha_composite(rgba)
            salida = io.BytesIO()
            imagen.convert("RGB").save(salida, format="PNG")
            resultado = salida.getvalue()
            if len(resultado) > MAX_BYTES:
                raise OcrError("La imagen procesada excede los 10 MB. Reduce sus dimensiones.", 413)
            return resultado
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise OcrError("No se pudo leer la imagen.", 422) from None


def reconocer_escritura(data_url):
    imagen = preparar_imagen(data_url)
    if os.getenv("GOOGLE_VISION_ENABLED", "false").lower() != "true":
        return {"proveedor": "google_cloud_vision", "estado": "desactivado",
                "texto": None, "full_text_annotation": None}
    # Carga diferida: el resto de la aplicación puede iniciar sin credenciales OCR.
    from google.cloud import vision
    from google.auth.exceptions import DefaultCredentialsError, GoogleAuthError
    from google.api_core import exceptions as google_errors

    try:
        cliente = vision.ImageAnnotatorClient()
        idiomas = [v.strip() for v in os.getenv("GOOGLE_VISION_LANGUAGE_HINTS", "").split(",") if v.strip()]
        try:
            respuesta = cliente.document_text_detection(
                image=vision.Image(content=imagen),
                image_context=vision.ImageContext(language_hints=idiomas),
                timeout=30,
                retry=None,
            )
        finally:
            cliente.transport.close()
    except (DefaultCredentialsError, GoogleAuthError):
        raise OcrError("El reconocimiento de escritura no está configurado. Contacta al administrador.") from None
    except google_errors.InvalidArgument:
        raise OcrError("Google no pudo procesar esta imagen. Prueba con otra captura.", 422) from None
    except google_errors.GoogleAPICallError:
        raise OcrError("El reconocimiento de escritura no está disponible. Intenta de nuevo más tarde.") from None
    if respuesta.error.message:
        raise OcrError("No se pudo completar el reconocimiento de escritura.", 502)
    anotacion = vision.TextAnnotation.to_dict(respuesta.full_text_annotation)
    texto = anotacion.get("text", "")
    return {
        "proveedor": "google_cloud_vision",
        "estado": "procesado" if texto.strip() else "sin_texto",
        "texto": texto,
        "full_text_annotation": anotacion,
    }
