"""Medidas de legibilidad (caligrafía) sugeridas a partir del OCR.

Cada medida va de 0 a 10 y es solo una SUGERENCIA: cuenta para el progreso
únicamente cuando el tutor la confirma o corrige al calificar.

Se usan los recuadros que Google Vision devuelve por letra (en píxeles de la
imagen enviada, que no se redimensiona) y, para la inclinación, la tinta de la
imagen. Los cortes de cada medida son una calibración inicial; `detalle` guarda
los valores crudos para explicarlos y ajustarlos con datos reales.
"""
import io
import math
import statistics

# Letras sin rasgos que suban o bajen: su altura debería ser pareja.
LETRAS_X = set("acemnorsuvwxzáéíóúü")
# Letras que bajan del renglón: no sirven para encontrar la línea de apoyo.
DESCENDENTES = set("gjpqyç")


def _lineal(valor, bueno, malo):
    """10 si valor <= bueno, 0 si valor >= malo, recta en medio."""
    if valor is None:
        return None
    t = (malo - valor) / (malo - bueno)
    return round(max(0.0, min(1.0, t)) * 10, 1)


def _cv(valores):
    """Coeficiente de variación (adimensional): desviación / media."""
    if len(valores) < 2:
        return None
    media = statistics.fmean(valores)
    if media <= 0:
        return None
    return statistics.pstdev(valores) / media


def _caja(simbolo):
    vertices = (simbolo.get("bounding_box") or {}).get("vertices") or []
    if not vertices:
        return None
    xs = [v.get("x", 0) for v in vertices]
    ys = [v.get("y", 0) for v in vertices]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    if x1 <= x0 or y1 <= y0:
        return None
    return {"texto": simbolo.get("text", ""), "x0": x0, "x1": x1, "y0": y0, "y1": y1, "h": y1 - y0}


def palabras_de(anotacion):
    """Lista de palabras; cada una es una lista de letras con su recuadro."""
    palabras = []
    for pagina in (anotacion or {}).get("pages", []):
        for bloque in pagina.get("blocks", []):
            for parrafo in bloque.get("paragraphs", []):
                for palabra in parrafo.get("words", []):
                    letras = [c for c in (_caja(s) for s in palabra.get("symbols", []) if s.get("text", "").isalpha()) if c]
                    if letras:
                        palabras.append(letras)
    return palabras


def _renglones(palabras):
    """Agrupa palabras en renglones: comparten renglón si sus franjas verticales se traslapan > 50 %."""
    def franja(p):
        return min(l["y0"] for l in p), max(l["y1"] for l in p)

    renglones = []
    for palabra in sorted(palabras, key=lambda p: sum(franja(p)) / 2):
        y0, y1 = franja(palabra)
        for renglon in renglones:
            r0, r1 = renglon["y0"], renglon["y1"]
            if min(y1, r1) - max(y0, r0) > 0.5 * min(y1 - y0, r1 - r0):
                renglon["palabras"].append(palabra)
                n = len(renglon["palabras"])
                renglon["y0"] += (y0 - r0) / n
                renglon["y1"] += (y1 - r1) / n
                break
        else:
            renglones.append({"y0": y0, "y1": y1, "palabras": [palabra]})
    return [sorted(r["palabras"], key=lambda p: p[0]["x0"]) for r in renglones]


def medir_tamano(palabras):
    alturas = [l["h"] for p in palabras for l in p if l["texto"].lower() in LETRAS_X and l["texto"].islower()]
    if len(alturas) < 3:
        return None, None
    cv = _cv(alturas)
    return _lineal(cv, 0.10, 0.50), cv


def medir_alineacion(renglones):
    """Desviación de la base de las letras respecto a una recta por renglón, en alturas de letra."""
    total, peso = 0.0, 0
    for renglon in renglones:
        letras = [l for p in renglon for l in p]
        puntos = [((l["x0"] + l["x1"]) / 2, l["y1"]) for l in letras if l["texto"].lower() not in DESCENDENTES]
        if len(puntos) < 3:
            continue
        mx = statistics.fmean(x for x, _ in puntos)
        my = statistics.fmean(y for _, y in puntos)
        sxx = sum((x - mx) ** 2 for x, _ in puntos)
        a = sum((x - mx) * (y - my) for x, y in puntos) / sxx if sxx else 0.0
        residuos = [y - (my + a * (x - mx)) for x, y in puntos]
        rms = math.sqrt(statistics.fmean(r * r for r in residuos))
        altura = statistics.median(l["h"] for l in letras)
        total += (rms / altura) * len(puntos)
        peso += len(puntos)
    if not peso:
        return None, None
    desviacion = total / peso
    return _lineal(desviacion, 0.05, 0.35), desviacion


def medir_espaciado(renglones):
    """Variación de los huecos entre palabras; con una sola palabra, entre letras."""
    huecos = [b[0]["x0"] - a[-1]["x1"] for r in renglones for a, b in zip(r, r[1:])]
    if len(huecos) < 2:
        huecos = [b["x0"] - a["x1"] for r in renglones for p in r for a, b in zip(p, p[1:])]
    if len(huecos) < 2:
        return None, None
    if statistics.fmean(huecos) <= 0:
        return 0.0, None  # palabras o letras encimadas
    cv = _cv(huecos)
    return _lineal(cv, 0.15, 0.80), cv


def medir_inclinacion(palabras, imagen_png):
    """Ángulo medio del trazo respecto a la vertical (momentos de la tinta), ponderado por tinta."""
    if not imagen_png:
        return None, None
    from PIL import Image

    with Image.open(io.BytesIO(imagen_png)) as original:
        gris = original.convert("L")
    suma, tinta_total = 0.0, 0
    for letra in (l for p in palabras for l in p):
        if letra["h"] < 8:
            continue
        recorte = gris.crop((letra["x0"], letra["y0"], letra["x1"] + 1, letra["y1"] + 1))
        ancho = recorte.width
        puntos = [(i % ancho, i // ancho) for i, v in enumerate(recorte.tobytes()) if v < 128]
        if len(puntos) < 10:
            continue
        mx = statistics.fmean(x for x, _ in puntos)
        my = statistics.fmean(y for _, y in puntos)
        mu02 = sum((y - my) ** 2 for _, y in puntos)
        if mu02 <= 0:
            continue
        mu11 = sum((x - mx) * (y - my) for x, y in puntos)
        angulo = abs(math.degrees(math.atan(mu11 / mu02)))
        suma += angulo * len(puntos)
        tinta_total += len(puntos)
    if not tinta_total:
        return None, None
    grados = suma / tinta_total
    return _lineal(grados, 10, 40), grados


def medir_legibilidad(anotacion, imagen_png=None):
    """Sugerencia de legibilidad, o None si el OCR no encontró letras."""
    palabras = palabras_de(anotacion)
    if not palabras:
        return None
    renglones = _renglones(palabras)
    tamano, cv_alturas = medir_tamano(palabras)
    alineacion, desviacion = medir_alineacion(renglones)
    espaciado, cv_espacios = medir_espaciado(renglones)
    inclinacion, grados = medir_inclinacion(palabras, imagen_png)
    medidas = {"alineacion": alineacion, "tamano": tamano, "espaciado": espaciado, "inclinacion": inclinacion}
    disponibles = [v for v in medidas.values() if v is not None]
    redondear = lambda v: None if v is None else round(v, 3)
    return {
        "version": 1,
        **medidas,
        "puntaje_sugerido": round(statistics.fmean(disponibles), 1) if disponibles else None,
        "detalle": {
            "letras": sum(len(p) for p in palabras),
            "renglones": len(renglones),
            "cv_alturas": redondear(cv_alturas),
            "desviacion_renglon": redondear(desviacion),
            "cv_espacios": redondear(cv_espacios),
            "inclinacion_grados": redondear(grados),
        },
    }
