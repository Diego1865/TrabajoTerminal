"""
Contiene pruebas automaticas de test seguimiento practicas. Verifica el comportamiento esperado y detecta errores.
"""

from datetime import datetime
import json
import unittest
from unittest.mock import MagicMock, patch

from fastapi import HTTPException

from Control.retroalimentacion import cambiar_estado_practica
from Modelo.dao_retroalimentacion import (
    actualizar_practica_dao, guardar_recomendacion, obtener_practica_tutor_dao,
)
from Servicios.retroalimentacion import crear_recomendacion
from test_ocr import imagen_prueba


class SeguimientoPracticasTests(unittest.TestCase):
    @patch("Modelo.dao_retroalimentacion.connect_to_database")
    def test_el_alumno_entrega_y_el_tutor_valida_la_misma_practica(self, conectar):
        conn = conectar.return_value
        cursor = conn.cursor.return_value
        fecha = datetime(2026, 11, 18, 15)
        validada = datetime(2026, 11, 18, 16)
        cursor.fetchone.side_effect = [
            (8,), (17, "sugerida", None, None), (17, "completada", fecha, None),
            (8,), (17, "completada", fecha, None, "imagen"),
            (8,), (17, "completada", fecha, None), (17, "validada", fecha, validada),
            (8,), (17, "validada", fecha, validada),
        ]
        self.assertEqual(actualizar_practica_dao(20, 17, 30, "alumno", "imagen")["estado"], "completada")
        self.assertEqual(obtener_practica_tutor_dao(20, 40, incluir_imagen=True)["imagen_codificada"], "imagen")
        self.assertEqual(actualizar_practica_dao(20, 17, 40, "tutor")["estado"], "validada")
        repetida = actualizar_practica_dao(20, 17, 30, "alumno", "otra imagen")
        self.assertEqual(repetida["fecha_validada"].isoformat(), "2026-11-18T16:00:00+00:00")
        escrituras = [llamada.args[1] for llamada in cursor.execute.call_args_list
                      if "UPDATE Recomendacion" in llamada.args[0]]
        self.assertEqual(escrituras, [("imagen", 17), (8, 17)])

    @patch("Modelo.dao_retroalimentacion.connect_to_database")
    def test_bloquea_intento_ajeno_y_ficha_reemplazada(self, conectar):
        conn = conectar.return_value
        cursor = conn.cursor.return_value
        cursor.fetchone.side_effect = [None, (8,), (18, "sugerida", None, None), (8,), (18, "sugerida", None, None)]
        with self.assertRaises(FileNotFoundError):
            actualizar_practica_dao(20, 17, 90, "alumno", "imagen")
        with self.assertRaisesRegex(ValueError, "recomendación cambió"):
            actualizar_practica_dao(20, 17, 30, "alumno", "imagen")
        with self.assertRaisesRegex(ValueError, "aún no ha entregado"):
            actualizar_practica_dao(20, 18, 40, "tutor")
        self.assertFalse(any("UPDATE Recomendacion" in q.args[0] for q in cursor.execute.call_args_list))
        conn.commit.assert_not_called()

    def test_recalificar_conserva_la_ficha_que_el_alumno_entrego(self):
        recomendacion = crear_recomendacion(4, None)
        cursor = MagicMock()
        cursor.fetchone.return_value = (json.dumps(recomendacion),)
        self.assertEqual(guardar_recomendacion(cursor, 20, 3, {}), recomendacion)
        self.assertFalse(any("DELETE" in q.args[0] for q in cursor.execute.call_args_list))

    @patch("Control.retroalimentacion.actualizar_practica_dao")
    def test_una_imagen_chica_no_se_registra_como_evidencia(self, actualizar):
        with self.assertRaises(HTTPException) as error:
            cambiar_estado_practica(20, 17, 30, "alumno", imagen_prueba((640, 480)))
        self.assertEqual(error.exception.status_code, 422)
        actualizar.assert_not_called()
