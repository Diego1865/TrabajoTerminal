import io
import math
import unittest

from PIL import Image, ImageDraw

from Servicios.legibilidad import medir_legibilidad


def letra(texto, x0, y0, x1, y1):
    return {"text": texto, "bounding_box": {"vertices": [
        {"x": x0, "y": y0}, {"x": x1, "y": y0}, {"x": x1, "y": y1}, {"x": x0, "y": y1}]}}


def palabra(texto, x, base, alturas=40, ancho=24, separacion=4, bases=None):
    """Palabra con letras que se apoyan en `base` (o en bases[i]) y miden `alturas` (o alturas[i])."""
    simbolos = []
    for i, c in enumerate(texto):
        h = alturas[i] if isinstance(alturas, list) else alturas
        b = bases[i] if bases else base
        simbolos.append(letra(c, x, b - h, x + ancho, b))
        x += ancho + separacion
    return {"symbols": simbolos}, x


def anotacion(*renglones, huecos=None):
    """renglones: lista de (base_y, [palabras]); huecos: separación entre palabras (fija o lista)."""
    palabras = []
    for base, textos in renglones:
        x = 10
        for i, t in enumerate(textos):
            p, x = palabra(t, x, base)
            palabras.append(p)
            x += (huecos[i] if isinstance(huecos, list) and i < len(huecos) else (huecos if isinstance(huecos, int) else 30))
    return {"pages": [{"blocks": [{"paragraphs": [{"words": palabras}]}]}]}


class LegibilidadTests(unittest.TestCase):
    def test_letra_pareja_da_puntajes_altos(self):
        r = medir_legibilidad(anotacion((100, ["mi", "casa", "es", "azul"])))
        self.assertEqual((r["tamano"], r["alineacion"], r["espaciado"]), (10.0, 10.0, 10.0))
        self.assertIsNone(r["inclinacion"])  # sin imagen no se mide
        self.assertEqual(r["puntaje_sugerido"], 10.0)

    def test_tamano_disparejo(self):
        p, _ = palabra("casa", 10, 100, alturas=[20, 60, 30, 70])
        r = medir_legibilidad({"pages": [{"blocks": [{"paragraphs": [{"words": [p]}]}]}]})
        self.assertLess(r["tamano"], 3)

    def test_letras_altas_y_colas_no_castigan_tamano(self):
        # 'l' alta y 'g' baja son normales: solo cuentan las letras "chiquitas".
        p, _ = palabra("lago", 10, 100, alturas=[70, 40, 60, 40])
        r = medir_legibilidad({"pages": [{"blocks": [{"paragraphs": [{"words": [p]}]}]}]})
        self.assertIsNone(r["tamano"])  # solo hay 2 letras chiquitas: no alcanza
        p, _ = palabra("lamosa", 10, 100, alturas=[70, 40, 41, 39, 40, 40])
        r = medir_legibilidad({"pages": [{"blocks": [{"paragraphs": [{"words": [p]}]}]}]})
        self.assertEqual(r["tamano"], 10.0)

    def test_renglon_en_zigzag(self):
        p, _ = palabra("mamamama", 10, 100, bases=[100, 120, 95, 125, 100, 118, 92, 124])
        r = medir_legibilidad({"pages": [{"blocks": [{"paragraphs": [{"words": [p]}]}]}]})
        self.assertLess(r["alineacion"], 5)

    def test_renglon_inclinado_pero_recto_no_se_castiga(self):
        p, _ = palabra("mamamama", 10, 100, bases=[100 + 6 * i for i in range(8)])
        r = medir_legibilidad({"pages": [{"blocks": [{"paragraphs": [{"words": [p]}]}]}]})
        self.assertEqual(r["alineacion"], 10.0)

    def test_espacios_irregulares(self):
        r = medir_legibilidad(anotacion((100, ["mi", "casa", "es", "azul", "y"]), huecos=[5, 90, 10, 70]))
        self.assertLess(r["espaciado"], 4)

    def test_dos_renglones_se_separan(self):
        r = medir_legibilidad(anotacion((100, ["mi", "casa"]), (200, ["es", "azul"])))
        self.assertEqual(r["detalle"]["renglones"], 2)
        self.assertEqual(r["alineacion"], 10.0)

    def test_sin_letras(self):
        self.assertIsNone(medir_legibilidad({"pages": []}))
        self.assertIsNone(medir_legibilidad(None))

    def _imagen_con_trazos(self, grados):
        imagen = Image.new("RGB", (400, 120), "white")
        dibujo = ImageDraw.Draw(imagen)
        simbolos = []
        for i in range(5):
            x_base = 40 + i * 70
            dx = math.tan(math.radians(grados)) * 60
            dibujo.line([(x_base, 90), (x_base + dx, 30)], fill="black", width=5)
            simbolos.append(letra("l", int(min(x_base, x_base + dx)) - 4, 26, int(max(x_base, x_base + dx)) + 4, 94))
        salida = io.BytesIO()
        imagen.save(salida, format="PNG")
        return {"pages": [{"blocks": [{"paragraphs": [{"words": [{"symbols": simbolos}]}]}]}]}, salida.getvalue()

    def test_inclinacion(self):
        derecha = medir_legibilidad(*self._imagen_con_trazos(0))
        ladeada = medir_legibilidad(*self._imagen_con_trazos(30))
        self.assertEqual(derecha["inclinacion"], 10.0)
        self.assertAlmostEqual(ladeada["detalle"]["inclinacion_grados"], 30, delta=4)
        self.assertLess(ladeada["inclinacion"], 5)


if __name__ == "__main__":
    unittest.main()
