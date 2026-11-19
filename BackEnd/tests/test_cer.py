import json
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from evaluar_cer import distancia_edicion, evaluar_muestras, normalizar


class CerTests(unittest.TestCase):
    def test_conserva_mayusculas_acentos_y_puntuacion(self):
        self.assertEqual(normalizar("  Nin\u0303o\n\tÁrbol. "), "Niño Árbol.")
        self.assertEqual(distancia_edicion("Niño Árbol.", "niño Arbol"), 3)

    def test_cer_global_ponderado_y_fallos_por_separado(self):
        muestras = [
            {"id": "1", "origen": "lienzo", "referencia": "Niño", "ocr": "Niño"},
            {"id": "2", "origen": "foto", "referencia": "Árbol", "ocr": ""},
            {"id": "3", "origen": "foto", "referencia": "Casa", "imagen": "no-existe.png"},
        ]
        with TemporaryDirectory() as carpeta:
            archivo = Path(carpeta) / "muestras.jsonl"
            archivo.write_text("\n".join(map(json.dumps, muestras)), encoding="utf-8")
            informe = evaluar_muestras(archivo)

        self.assertEqual(informe["global"], {
            "muestras": 3, "evaluadas": 2, "sin_texto": 1, "fallos": 1,
            "caracteres_referencia": 9, "ediciones": 5, "cer_porcentaje": 55.5556,
        })
        self.assertEqual(informe["por_origen"]["lienzo"]["cer_porcentaje"], 0.0)
        self.assertEqual(informe["por_origen"]["foto"]["cer_porcentaje"], 100.0)
