"""Envío de correos por SMTP (por defecto, Gmail con contraseña de aplicación).

CORREO_MODO=consola imprime el correo en el log en lugar de enviarlo; sirve solo
para desarrollo local, nunca en la demo.
"""
import os
import smtplib
import ssl
from email.message import EmailMessage


class CorreoError(Exception):
    pass


def enviar_correo(destino, asunto, texto):
    if os.getenv("CORREO_MODO", "smtp") == "consola":
        print(f"[correo a {destino}] {asunto}\n{texto}", flush=True)
        return

    usuario = os.getenv("SMTP_USER")
    clave = os.getenv("SMTP_PASSWORD")
    if not usuario or not clave:
        raise CorreoError("El envío de correos no está configurado en el servidor.")

    mensaje = EmailMessage()
    mensaje["From"] = f"{os.getenv('SMTP_FROM_NAME', 'Graf-IA')} <{usuario}>"
    mensaje["To"] = destino
    mensaje["Subject"] = asunto
    mensaje.set_content(texto)
    try:
        with smtplib.SMTP(os.getenv("SMTP_HOST", "smtp.gmail.com"), int(os.getenv("SMTP_PORT", "587")), timeout=15) as smtp:
            smtp.starttls(context=ssl.create_default_context())
            smtp.login(usuario, clave)
            smtp.send_message(mensaje)
    except (smtplib.SMTPException, OSError) as error:
        print("Error al enviar correo:", type(error).__name__, flush=True)
        raise CorreoError("No se pudo enviar el correo. Intenta de nuevo en unos minutos.") from error
