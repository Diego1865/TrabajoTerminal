import base64
import importlib.util
import json
import unittest
from pathlib import Path

from Servicios.cls import calcular_cls, cls_palabra
from Servicios.evaluacion import evaluar

BD = Path(__file__).resolve().parents[1] / "BD"
_spec = importlib.util.spec_from_file_location("generar_migracion", BD / "catalogo" / "generar_migracion.py")
generador = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(generador)


class CatalogoTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalogo = generador.cargar_catalogo()

    def test_cada_ejercicio_es_valido(self):
        titulos = set()
        for orden, ejercicio in enumerate(self.catalogo, start=1):
            with self.subTest(ejercicio["titulo"]):
                self.assertLessEqual(len(ejercicio["titulo"]), 150)
                self.assertNotIn(ejercicio["titulo"], titulos)
                titulos.add(ejercicio["titulo"])
                self.assertIn(ejercicio["tipo"], generador.TIPOS)
                self.assertIn(ejercicio["modo"], generador.MODOS)
                self.assertTrue(ejercicio["descripcion"].strip())
                # El alumno necesita un modelo: texto o imagen, nunca ambos vacíos.
                self.assertTrue(ejercicio.get("texto_guia") or ejercicio.get("emojis"))
                self.assertEqual(ejercicio["modo"] == "imagen", bool(ejercicio.get("emojis")))
                p = ejercicio["pedagogia"]
                self.assertIn(p["metodo"], generador.METODOS)
                self.assertIn(p["error_objetivo"], generador.ERRORES)
                self.assertIn(p["nivel"], (1, 2, 3))
                for campo in ("habilidad", "estrategia", "pista"):
                    self.assertTrue(p[campo].strip())
                contenido = generador.contenido_base(ejercicio, orden)
                self.assertEqual(contenido["pedagogia"]["orden"], orden)
                for respuesta in ejercicio["respuestas"]:
                    cls = calcular_cls(respuesta, respuesta)
                    self.assertGreater(cls["posibles"], 0)
                    self.assertEqual(cls["correctas"], cls["posibles"])
                resultado = evaluar(contenido, {"estado": "procesado", "texto": ejercicio["respuestas"][0]})
                self.assertEqual(resultado["estado"], "preliminar")
                self.assertEqual(resultado["observaciones"], [])

    def test_cubre_metodos_y_errores_de_la_tabla(self):
        metodos = {e["pedagogia"]["metodo"] for e in self.catalogo}
        errores = {e["pedagogia"]["error_objetivo"] for e in self.catalogo}
        self.assertEqual(metodos, set(generador.METODOS))
        self.assertEqual(errores, set(generador.ERRORES))

    def test_imagen_svg_en_base64_ascii(self):
        imagen = generador.imagen_emojis(["🐄", "☁️"])
        self.assertTrue(imagen.startswith("data:image/svg+xml;base64,"))
        imagen.encode("ascii")  # Cabe en VARCHAR sin perder caracteres.
        svg = base64.b64decode(imagen.split(",", 1)[1]).decode("utf-8")
        self.assertIn("🐄", svg)
        self.assertIn(">2</text>", svg)

    def test_migracion_generada_esta_al_dia(self):
        actual = (BD / "migraciones" / "005_catalogo_ejercicios.sql").read_text(encoding="utf-8")
        self.assertEqual(actual, generador.generar_sql(self.catalogo),
                         "Vuelve a correr BD/catalogo/generar_migracion.py")
        self.assertIn("UPDATE dbo.Ejercicios SET id_estatus = 2", actual)
        self.assertEqual(actual.count("INSERT INTO dbo.Ejercicios "), len(self.catalogo))
        # Todo el contenido_base es JSON válido dentro de la migración.
        self.assertTrue(all(json.dumps(generador.contenido_base(e, 1), ensure_ascii=False)
                            for e in self.catalogo))

    def test_cls_castiga_los_errores_objetivo(self):
        self.assertEqual(cls_palabra("plato", "pato"), 4)    # omisión: 4 de 6
        self.assertLess(cls_palabra("bebé", "debé"), 5)      # inversión b/d
        self.assertLess(cls_palabra("ratón", "raton"), 6)    # tilde omitida
        self.assertLess(cls_palabra("vaca", "baca"), 5)      # grafía dudosa
        self.assertEqual(evaluar({"evaluacion": {"modo": "imagen", "respuestas_aceptadas": ["vaca"]}},
                                 {"estado": "procesado", "texto": "baca"})["cls"]["correctas"], 3)


if __name__ == "__main__":
    unittest.main()
