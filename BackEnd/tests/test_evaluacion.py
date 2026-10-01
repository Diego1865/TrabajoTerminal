import unittest
from Servicios.evaluacion import evaluar


class EvaluacionTests(unittest.TestCase):
    def comparar(self, esperado, texto, modo="copia"):
        return evaluar({"evaluacion": {"modo": modo, "respuestas_aceptadas": [esperado]}},
                       {"estado": "procesado", "texto": texto})

    def test_espacios_y_unicode(self):
        self.assertEqual(self.comparar("El pájaro", "El\npa\u0301jaro")["observaciones"], [])

    def test_no_inventa_respuesta_de_huecos(self):
        self.assertEqual(evaluar({"texto_guia": "El _apatero"}, {"texto": "El zapatero"})["estado"], "no_configurada")

    def test_completar_oracion(self):
        self.assertEqual(self.comparar("El zapatero hace zapatos con cintas de seda.",
            "El zapatero hace zapatos con cintas de seda.", "completar")["observaciones"], [])

    def test_letras_sueltas_no_equivalen_a_oracion(self):
        self.assertTrue(self.comparar("El zapatero hace zapatos.", "z z s", "completar")["observaciones"])

    def test_acentos_y_enie(self):
        diferencias = self.comparar("El pájaro y el niño", "El pajaro y el nino")["observaciones"]
        self.assertEqual([d["tipo"] for d in diferencias], ["acentuacion", "sustitucion"])

    def test_omisiones_y_adiciones(self):
        self.assertEqual(self.comparar("El gato negro", "El gato")["observaciones"][0]["tipo"], "omision")
        self.assertEqual(self.comparar("El gato", "El gato negro")["observaciones"][0]["tipo"], "adicion")

    def test_mayusculas_y_puntuacion(self):
        diferencias = self.comparar("Hola.", "hola!")["observaciones"]
        self.assertEqual([d["tipo"] for d in diferencias], ["mayusculas", "puntuacion"])

    def test_sin_ocr_no_penaliza(self):
        r = evaluar({"evaluacion": {"modo": "copia", "respuestas_aceptadas": ["hola"]}}, {"estado": "sin_texto", "texto": ""})
        self.assertEqual(r["estado"], "sin_texto")
        self.assertEqual(r["observaciones"], [])
        self.assertNotIn("puntuacion", r)

    def test_alternativas_aceptadas(self):
        r = evaluar({"evaluacion": {"modo": "completar", "respuestas_aceptadas": ["zapato", "zapatos"]}},
                    {"estado": "procesado", "texto": "zapatos"})
        self.assertEqual(r["observaciones"], [])

    def test_confianza_no_es_nota(self):
        r = self.comparar("hola", "hola")
        self.assertTrue(r["requiere_revision"])
        self.assertNotIn("puntuacion", r)


if __name__ == "__main__":
    unittest.main()
