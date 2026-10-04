"""Comparación preliminar de transcripciones; no mide caligrafía ni asigna notas."""
import re
import unicodedata
from difflib import SequenceMatcher


def tokens(texto):
    return re.findall(r"\w+|[^\w\s]", unicodedata.normalize("NFC", texto), re.UNICODE)


def evaluar(contenido, ocr):
    config = contenido.get("evaluacion")
    base = {"version": 1, "requiere_revision": True, "observaciones": []}
    if not isinstance(config, dict) or config.get("modo") not in ("copia", "completar"):
        return {**base, "estado": "no_configurada", "resumen": "Este ejercicio no tiene una respuesta de referencia configurada."}
    respuestas = config.get("respuestas_aceptadas", [])
    if not isinstance(respuestas, list) or not respuestas or any(not isinstance(r, str) or not r.strip() for r in respuestas):
        return {**base, "estado": "no_configurada", "resumen": "Falta configurar una respuesta de referencia válida."}
    texto = ocr.get("texto") or ""
    if ocr.get("estado") != "procesado" or not texto.strip():
        return {**base, "estado": "sin_texto", "resumen": "No hay una transcripción disponible para comparar. Revisa la imagen."}
    # Limita el trabajo de alineación ante textos inesperadamente largos.
    if len(texto) > 10000 or any(len(r) > 10000 for r in respuestas):
        return {**base, "estado": "revision_manual", "resumen": "El texto excede el tamaño de esta evaluación; requiere revisión manual."}
    leido = tokens(texto)
    referencia = max(respuestas, key=lambda r: SequenceMatcher(None, tokens(r), leido, autojunk=False).ratio())
    esperado = tokens(referencia)
    observaciones = []
    acentos = str.maketrans("áéíóúüÁÉÍÓÚÜ", "aeiouuAEIOUU")

    def agregar(tipo, originales, detectados, inicio, fin):
        observaciones.append({"tipo": tipo, "esperado": " ".join(originales),
                              "detectado": " ".join(detectados),
                              "posicion_referencia": inicio + 1, "fin_referencia": fin,
                              "mensaje": "Posible diferencia: contrastar con la imagen original."})

    for operacion, a, b, c, d in SequenceMatcher(None, esperado, leido, autojunk=False).get_opcodes():
        if operacion == "equal":
            continue
        if operacion == "delete":
            agregar("omision", esperado[a:b], [], a, b)
        elif operacion == "insert":
            agregar("adicion", [], leido[c:d], a, b)
        elif b - a == d - c:
            for i, (original, detectado) in enumerate(zip(esperado[a:b], leido[c:d])):
                tipo = "sustitucion"
                if original.casefold() == detectado.casefold():
                    tipo = "mayusculas"
                elif original.translate(acentos).casefold() == detectado.translate(acentos).casefold():
                    tipo = "acentuacion"
                elif not any(ch.isalnum() for ch in original + detectado):
                    tipo = "puntuacion"
                agregar(tipo, [original], [detectado], a + i, a + i + 1)
        else:
            agregar("sustitucion", esperado[a:b], leido[c:d], a, b)
    confianzas = [s.get("confidence") for p in (ocr.get("full_text_annotation") or {}).get("pages", [])
                 for b in p.get("blocks", []) for par in b.get("paragraphs", [])
                 for w in par.get("words", []) for s in w.get("symbols", [])]
    dudosos = sum(isinstance(c, (int, float)) and c < 0.8 for c in confianzas)
    return {**base, "estado": "preliminar", "modo": config["modo"],
            "texto_esperado": referencia, "texto_detectado": texto,
            "observaciones": observaciones, "simbolos_baja_confianza": dudosos,
            "resumen": ("Se encontraron diferencias que necesitan revisión." if observaciones else
                        "La transcripción coincide con la respuesta esperada; confirma el resultado en la imagen."),
            "aviso": "Las diferencias pueden provenir del OCR. No constituyen una calificación ni evalúan la caligrafía."}
