import unittest
from datetime import date, datetime
from Servicios.progreso import resumir_progreso, calcular_racha

HOY = date(2026, 10, 20)


def intento(dia, puntaje=None, tipo="Ortografía", titulo="Ejercicio"):
    return {"fecha": datetime(2026, 10, dia, 9, 0), "titulo": titulo, "tipo": tipo, "puntaje": puntaje}


class ProgresoTests(unittest.TestCase):
    def test_sin_intentos(self):
        r = resumir_progreso([], HOY)
        self.assertEqual(r["total_intentos"], 0)
        self.assertIsNone(r["promedio_general"])
        self.assertEqual(r["historial_reciente"], [])

    def test_sin_calificar_queda_pendiente(self):
        r = resumir_progreso([intento(20), intento(19)], HOY)
        self.assertEqual((r["total_intentos"], r["calificados"]), (2, 0))
        self.assertIsNone(r["promedio_general"])
        self.assertIsNone(r["mejor_puntuacion"])
        self.assertTrue(all(h["puntuacion"] is None for h in r["historial_reciente"]))

    def test_promedio_solo_confirmados_y_por_tipo(self):
        r = resumir_progreso([intento(18, 8), intento(19, 6, "Legibilidad"), intento(20)], HOY)
        self.assertEqual(r["promedio_general"], 7.0)
        self.assertEqual(r["mejor_puntuacion"], 8.0)
        self.assertEqual(r["intentos_por_tipo"]["Ortografía"], {"promedio": 8.0, "total": 2})
        self.assertEqual(r["intentos_por_tipo"]["Legibilidad"], {"promedio": 6.0, "total": 1})
        self.assertEqual(r["historial_reciente"][0]["fecha"].day, 20)

    def test_historial_maximo_8(self):
        self.assertEqual(len(resumir_progreso([intento(d) for d in range(1, 13)], HOY)["historial_reciente"]), 8)

    def test_racha(self):
        f = lambda *dias: [datetime(2026, 10, d) for d in dias]
        self.assertEqual(calcular_racha(f(20, 19, 19, 18), HOY), 3)
        self.assertEqual(calcular_racha(f(20, 18), HOY), 1)
        self.assertEqual(calcular_racha(f(19, 18), HOY), 2)
        self.assertEqual(calcular_racha(f(17), HOY), 0)


if __name__ == "__main__":
    unittest.main()
