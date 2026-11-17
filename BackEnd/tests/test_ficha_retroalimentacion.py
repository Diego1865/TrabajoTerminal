from io import BytesIO
import unittest

from pypdf import PdfReader

from Servicios.ficha_retroalimentacion import generar_ficha_pdf
from Servicios.retroalimentacion import crear_recomendacion


class FichaPdfTests(unittest.TestCase):
    def test_cuatro_fichas_completas_sin_enlaces_ni_notas(self):
        recomendaciones = [crear_recomendacion(None, 3, semilla=n) for n in range(3)]
        recomendaciones.append(crear_recomendacion(3, None))
        for r in recomendaciones:
            with self.subTest(tipo=r['actividad']):
                reader = PdfReader(BytesIO(generar_ficha_pdf(r)))
                self.assertEqual(len(reader.pages), 1)
                texto = reader.pages[0].extract_text()
                self.assertIn(r['titulo'], texto)
                self.assertIn('Materiales:', texto)
                self.assertIn('Para terminar:', texto)
                self.assertNotIn('http', texto)
                self.assertNotIn('3.00/10', texto)
                self.assertNotIn('/Annots', reader.pages[0])

    def test_planas_con_acentos_y_modelo_largo(self):
        contenido = {'evaluacion': {'respuestas_aceptadas': ['Árbol pingüino niño canción ' + 'a' * 70]}}
        r = crear_recomendacion(3, None, contenido)
        pdf = PdfReader(BytesIO(generar_ficha_pdf(r)))
        texto = ''.join(p.extract_text() for p in pdf.pages)
        for palabra in ('Árbol', 'pingüino', 'niño', 'canción'):
            self.assertIn(palabra, texto)
        self.assertIn('Mi oración:', texto)
        self.assertLessEqual(len(pdf.pages), 2)


if __name__ == '__main__':
    unittest.main()
