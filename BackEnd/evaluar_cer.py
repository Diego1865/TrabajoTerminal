"""Mide el CER de Cloud Vision con transcripciones manuales, a partir de un JSONL."""
import argparse
import base64
import json
import unicodedata
from pathlib import Path

from Servicios.ocr import OcrError, reconocer_escritura


def normalizar(texto):
    """Conserva mayúsculas, diacríticos y puntuación. Colapsa espacios y saltos."""
    return " ".join(unicodedata.normalize("NFC", texto).split())


def distancia_edicion(referencia, lectura):
    anterior = list(range(len(lectura) + 1))
    for i, esperado in enumerate(referencia, start=1):
        actual = [i]
        for j, detectado in enumerate(lectura, start=1):
            actual.append(min(anterior[j] + 1, actual[-1] + 1, anterior[j - 1] + (esperado != detectado)))
        anterior = actual
    return anterior[-1]


def leer_muestras(archivo):
    ids = set()
    with archivo.open(encoding="utf-8-sig") as entrada:
        for numero, linea in enumerate(entrada, start=1):
            if not linea.strip():
                continue
            try:
                muestra = json.loads(linea)
                if not isinstance(muestra, dict):
                    raise ValueError("Se esperaba un objeto JSON.")
                identificador = muestra.get("id")
                if not isinstance(identificador, str) or not identificador.strip() or identificador in ids:
                    raise ValueError("Cada muestra necesita un id de texto único.")
                referencia = muestra.get("referencia")
                if not isinstance(referencia, str) or not normalizar(referencia):
                    raise ValueError("La transcripción manual debe contener texto.")
                if "ocr" in muestra:
                    if not isinstance(muestra["ocr"], str):
                        raise ValueError("El resultado OCR debe ser texto. Usa una cadena vacía si no detectó texto.")
                elif not isinstance(muestra.get("imagen"), str) or not muestra["imagen"].strip():
                    raise ValueError("Indica una imagen o la transcripción OCR ya obtenida.")
                origen = muestra.get("origen", "sin_especificar")
                if not isinstance(origen, str) or not origen.strip():
                    raise ValueError("El origen debe ser texto.")
            except ValueError as error:
                raise ValueError(f"Línea {numero}: {error}") from None
            ids.add(identificador)
            yield muestra


def leer_imagen(ruta):
    tipos = {".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg"}
    tipo = tipos.get(ruta.suffix.lower())
    if not tipo:
        raise ValueError("Se esperaba un archivo PNG o JPEG.")
    datos = base64.b64encode(ruta.read_bytes()).decode("ascii")
    resultado = reconocer_escritura(f"data:image/{tipo};base64,{datos}")
    if resultado["estado"] not in ("procesado", "sin_texto"):
        raise ValueError(f"El OCR devolvió el estado {resultado['estado']}.")
    return resultado["texto"] or ""


def _resumir(resultados):
    evaluadas = [m for m in resultados if m["estado"] != "fallo"]
    caracteres = sum(m["caracteres_referencia"] for m in evaluadas)
    ediciones = sum(m["ediciones"] for m in evaluadas)
    return {
        "muestras": len(resultados),
        "evaluadas": len(evaluadas),
        "sin_texto": sum(m["estado"] == "sin_texto" for m in evaluadas),
        "fallos": len(resultados) - len(evaluadas),
        "caracteres_referencia": caracteres,
        "ediciones": ediciones,
        "cer_porcentaje": round(100 * ediciones / caracteres, 4) if caracteres else None,
    }


def evaluar_muestras(archivo):
    muestras = list(leer_muestras(archivo))
    if not muestras:
        raise ValueError("El manifiesto debe contener al menos una muestra.")

    resultados = []
    por_origen = {}
    for muestra in muestras:
        referencia = normalizar(muestra["referencia"])
        origen = muestra.get("origen", "sin_especificar")
        resultado = {"id": muestra["id"], "origen": origen, "referencia": referencia}
        try:
            ocr = muestra["ocr"] if "ocr" in muestra else leer_imagen(archivo.parent / muestra["imagen"])
        except (OSError, OcrError, ValueError) as error:
            resultado.update(estado="fallo", error=str(error))
        else:
            lectura = normalizar(ocr)
            ediciones = distancia_edicion(referencia, lectura)
            resultado.update(
                estado="procesado" if lectura else "sin_texto",
                ocr=ocr,
                caracteres_referencia=len(referencia),
                ediciones=ediciones,
                cer_porcentaje=round(100 * ediciones / len(referencia), 4),
            )
        resultados.append(resultado)
        por_origen.setdefault(origen, []).append(resultado)

    return {
        "global": _resumir(resultados),
        "por_origen": {origen: _resumir(grupo) for origen, grupo in por_origen.items()},
        "resultados": resultados,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifiesto", type=Path)
    args = parser.parse_args()
    try:
        informe = evaluar_muestras(args.manifiesto)
    except (OSError, ValueError) as error:
        parser.error(str(error))
    print(json.dumps(informe, ensure_ascii=True, indent=2))
    return 0 if informe["global"]["evaluadas"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
