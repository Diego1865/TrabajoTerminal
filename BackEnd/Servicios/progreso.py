"""Resumen del progreso del alumno a partir de sus intentos.

Solo cuenta el CLS confirmado por el tutor (escala 0-10); los intentos sin
confirmar aparecen como pendientes y no afectan los promedios.
"""
from datetime import date, datetime, timedelta


def _dia(fecha):
    return fecha.date() if isinstance(fecha, datetime) else fecha


def _promedio(valores):
    return round(sum(valores) / len(valores), 2) if valores else None


def calcular_racha(fechas, hoy):
    """Días seguidos con al menos un intento, terminando hoy o ayer."""
    dias = {_dia(f) for f in fechas}
    actual = hoy if hoy in dias else hoy - timedelta(days=1)
    racha = 0
    while actual in dias:
        racha += 1
        actual -= timedelta(days=1)
    return racha


def resumir_progreso(filas, hoy=None):
    """filas: [{fecha, titulo, tipo, puntaje}] con puntaje 0-10 o None."""
    hoy = hoy or date.today()
    filas = sorted(filas, key=lambda f: f["fecha"], reverse=True)
    confirmados = [float(f["puntaje"]) for f in filas if f["puntaje"] is not None]

    por_tipo = {}
    for f in filas:
        grupo = por_tipo.setdefault(f["tipo"], {"puntajes": [], "total": 0})
        grupo["total"] += 1
        if f["puntaje"] is not None:
            grupo["puntajes"].append(float(f["puntaje"]))

    return {
        "total_intentos": len(filas),
        "calificados": len(confirmados),
        "promedio_general": _promedio(confirmados),
        "mejor_puntuacion": max(confirmados) if confirmados else None,
        "racha_actual": calcular_racha([f["fecha"] for f in filas], hoy),
        "intentos_por_tipo": {tipo: {"promedio": _promedio(g["puntajes"]), "total": g["total"]}
                              for tipo, g in por_tipo.items()},
        "historial_reciente": [
            {"fecha": f["fecha"], "titulo": f["titulo"], "tipo": f["tipo"],
             "puntuacion": None if f["puntaje"] is None else float(f["puntaje"])}
            for f in filas[:8]
        ],
    }
