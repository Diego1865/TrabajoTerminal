"""Genera las migraciones del catálogo a partir de catalogo_ejercicios.json.

Uso (desde BackEnd/):  python BD/catalogo/generar_migracion.py
El JSON es la fuente: si cambias el catálogo, vuelve a generar y no edites el .sql a mano.
Cada ejercicio pertenece a un lote ("lote", 1 si no lo indica) y cada lote tiene su migración:
una base que ya aplicó la 005 no la vuelve a correr, así que los ejercicios nuevos van en un
lote nuevo con su propia migración. No cambies un lote ya publicado; agrega uno.
Las imágenes son SVG con emojis numerados, en base64 porque Ejercicios.contenido_base es VARCHAR
y un emoji sin codificar se guardaría como '?'.
"""
import base64
import json
from pathlib import Path
from xml.sax.saxutils import escape

CARPETA = Path(__file__).resolve().parent
CATALOGO = CARPETA / "catalogo_ejercicios.json"
LOTE_TARJETAS = 3
MIGRACIONES = {
    1: CARPETA.parent / "migraciones" / "005_catalogo_ejercicios.sql",
    2: CARPETA.parent / "migraciones" / "006_catalogo_ampliacion.sql",
    LOTE_TARJETAS: CARPETA.parent / "migraciones" / "009_ruta_lectoescritura.sql",
}

METODOS = ("sintetico", "analitico", "eclectico")
ERRORES = ("grafias_dudosas", "inversion", "omision_adicion", "tildes", "trazo", "integracion")
MODOS = ("copia", "completar", "imagen")
TIPOS = ("Legibilidad", "Ortografía")


def cargar_catalogo():
    return json.loads(CATALOGO.read_text(encoding="utf-8"))


def imagen_emojis(emojis, etiquetas=None):
    ancho = 130
    celdas = []
    for i, emoji in enumerate(emojis):
        x = ancho * i + ancho // 2
        if etiquetas is not None:
            celdas.append(f'<rect x="{ancho * i + 3}" y="3" width="124" height="150" rx="14" '
                          'fill="#FFFBEB" stroke="#D97706" stroke-width="2"/>')
        celdas.append(f'<text x="{x}" y="88" font-size="72" text-anchor="middle">{escape(emoji)}</text>')
        texto = escape(etiquetas[i]) if etiquetas is not None else i + 1
        tamano = 20 if etiquetas is not None else 28
        color = "#292524" if etiquetas is not None else "#6D28D9"
        celdas.append(f'<text x="{x}" y="138" font-size="{tamano}" font-weight="700" '
                      f'text-anchor="middle" fill="{color}">{texto}</text>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{ancho * len(emojis)}" height="156" '
           f'viewBox="0 0 {ancho * len(emojis)} 156" font-family="Apple Color Emoji,Segoe UI Emoji,'
           f'Noto Color Emoji,Nunito,sans-serif">{"".join(celdas)}</svg>')
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")


def contenido_base(ejercicio, orden, *, mostrar_etiquetas=True):
    emojis = ejercicio.get("emojis")
    etiquetas = ejercicio["respuestas"][0].split() if emojis and mostrar_etiquetas else None
    if etiquetas is not None and len(etiquetas) != len(emojis):
        raise ValueError(f"{ejercicio['titulo']}: cada dibujo necesita una palabra de referencia")
    contenido = {
        "texto_guia": ejercicio.get("texto_guia"),
        "imagen_guia": imagen_emojis(emojis, etiquetas) if emojis else None,
        "imagen_en_lienzo": False,
        "evaluacion": {"modo": ejercicio["modo"], "respuestas_aceptadas": ejercicio["respuestas"]},
        "pedagogia": {**ejercicio["pedagogia"], "orden": orden},
    }
    if etiquetas is not None:
        contenido["tarjetas_imagen"] = [
            {"dibujo": emoji, "palabra": palabra} for emoji, palabra in zip(emojis, etiquetas)
        ]
    return contenido


def sql_texto(valor):
    return "'" + valor.replace("'", "''") + "'"


def lote(ejercicio):
    return ejercicio.get("lote", 1)


def _inserciones(catalogo, numero_lote):
    # orden es global (posición en el JSON) para que la ruta siga numerada al sumar lotes.
    partes = []
    for orden, ejercicio in enumerate(catalogo, start=1):
        if lote(ejercicio) != numero_lote:
            continue
        base = contenido_base(ejercicio, orden, mostrar_etiquetas=numero_lote >= LOTE_TARJETAS)
        contenido = json.dumps(base, ensure_ascii="tarjetas_imagen" in base, separators=(",", ":"))
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
    return partes


def generar_sql(catalogo, numero_lote=1):
    if numero_lote != 1:
        return generar_sql_ampliacion(catalogo, numero_lote)
    catalogo_lote = [e for e in catalogo if lote(e) == 1]
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
        ",\n".join(f"    ({sql_texto(e['titulo'])})" for e in catalogo_lote) + ";",
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
    return "\n".join(partes + _inserciones(catalogo, 1)) + "\n"


def generar_sql_ampliacion(catalogo, numero_lote):
    """Los lotes posteriores agregan ejercicios sin desactivar los existentes."""
    partes = [
        "-- GENERADO por BD/catalogo/generar_migracion.py a partir de catalogo_ejercicios.json; no editar a mano.",
        f"-- Ampliación del catálogo (lote {numero_lote}): solo inserta ejercicios nuevos, no desactiva los existentes."
        if numero_lote != LOTE_TARJETAS else
        f"-- Ampliación del catálogo (lote {numero_lote}) y etiquetas en las imágenes existentes.",
        "-- Los tutores deben activarlos para que sus alumnos los vean.",
        "USE TT;",
        "GO",
    ]
    if numero_lote == LOTE_TARJETAS:
        partes.extend(_actualizar_tarjetas(catalogo))
    return "\n".join(partes + _inserciones(catalogo, numero_lote)) + "\n"


def _actualizar_tarjetas(catalogo):
    partes = []
    for orden, ejercicio in enumerate(catalogo, start=1):
        if lote(ejercicio) >= LOTE_TARJETAS or not ejercicio.get("emojis"):
            continue
        base = contenido_base(ejercicio, orden)
        tarjetas = json.dumps(base["tarjetas_imagen"], ensure_ascii=True, separators=(",", ":"))
        partes += [
            "",
            "UPDATE dbo.Ejercicios",
            "SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',",
            f"    {sql_texto(base['imagen_guia'])}), '$.tarjetas_imagen', JSON_QUERY({sql_texto(tarjetas)})),",
            "    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'",
            f"WHERE titulo = {sql_texto(ejercicio['titulo'])} AND id_tutor_creador IS NULL",
            "  AND ISJSON(contenido_base) = 1;",
        ]
    partes.append("GO")
    return partes


def main():
    catalogo = cargar_catalogo()
    lotes = {lote(e) for e in catalogo}
    faltan = lotes - MIGRACIONES.keys()
    if faltan:
        raise SystemExit(f"Agrega a MIGRACIONES el archivo de los lotes {sorted(faltan)}.")
    for numero_lote in sorted(lotes):
        destino = MIGRACIONES[numero_lote]
        destino.write_text(generar_sql(catalogo, numero_lote), encoding="utf-8")
        print(f"Escrito {destino}")


if __name__ == "__main__":
    main()
