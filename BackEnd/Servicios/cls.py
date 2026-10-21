"""CLS (Correct Letter Sequences): secuencias de letras correctas, como sugerencia para el tutor.

Cada palabra esperada se rodea de bordes (^casa$) y aporta len(palabra) + 1 pares de unidades
vecinas. Un par es correcto si aparece, junto y en el mismo orden, en la palabra escrita.
Distingue mayúsculas, acentos y ñ; ignora puntuación y números. No asigna notas.
"""
import re
import unicodedata
from collections import Counter
from difflib import SequenceMatcher


def palabras(texto):
    return re.findall(r"[^\W\d_]+", unicodedata.normalize("NFC", texto or ""))


def pares(palabra):
    unidades = ["^", *palabra, "$"]
    return Counter(zip(unidades, unidades[1:]))


def cls_palabra(esperada, escrita):
    if not escrita:
        return 0
    return sum((pares(esperada) & pares(escrita)).values())


def calcular_cls(referencia, texto):
    esperadas, escritas = palabras(referencia), palabras(texto)
    detalle = []

    def agregar(esperada, escrita):
        detalle.append({"esperada": esperada, "escrita": escrita,
                        "correctas": cls_palabra(esperada, escrita), "posibles": len(esperada) + 1})

    for operacion, a, b, c, d in SequenceMatcher(None, esperadas, escritas, autojunk=False).get_opcodes():
        if operacion == "insert":
            continue  # Palabras de más: no suman ni restan.
        for i, esperada in enumerate(esperadas[a:b]):
            # equal y replace se emparejan en orden; lo que falta en lo escrito cuenta 0.
            agregar(esperada, escritas[c + i] if c + i < d else "")
    correctas = sum(p["correctas"] for p in detalle)
    posibles = sum(p["posibles"] for p in detalle)
    return {"correctas": correctas, "posibles": posibles,
            "puntaje_sugerido": round(correctas / posibles * 10, 2) if posibles else None,
            "por_palabra": detalle}
