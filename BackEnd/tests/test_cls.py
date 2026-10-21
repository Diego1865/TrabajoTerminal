import unittest
from Servicios.cls import calcular_cls


def cls(esperado, escrito):
    r = calcular_cls(esperado, escrito)
    return r["correctas"], r["posibles"]


class ClsTests(unittest.TestCase):
    def test_palabra_correcta(self):
        self.assertEqual(cls("casa", "casa"), (5, 5))

    def test_sustitucion(self):
        self.assertEqual(cls("casa", "caza"), (3, 5))

    def test_mayuscula_cuenta(self):
        self.assertEqual(cls("casa", "Casa"), (3, 5))

    def test_acento_cuenta(self):
        self.assertEqual(cls("canción", "cancion"), (6, 8))

    def test_enie_cuenta(self):
        self.assertEqual(cls("año", "ano"), (2, 4))

    def test_letra_omitida_credito_parcial(self):
        self.assertEqual(cls("perro", "pero"), (5, 6))

    def test_oracion_con_palabra_omitida(self):
        r = calcular_cls("El perro come carne", "El pero come")
        self.assertEqual((r["correctas"], r["posibles"]), (13, 20))
        self.assertEqual(r["puntaje_sugerido"], 6.5)
        self.assertEqual(r["por_palabra"][-1], {"esperada": "carne", "escrita": "", "correctas": 0, "posibles": 6})

    def test_palabra_de_mas_no_resta(self):
        self.assertEqual(cls("El perro come", "El perro grande come"), (14, 14))

    def test_puntuacion_ignorada(self):
        self.assertEqual(cls("El gato.", "El gato"), (8, 8))

    def test_unicode_equivalente(self):
        self.assertEqual(cls("canción", "canción"), (8, 8))

    def test_texto_vacio(self):
        r = calcular_cls("hola", "")
        self.assertEqual((r["correctas"], r["posibles"], r["puntaje_sugerido"]), (0, 5, 0.0))

    def test_sin_referencia(self):
        self.assertIsNone(calcular_cls("", "hola")["puntaje_sugerido"])


if __name__ == "__main__":
    unittest.main()
