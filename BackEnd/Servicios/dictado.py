"""Banco inicial y validación del contenido de los dictados."""
import unicodedata
from datetime import datetime, timezone


POOLS = [
    {"id": "cotidianas", "nombre": "Palabras cotidianas", "palabras": [
        "casa", "mesa", "sopa", "luna", "mano", "pelota", "camino", "escuela", "familia", "amigo"]},
    {"id": "acentos", "nombre": "Acentuación", "palabras": [
        "árbol", "lápiz", "canción", "corazón", "pájaro", "teléfono", "azúcar", "ratón", "música", "café"]},
    {"id": "bv", "nombre": "Uso de b y v", "palabras": [
        "barco", "ventana", "abuelo", "biblioteca", "bicicleta", "vaca", "vestido", "invierno", "nube", "subir"]},
    {"id": "csz", "nombre": "Uso de c, s y z", "palabras": [
        "zapato", "cereza", "semilla", "zanahoria", "cielo", "sonrisa", "azul", "cocina", "silla", "pez"]},
    {"id": "gjh", "nombre": "Uso de g, j y h", "palabras": [
        "girasol", "jirafa", "gente", "jardín", "hoja", "huevo", "hormiga", "guitarra", "juguete", "hielo"]},
    {"id": "enier", "nombre": "Ñ, r y rr", "palabras": [
        "niño", "montaña", "piñata", "araña", "carro", "perro", "tierra", "ratón", "mariposa", "reloj"]},
]


def normalizar_palabras(palabras):
    if not isinstance(palabras, list) or not 1 <= len(palabras) <= 50:
        raise ValueError("Selecciona entre 1 y 50 palabras.")
    resultado = []
    vistas = set()
    for palabra in palabras:
        if not isinstance(palabra, str):
            raise ValueError("Cada palabra debe ser texto.")
        palabra = unicodedata.normalize("NFC", palabra.strip())
        if not 1 <= len(palabra) <= 40 or not palabra.isalpha():
            raise ValueError("Usa palabras de hasta 40 letras, sin espacios, números ni signos.")
        clave = palabra.casefold()
        if clave not in vistas:
            resultado.append(palabra)
            vistas.add(clave)
    return resultado


def fecha_limite_utc(fecha):
    """Las fechas nuevas llegan con zona; SQL Server almacena UTC sin offset."""
    if fecha is None:
        return None
    if fecha.tzinfo is None or fecha.utcoffset() is None:
        raise ValueError("La fecha límite debe incluir la zona horaria.")
    fecha = fecha.astimezone(timezone.utc)
    if fecha <= datetime.now(timezone.utc):
        raise ValueError("La fecha límite debe estar en el futuro.")
    return fecha.replace(tzinfo=None)


def contenido_dictado(palabras):
    palabras = normalizar_palabras(palabras)
    return {
        "texto_guia": None,
        "dictado": {"palabras": palabras},
        "evaluacion": {"modo": "dictado", "respuestas_aceptadas": [" ".join(palabras)]},
    }
