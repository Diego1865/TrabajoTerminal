"""Respuesta de descarga compartida por las rutas autenticadas de alumno y tutor."""
from fastapi import HTTPException, Response

from Modelo.dao_retroalimentacion import obtener_recomendacion_intento_dao
from Servicios.ficha_retroalimentacion import generar_ficha_pdf


def descargar_ficha(id_intento, id_usuario, rol):
    try:
        recomendacion = obtener_recomendacion_intento_dao(id_intento, id_usuario, rol)
        pdf = generar_ficha_pdf(recomendacion)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception:
        raise HTTPException(status_code=500, detail="No se pudo generar la ficha. Intenta de nuevo.")
    return Response(content=pdf, media_type="application/pdf", headers={
        "Content-Disposition": f'attachment; filename="practica-{id_intento}.pdf"',
        "Cache-Control": "private, no-store",
    })
