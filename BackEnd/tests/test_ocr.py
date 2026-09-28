import base64
import io
import os
import unittest
from unittest.mock import patch

from PIL import Image
from google.cloud import vision
from google.auth.exceptions import DefaultCredentialsError
from google.api_core.exceptions import DeadlineExceeded
from Servicios.ocr import OcrError, preparar_imagen, reconocer_escritura
from Modelo.dao_alumno import registrar_intento_dao


def imagen_prueba():
    imagen = Image.new("RGBA", (20, 10), (0, 0, 0, 0))
    imagen.putpixel((2, 3), (0, 0, 0, 255))
    salida = io.BytesIO()
    imagen.save(salida, format="PNG")
    return "data:image/png;base64," + base64.b64encode(salida.getvalue()).decode()


class ImagenTests(unittest.TestCase):
    def test_transparencia_blanca_y_trazo_conservado(self):
        resultado = Image.open(io.BytesIO(preparar_imagen(imagen_prueba())))
        self.assertEqual(resultado.size, (20, 10))
        self.assertEqual(resultado.getpixel((0, 0)), (255, 255, 255))
        self.assertEqual(resultado.getpixel((2, 3)), (0, 0, 0))

    def test_rechaza_datos_invalidos(self):
        for valor in ("https://ejemplo.com/a.png", "data:image/png;base64,!!",
                      "data:image/png;base64,aG9sYQ=="):
            with self.subTest(valor=valor), self.assertRaises(OcrError) as error:
                preparar_imagen(valor)
            self.assertEqual(error.exception.status_code, 422)

    @patch("Servicios.ocr.MAX_PIXELS", 10)
    def test_limite_pixeles(self):
        with self.assertRaises(OcrError) as error:
            preparar_imagen(imagen_prueba())
        self.assertEqual(error.exception.status_code, 413)


@patch.dict(os.environ, {"GOOGLE_VISION_ENABLED": "true"})
class GoogleTests(unittest.TestCase):
    @patch("google.cloud.vision.ImageAnnotatorClient")
    def test_conserva_simbolos_coordenadas_y_confianza(self, cliente):
        cliente.return_value.document_text_detection.return_value = vision.AnnotateImageResponse(
            full_text_annotation=vision.TextAnnotation(text="ñ", pages=[{
                "width": 20, "height": 10, "blocks": [{"paragraphs": [{"words": [{
                    "symbols": [{"text": "ñ", "confidence": 0.9,
                                 "bounding_box": {"vertices": [{"x": 0, "y": 0},
                                     {"x": 5, "y": 0}, {"x": 5, "y": 8}, {"x": 0, "y": 8}]}}]
                }]}]}]
            }]))
        resultado = reconocer_escritura(imagen_prueba())
        self.assertEqual(resultado["texto"], "ñ")
        simbolo = resultado["full_text_annotation"]["pages"][0]["blocks"][0]["paragraphs"][0]["words"][0]["symbols"][0]
        self.assertEqual(simbolo["bounding_box"]["vertices"][0], {"x": 0, "y": 0})
        self.assertAlmostEqual(simbolo["confidence"], 0.9, places=5)
        self.assertEqual(cliente.return_value.document_text_detection.call_args.kwargs["timeout"], 30)
        cliente.return_value.transport.close.assert_called_once()

    @patch("google.cloud.vision.ImageAnnotatorClient")
    def test_sin_texto(self, cliente):
        cliente.return_value.document_text_detection.return_value = vision.AnnotateImageResponse()
        self.assertEqual(reconocer_escritura(imagen_prueba())["estado"], "sin_texto")

    @patch("google.cloud.vision.ImageAnnotatorClient")
    def test_errores_controlados(self, cliente):
        cliente.side_effect = DefaultCredentialsError("secreto")
        with self.assertRaises(OcrError) as error:
            reconocer_escritura(imagen_prueba())
        self.assertNotIn("secreto", str(error.exception))
        cliente.side_effect = None
        cliente.return_value.document_text_detection.side_effect = DeadlineExceeded("timeout")
        with self.assertRaises(OcrError) as error:
            reconocer_escritura(imagen_prueba())
        self.assertEqual(error.exception.status_code, 503)

    @patch.dict(os.environ, {"GOOGLE_VISION_ENABLED": "false"})
    @patch("google.cloud.vision.ImageAnnotatorClient")
    def test_desactivado_no_llama_google(self, cliente):
        self.assertEqual(reconocer_escritura(imagen_prueba())["estado"], "desactivado")
        cliente.assert_not_called()


class PersistenciaTests(unittest.TestCase):
    @patch("Modelo.dao_alumno.reconocer_escritura")
    @patch("Modelo.dao_alumno.connect_to_database")
    def test_guarda_texto_y_json_en_misma_transaccion(self, conectar, reconocer):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.side_effect = [(3,), (1,)]
        reconocer.return_value = {"texto": "niño", "estado": "procesado"}
        self.assertEqual(registrar_intento_dao(4, "imagen", 5)["texto"], "niño")
        valores = cursor.execute.call_args.args[1]
        self.assertEqual(valores[3], "niño")
        self.assertIn("niño", valores[4])
        conectar.return_value.commit.assert_called_once()

    @patch("Modelo.dao_alumno.reconocer_escritura")
    @patch("Modelo.dao_alumno.connect_to_database")
    def test_no_invoca_google_para_ejercicio_ajeno(self, conectar, reconocer):
        conectar.return_value.cursor.return_value.fetchone.side_effect = [(3,), None]
        with self.assertRaises(ValueError):
            registrar_intento_dao(4, "imagen", 5)
        reconocer.assert_not_called()
        conectar.return_value.commit.assert_not_called()

    @patch("Modelo.dao_alumno.reconocer_escritura", side_effect=OcrError("No disponible"))
    @patch("Modelo.dao_alumno.connect_to_database")
    def test_fallo_ocr_no_inserta_intento(self, conectar, reconocer):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.side_effect = [(3,), (1,)]
        with self.assertRaises(OcrError):
            registrar_intento_dao(4, "imagen", 5)
        self.assertEqual(cursor.execute.call_count, 2)
        conectar.return_value.rollback.assert_called_once()
        conectar.return_value.commit.assert_not_called()


if __name__ == "__main__":
    unittest.main()
