"""Respuesta de descarga compartida por las rutas autenticadas de alumno y tutor."""
import base64

from fastapi import HTTPException, Response
from pydantic import BaseModel

from Modelo.dao_retroalimentacion import (
    actualizar_practica_dao, obtener_practica_tutor_dao, obtener_recomendacion_intento_dao,
)
from Servicios.ficha_retroalimentacion import generar_ficha_pdf
from Servicios.ocr import OcrError, preparar_imagen


class EntregaPractica(BaseModel):
    imagen_codificada: str


def cambiar_estado_practica(id_intento, id_recomendacion, id_usuario, rol, imagen=None):
    try:
        if imagen is not None:
            png = preparar_imagen(imagen)
            imagen = "data:image/png;base64," + base64.b64encode(png).decode("ascii")
        return actualizar_practica_dao(id_intento, id_recomendacion, id_usuario, rol, imagen)
    except OcrError as error:
        raise HTTPException(status_code=error.status_code, detail=str(error))
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))
    except Exception:
        raise HTTPException(status_code=500, detail="No se pudo actualizar la práctica. Intenta de nuevo.")


def consultar_practica_tutor(id_intento, id_usuario, incluir_imagen):
    try:
        return obtener_practica_tutor_dao(id_intento, id_usuario, incluir_imagen)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception:
        raise HTTPException(status_code=500, detail="No se pudo consultar la práctica. Intenta de nuevo.")


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
