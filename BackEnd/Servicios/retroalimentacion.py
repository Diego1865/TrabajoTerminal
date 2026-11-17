"""Actividades propias y opcionales basadas en promedios confirmados por el tutor.

Las propuestas de motricidad no diagnostican la causa de una letra poco legible.
"""
from copy import deepcopy
from datetime import datetime, timezone
import random
import re

UMBRAL_BAJO = 6
ACTIVIDADES_MOTRICIDAD = ("laberinto", "bolitas", "tiras")


def crear_laberinto(semilla, columnas=8, filas=6):
    """Laberinto conectado con una ruta entre extremos; paredes compartidas por SVG y PDF."""
    azar = random.Random(semilla)
    paredes = {(x, y, x + 1, y) for y in range(filas + 1) for x in range(columnas)}
    paredes |= {(x, y, x, y + 1) for x in range(columnas + 1) for y in range(filas)}
    visitadas, pila = {(0, 0)}, [(0, 0)]
    while pila:
        x, y = pila[-1]
        vecinas = [(nx, ny) for nx, ny in ((x + 1, y), (x, y + 1), (x - 1, y), (x, y - 1))
                   if 0 <= nx < columnas and 0 <= ny < filas and (nx, ny) not in visitadas]
        if not vecinas:
            pila.pop()
            continue
        nx, ny = azar.choice(vecinas)
        if nx != x:
            borde = max(nx, x)
            paredes.remove((borde, y, borde, y + 1))
        else:
            borde = max(ny, y)
            paredes.remove((x, borde, x + 1, borde))
        visitadas.add((nx, ny))
        pila.append((nx, ny))
    paredes.remove((0, 0, 0, 1))
    paredes.remove((columnas, filas - 1, columnas, filas))
    return {"tipo": "laberinto", "columnas": columnas, "filas": filas,
            "paredes": [list(p) for p in sorted(paredes)]}


def _actividad(area, semilla=0, texto=""):
    if area == "ortografia":
        return {
            "actividad": "planas", "titulo": "Mis palabras, paso a paso",
            "objetivo": "Observar y practicar las letras, mayúsculas y acentos de las palabras del modelo.",
            "materiales": ["Lápiz", "Cuaderno o ficha impresa"], "duracion": "5 a 10 minutos",
            "texto_practica": texto,
            "pasos": [
                "Lee cada palabra del modelo y fíjate en sus letras, mayúsculas y acentos.",
                "Copia cada palabra tres veces en su renglón, sin apresurarte.",
                "Compara lo que escribiste con el modelo y corrige lo que sea necesario.",
                "Elige una palabra, escribe una oración y vuelve a revisarla.",
            ],
            "cierre": "Lee tu oración y señala una palabra que ahora puedes escribir con más confianza.",
            "ficha": {"tipo": "planas", "palabras": texto.splitlines(), "repeticiones": 3},
        }
    actividad = ACTIVIDADES_MOTRICIDAD[semilla % len(ACTIVIDADES_MOTRICIDAD)]
    comunes = {"actividad": actividad, "duracion": "5 a 10 minutos", "texto_practica": "",
               "cierre": "Al terminar, escribe tu nombre una vez en el cuaderno, despacio y con comodidad."}
    if actividad == "laberinto":
        return {**comunes, "titulo": "Encuentra el camino",
                "objetivo": "Practicar la coordinación entre la vista y la mano al seguir un camino.",
                "materiales": ["Lápiz", "Ficha impresa o un laberinto dibujado en papel"],
                "pasos": [
                    "Observa el laberinto y localiza la entrada y la salida.",
                    "Busca primero el recorrido con la mirada y después síguelo con un dedo.",
                    "En la ficha impresa, traza el camino con lápiz procurando no tocar las paredes.",
                    "Avanza a tu ritmo. Si llegas a un camino cerrado, vuelve atrás y prueba otro.",
                ], "ficha": crear_laberinto(semilla)}
    if actividad == "bolitas":
        return {**comunes, "titulo": "Un camino de bolitas de papel",
                "objetivo": "Practicar movimientos de los dedos al arrugar, tomar y colocar papel.",
                "materiales": ["Papel de reúso suave", "Una hoja o la ficha impresa", "Pegamento en barra (opcional)"],
                "pasos": [
                    "Rasga diez pedazos de papel con las manos.",
                    "Arruga cada pedazo con los dedos hasta formar una bolita, sin apretar de más.",
                    "Toma las bolitas una por una con el pulgar y el índice y colócalas sobre los círculos de la ficha.",
                    "Si usas una hoja en blanco, dibuja diez círculos formando un camino. Puedes pegar las bolitas al terminar.",
                ], "ficha": {"tipo": "bolitas"}}
    return {**comunes, "titulo": "Tiritas de papel con mis manos",
            "objetivo": "Practicar la coordinación de ambas manos al sostener y rasgar papel.",
            "materiales": ["Una hoja de reúso", "Lápiz o crayón", "Pegamento en barra (opcional)"],
            "pasos": [
                "Dibuja cinco líneas largas separadas en una hoja de reúso, como en el modelo.",
                "Sostén la hoja con una mano y rasga con la otra siguiendo cada línea poco a poco. Usa las manos, sin tijeras.",
                "Forma con las tiras un camino o la primera letra de tu nombre sobre la mesa.",
                "Si quieres conservar tu figura, pégala en otra hoja.",
            ], "ficha": {"tipo": "tiras"}}


def _palabras_modelo(contenido):
    config = contenido.get("evaluacion") if isinstance(contenido, dict) else None
    respuestas = config.get("respuestas_aceptadas") if isinstance(config, dict) else None
    respuestas = respuestas if isinstance(respuestas, list) else []
    referencia = next((r for r in respuestas if isinstance(r, str) and r.strip()), "")
    palabras, vistas = [], set()
    for palabra in re.findall(r"[^\W\d_]+", referencia, re.UNICODE):
        if palabra.casefold() not in vistas:
            vistas.add(palabra.casefold())
            palabras.append(palabra)
        if len(palabras) == 5:
            break
    return "\n".join(palabras or ["árbol", "niño", "ventana", "jardín"])


def crear_recomendacion(promedio_ortografia, promedio_legibilidad, contenido=None, *, semilla=0):
    """Una actividad para el menor promedio < 6; en empate, legibilidad.

    La semilla del intento alterna propuestas de motricidad, sin inferir una
    dificultad motora específica. Las planas usan el modelo, nunca el OCR.
    """
    candidatos = [(area, float(nota)) for area, nota in (
        ("legibilidad", promedio_legibilidad), ("ortografia", promedio_ortografia)
    ) if nota is not None and 0 <= float(nota) < UMBRAL_BAJO]
    if not candidatos:
        return None
    area, promedio = min(candidatos, key=lambda item: item[1])
    return {
        "version": 2, "area": area,
        "promedio_al_calificar": round(promedio, 2), "umbral": UMBRAL_BAJO,
        "motivo": f"Tu promedio confirmado de {'ortografía' if area == 'ortografia' else 'legibilidad'} "
                  f"al calificar este intento fue {promedio:.2f}/10, menor a {UMBRAL_BAJO}/10.",
        "generada_en": datetime.now(timezone.utc).isoformat(), "opcional": True,
        **_actividad(area, semilla, _palabras_modelo(contenido) if area == "ortografia" else ""),
    }


def adaptar_recomendacion(recomendacion, id_intento=0):
    """Presenta las recomendaciones v1 sin enlaces externos ni exigir recalificar.

    Conserva fecha, área, motivo y promedio históricos. La ficha v2 guardada se
    devuelve tal cual, para que alumno, tutor y PDF vean exactamente lo mismo.
    """
    if not isinstance(recomendacion, dict):
        return None
    if recomendacion.get("version", 1) >= 2:
        return deepcopy(recomendacion)
    area = recomendacion.get("area")
    if area not in ("legibilidad", "ortografia"):
        return None
    contenido = {"evaluacion": {"respuestas_aceptadas": [recomendacion.get("texto_practica") or ""]}}
    actualizada = {k: deepcopy(v) for k, v in recomendacion.items() if k != "recurso"}
    actualizada.update(_actividad(area, id_intento, _palabras_modelo(contenido) if area == "ortografia" else ""))
    actualizada["version"] = 2
    return actualizada
