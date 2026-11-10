"""Genera migraciones/005_catalogo_ejercicios.sql a partir de catalogo_ejercicios.json.

Uso (desde BackEnd/):  python BD/catalogo/generar_migracion.py
El JSON es la fuente: si cambias el catálogo, vuelve a generar y no edites el .sql a mano.
Las imágenes son SVG con emojis numerados, en base64 porque Ejercicios.contenido_base es VARCHAR
y un emoji sin codificar se guardaría como '?'.
"""
import base64
import json
from pathlib import Path
from xml.sax.saxutils import escape

CARPETA = Path(__file__).resolve().parent
CATALOGO = CARPETA / "catalogo_ejercicios.json"
MIGRACION = CARPETA.parent / "migraciones" / "005_catalogo_ejercicios.sql"

METODOS = ("sintetico", "analitico", "eclectico")
ERRORES = ("grafias_dudosas", "inversion", "omision_adicion", "tildes", "trazo", "integracion")
MODOS = ("copia", "completar", "imagen")
TIPOS = ("Legibilidad", "Ortografía")


def cargar_catalogo():
    return json.loads(CATALOGO.read_text(encoding="utf-8"))


def imagen_emojis(emojis):
    ancho = 130
    celdas = "".join(
        f'<text x="{ancho * i + ancho // 2}" y="88" font-size="72" text-anchor="middle">{escape(e)}</text>'
        f'<text x="{ancho * i + ancho // 2}" y="138" font-size="28" font-weight="700" '
        f'text-anchor="middle" fill="#6D28D9">{i + 1}</text>'
        for i, e in enumerate(emojis))
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{ancho * len(emojis)}" height="156" '
           f'viewBox="0 0 {ancho * len(emojis)} 156" font-family="Apple Color Emoji,Segoe UI Emoji,'
           f'Noto Color Emoji,Nunito,sans-serif">{celdas}</svg>')
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")


def contenido_base(ejercicio, orden):
    emojis = ejercicio.get("emojis")
    return {
        "texto_guia": ejercicio.get("texto_guia"),
        "imagen_guia": imagen_emojis(emojis) if emojis else None,
        "imagen_en_lienzo": False,
        "evaluacion": {"modo": ejercicio["modo"], "respuestas_aceptadas": ejercicio["respuestas"]},
        "pedagogia": {**ejercicio["pedagogia"], "orden": orden},
    }


def sql_texto(valor):
    return "'" + valor.replace("'", "''") + "'"


def generar_sql(catalogo):
    partes = [
        "-- GENERADO por BD/catalogo/generar_migracion.py a partir de catalogo_ejercicios.json; no editar a mano.",
        "-- Catálogo de ejercicios por método (sintético, analítico, ecléctico) y error ortográfico común.",
        "-- Reemplaza el catálogo de ejemplo: se desactiva (no se borra, hay intentos que lo referencian)",
        "-- y se cierran sus asignaciones activas para que los alumnos dejen de verlo.",
        "USE TT;",
        "GO",
        "",
        "DECLARE @nuevos TABLE (titulo VARCHAR(150) PRIMARY KEY);",
        "INSERT INTO @nuevos (titulo) VALUES",
        ",\n".join(f"    ({sql_texto(e['titulo'])})" for e in catalogo) + ";",
        "",
        "UPDATE et SET et.id_estatus = 2, et.fecha_desactivacion = GETDATE()",
        "FROM dbo.Ejercicios_Tutor et JOIN dbo.Ejercicios e ON e.id_ejercicio = et.id_ejercicio",
        "WHERE et.id_estatus = 1 AND e.id_tutor_creador IS NULL AND e.tipo <> 'dictado'",
        "  AND e.titulo NOT IN (SELECT titulo FROM @nuevos);",
        "",
        "UPDATE dbo.Ejercicios SET id_estatus = 2",
        "WHERE id_estatus = 1 AND id_tutor_creador IS NULL AND tipo <> 'dictado'",
        "  AND titulo NOT IN (SELECT titulo FROM @nuevos);",
        "GO",
    ]
    for orden, ejercicio in enumerate(catalogo, start=1):
        contenido = json.dumps(contenido_base(ejercicio, orden), ensure_ascii=False, separators=(",", ":"))
        titulo = sql_texto(ejercicio["titulo"])
        partes += [
            "",
            f"-- {orden}. {ejercicio['titulo']}",
            f"IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = {titulo} AND id_tutor_creador IS NULL)",
            "INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (",
            f"    {titulo},",
            f"    {sql_texto(ejercicio['descripcion'])},",
            f"    {sql_texto(ejercicio['tipo'])},",
            f"    {sql_texto(contenido)},",
            "    1);",
        ]
    partes.append("GO")
    return "\n".join(partes) + "\n"


def main():
    MIGRACION.write_text(generar_sql(cargar_catalogo()), encoding="utf-8")
    print(f"Escrito {MIGRACION}")


if __name__ == "__main__":
    main()
