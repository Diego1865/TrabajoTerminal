"""Códigos de 6 dígitos enviados por correo, sin guardarlos en la base de datos.

El servidor entrega un token firmado con una huella del código (nunca el código).
Para confirmarlo, el cliente devuelve el token junto con el código que recibió.
- Caduca en 10 minutos y sirve una sola vez.
- Máximo 5 intentos por código y un envío por minuto al mismo destino.
Los contadores viven en memoria del backend (un solo proceso); si se reinicia,
basta con pedir otro código.
"""
import hashlib
import hmac
import os
import secrets
import threading
import time

import jwt

VIGENCIA_SEGUNDOS = 600
MAX_INTENTOS = 5
ESPERA_REENVIO_SEGUNDOS = 60

_intentos = {}      # jti -> (intentos fallidos, expira)
_usados = {}        # jti -> expira
_ultimo_envio = {}  # destino -> momento del último envío
_candado = threading.Lock()


class CodigoError(ValueError):
    pass


def normalizar_correo(correo):
    return (correo or "").strip().lower()


def _clave():
    clave = os.getenv("SECRET_KEY")
    if not clave:
        raise RuntimeError("SECRET_KEY no está definida")
    return clave


def _huella(proposito, sujeto, codigo, extra):
    texto = f"{proposito}|{sujeto}|{codigo}|{extra}"
    return hmac.new(_clave().encode(), texto.encode(), hashlib.sha256).hexdigest()


def _limpiar(ahora):
    for jti in [j for j, (_, expira) in _intentos.items() if expira < ahora]:
        del _intentos[jti]
    for jti in [j for j, expira in _usados.items() if expira < ahora]:
        del _usados[jti]
    for destino in [d for d, momento in _ultimo_envio.items() if ahora - momento > ESPERA_REENVIO_SEGUNDOS]:
        del _ultimo_envio[destino]


def permitir_envio(destino):
    """Evita mandar más de un correo por minuto al mismo destino."""
    ahora = time.time()
    with _candado:
        _limpiar(ahora)
        if destino in _ultimo_envio:
            raise CodigoError("Ya enviamos un código hace poco. Espera un minuto antes de pedir otro.")
        _ultimo_envio[destino] = ahora


def liberar_envio(destino):
    """Si el correo no se pudo enviar, permite reintentar de inmediato."""
    with _candado:
        _ultimo_envio.pop(destino, None)


def crear_codigo(proposito, sujeto, extra=""):
    """Devuelve (codigo, token). El código va por correo; el token, al navegador."""
    codigo = f"{secrets.randbelow(10 ** 6):06d}"
    datos = {"p": proposito, "sub": sujeto, "h": _huella(proposito, sujeto, codigo, extra),
             "jti": secrets.token_hex(8), "exp": int(time.time()) + VIGENCIA_SEGUNDOS}
    return codigo, jwt.encode(datos, _clave(), algorithm="HS256")


def verificar_codigo(token, proposito, sujeto, codigo, extra=""):
    try:
        datos = jwt.decode(token or "", _clave(), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise CodigoError("El código expiró. Pide uno nuevo.")
    except jwt.InvalidTokenError:
        raise CodigoError("Código no válido. Pide uno nuevo.")
    if datos.get("p") != proposito or datos.get("sub") != sujeto:
        raise CodigoError("El código no corresponde a este correo. Pide uno nuevo.")

    jti, expira = datos["jti"], datos["exp"]
    with _candado:
        _limpiar(time.time())
        if jti in _usados:
            raise CodigoError("Este código ya se usó. Pide uno nuevo.")
        fallidos = _intentos.get(jti, (0, expira))[0]
        if fallidos >= MAX_INTENTOS:
            raise CodigoError("Demasiados intentos. Pide un código nuevo.")
        if not hmac.compare_digest(datos.get("h", ""), _huella(proposito, sujeto, (codigo or "").strip(), extra)):
            fallidos += 1
            _intentos[jti] = (fallidos, expira)
            if fallidos >= MAX_INTENTOS:
                raise CodigoError("Código incorrecto. Ya no quedan intentos; pide un código nuevo.")
            raise CodigoError(f"Código incorrecto. Te quedan {MAX_INTENTOS - fallidos} intentos.")
        _usados[jti] = expira
