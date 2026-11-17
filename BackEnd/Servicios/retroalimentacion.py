"""Recomendación opcional basada exclusivamente en promedios confirmados por el tutor."""
from datetime import datetime, timezone
import re

UMBRAL_BAJO = 6
RECURSOS = {
    "legibilidad": {
        "nombre": "RecursosTIC · Fichas de caligrafía y papel pautado",
        "url": "https://recursostic.net/fichas-de-caligrafia-para-imprimir/",
    },
    "ortografia": {
        "nombre": "EduTools · Generador de caligrafía",
        "url": "https://edutools.tools/herramientas/generador-caligrafia/",
    },
}


def crear_recomendacion(promedio_ortografia, promedio_legibilidad, contenido=None):
    """Una actividad para el menor promedio < 6; en empate, legibilidad.

    No recibe notas del OCR ni usa diferencias automáticas como errores confirmados.
    Las planas practican la respuesta de referencia, nunca la transcripción del alumno.
    """
    candidatos = [(area, float(nota)) for area, nota in (
        ("legibilidad", promedio_legibilidad), ("ortografia", promedio_ortografia)
    ) if nota is not None and 0 <= float(nota) < UMBRAL_BAJO]
    if not candidatos:
        return None
    area, promedio = min(candidatos, key=lambda item: item[1])
    if area == "legibilidad":
        titulo = "Mi letra sobre el renglón"
        texto = "Mi casa tiene una ventana."
        pasos = [
            "Abre el recurso y elige una pauta del mismo tamaño que la de tu cuaderno.",
            "Escribe el texto de práctica y prepara tres renglones: uno como modelo y dos para copiar.",
            "Copia despacio, apoyando las letras en el renglón y manteniendo un tamaño parecido.",
            "Deja un espacio uniforme entre palabras y revisa si puedes leer tu última línea con facilidad.",
        ]
    else:
        titulo = "Planas de palabras y una oración"
        config = contenido.get("evaluacion") if isinstance(contenido, dict) else None
        config = config if isinstance(config, dict) else {}
        respuestas = config.get("respuestas_aceptadas") or []
        referencia = next((r for r in respuestas if isinstance(r, str) and r.strip()), "")
        # Hasta cinco palabras del modelo, sin duplicados; no se presumen errores específicos.
        palabras, vistas = [], set()
        for palabra in re.findall(r"[^\W\d_]+", referencia, re.UNICODE):
            if palabra.casefold() not in vistas:
                vistas.add(palabra.casefold())
                palabras.append(palabra)
            if len(palabras) == 5:
                break
        texto = "\n".join(palabras or ["árbol", "niño", "ventana", "jardín"])
        pasos = [
            "Lee las palabras del modelo y observa sus letras, mayúsculas y acentos.",
            "Abre el generador, escribe una palabra por línea y elige modelo con espacio para copiar.",
            "Haz una plana breve: copia cada palabra tres veces en tu cuaderno o en la ficha impresa.",
            "Escribe una oración con una de las palabras y compárala con el modelo.",
        ]
    return {
        "version": 1,
        "area": area,
        "titulo": titulo,
        "promedio_al_calificar": round(promedio, 2),
        "umbral": UMBRAL_BAJO,
        "motivo": f"Tu promedio confirmado de {'ortografía' if area == 'ortografia' else 'legibilidad'} "
                  f"al calificar este intento fue {promedio:.2f}/10, menor a {UMBRAL_BAJO}/10.",
        "texto_practica": texto,
        "pasos": pasos,
        "recurso": dict(RECURSOS[area]),
        "generada_en": datetime.now(timezone.utc).isoformat(),
        "opcional": True,
    }
