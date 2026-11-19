import json
import unittest
from datetime import datetime
from decimal import Decimal
from unittest.mock import MagicMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from Control import alumno, tutor
from Control.dependencies import get_current_user
from Modelo import dao_tutor
from Modelo.dao_retroalimentacion import guardar_recomendacion, obtener_retroalimentacion_alumno_dao, obtener_recomendacion_intento_dao
from Modelo.schemas_tutor import IntentoTutorResponse
from Servicios.retroalimentacion import crear_recomendacion, adaptar_recomendacion, crear_laberinto


class SeleccionTests(unittest.TestCase):
    def test_sin_datos_y_promedios_suficientes_no_recomienda(self):
        for notas in [(None, None), (6, 6), (10, None), (None, 8), (9, 7)]:
            with self.subTest(notas=notas):
                self.assertIsNone(crear_recomendacion(*notas))

    def test_umbral_estricto_cero_y_decimales(self):
        for nota in (0, Decimal('5.99')):
            with self.subTest(nota=nota):
                self.assertEqual(crear_recomendacion(None, nota)['area'], 'legibilidad')
                self.assertEqual(crear_recomendacion(nota, None)['area'], 'ortografia')

    def test_una_actividad_para_el_area_de_menor_promedio(self):
        for notas, area in [((4, 5), 'ortografia'), ((5, 4), 'legibilidad'), ((4, 4), 'legibilidad')]:
            r = crear_recomendacion(*notas)
            self.assertEqual(r['area'], area)
            self.assertTrue(r['opcional'])
            self.assertIn('menor a 6/10', r['motivo'])
            self.assertNotIn('recurso', r)
            self.assertTrue(r['materiales'])
            self.assertTrue(r['ficha'])
            self.assertNotIn('id_ejercicio', r)

    def test_planas_usan_modelo_no_errores_del_ocr(self):
        contenido = {'evaluacion': {'respuestas_aceptadas': ['El niño mira el árbol y el jardín.']}}
        r = crear_recomendacion(3, 9, contenido)
        self.assertEqual(r['texto_practica'], 'El\nniño\nmira\nárbol\ny')
        self.assertNotIn('error', ' '.join(r['pasos']))

    def test_modelo_generico_si_no_hay_referencia(self):
        for contenido in (None, {}, [], {'evaluacion': {}}):
            self.assertIn('árbol', crear_recomendacion(2, None, contenido)['texto_practica'])

    def test_actividades_de_motricidad_y_planas_sin_enlaces(self):
        actividades = [crear_recomendacion(9, 3, semilla=n) for n in range(3)]
        self.assertEqual([r['actividad'] for r in actividades], ['laberinto', 'bolitas', 'tiras'])
        for r in actividades + [crear_recomendacion(3, 9)]:
            self.assertNotIn('http', json.dumps(r))
            self.assertEqual(len(r['pasos']), 4)
            self.assertTrue(r['objetivo'])
            self.assertTrue(r['cierre'])

    def test_adapta_recomendaciones_antiguas_sin_recalificar(self):
        vieja = {'version': 1, 'area': 'legibilidad', 'promedio_al_calificar': 3,
                 'generada_en': '2026-11-17T10:00:00Z', 'motivo': 'Promedio bajo', 'opcional': True,
                 'titulo': 'Título anterior', 'pasos': ['Abre el recurso'], 'recurso': {'url': 'https://example.com'}}
        r = adaptar_recomendacion(vieja, 2)
        self.assertEqual(r['actividad'], 'tiras')
        for campo in ('promedio_al_calificar', 'generada_en', 'motivo', 'opcional'):
            self.assertEqual(r[campo], vieja[campo])
        self.assertNotIn('recurso', r)
        self.assertIn('recurso', vieja)  # No modifica el dato histórico en memoria.
        ortografia = adaptar_recomendacion({**vieja, 'area': 'ortografia', 'texto_practica': 'niño\nárbol'}, 2)
        self.assertEqual(ortografia['ficha']['palabras'], ['niño', 'árbol'])
        self.assertEqual(adaptar_recomendacion(r, 20), r)  # La ficha guardada no cambia.
        self.assertIsNone(adaptar_recomendacion(None))

    def test_laberintos_conectados_y_reproducibles(self):
        for semilla in range(25):
            ficha = crear_laberinto(semilla)
            self.assertEqual(ficha, crear_laberinto(semilla))
            paredes = {tuple(p) for p in ficha['paredes']}
            ancho, alto = ficha['columnas'], ficha['filas']
            visitadas, pendientes = {(0, 0)}, [(0, 0)]
            while pendientes:
                x, y = pendientes.pop()
                for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                    if not (0 <= nx < ancho and 0 <= ny < alto) or (nx, ny) in visitadas:
                        continue
                    pared = (max(x, nx), y, max(x, nx), y+1) if nx != x else (x, max(y, ny), x+1, max(y, ny))
                    if pared not in paredes:
                        visitadas.add((nx, ny))
                        pendientes.append((nx, ny))
            self.assertEqual(len(visitadas), ancho * alto)
            self.assertNotIn((0, 0, 0, 1), paredes)
            self.assertNotIn((ancho, alto-1, ancho, alto), paredes)
            # Número de paredes de una cuadrícula menos N-1 pasillos y dos aberturas.
            self.assertEqual(len(paredes), (ancho+1)*alto + (alto+1)*ancho - (ancho*alto-1) - 2)


class AccesoFichaTests(unittest.TestCase):
    @patch('Modelo.dao_retroalimentacion.connect_to_database')
    def test_filtra_por_propietario_o_tutor(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        r = crear_recomendacion(None, 3)
        cursor.fetchone.return_value = (json.dumps(r),)
        for rol, filtro in [('alumno', 'a.id_usuario = ?'), ('tutor', 't.id_usuario = ?')]:
            self.assertEqual(obtener_recomendacion_intento_dao(7, 33, rol), r)
            consulta = cursor.execute.call_args
            self.assertIn(filtro, consulta.args[0])
            self.assertIn('i.puntuacion IS NOT NULL', consulta.args[0])
            self.assertEqual(consulta.args[1], (7, 33))

    @patch('Modelo.dao_retroalimentacion.connect_to_database')
    def test_sin_acceso_o_sin_recomendacion_no_descarga(self, conectar):
        conectar.return_value.cursor.return_value.fetchone.return_value = None
        with self.assertRaises(FileNotFoundError):
            obtener_recomendacion_intento_dao(7, 33, 'tutor')
        conectar.return_value.close.assert_called_once()
        conectar.reset_mock()
        with self.assertRaises(PermissionError):
            obtener_recomendacion_intento_dao(7, 33, 'visitante')
        conectar.assert_not_called()


class PersistenciaTests(unittest.TestCase):
    def test_recalificar_reemplaza_y_puede_retirar_recomendacion(self):
        cursor = MagicMock()
        cursor.fetchone.side_effect = [None, (2, 8), (14,), None, (9, 8)]
        r = guardar_recomendacion(cursor, 20, 3, {})
        self.assertEqual(r['area'], 'ortografia')
        self.assertIsNone(guardar_recomendacion(cursor, 20, 3, {}))
        llamadas = cursor.execute.call_args_list
        self.assertEqual(sum('DELETE FROM Recomendacion' in c.args[0] for c in llamadas), 2)
        inserciones = [c for c in llamadas if 'INSERT INTO Recomendacion' in c.args[0]]
        self.assertEqual(len(inserciones), 1)
        self.assertEqual(json.loads(inserciones[0].args[1][2]), r)
        for llamada in llamadas:
            self.assertNotIn('INSERT INTO Ejercicios', llamada.args[0])

    @patch('Modelo.dao_tutor.connect_to_database')
    def test_promedios_se_consultan_despues_de_confirmar_y_antes_del_commit(self, conectar):
        conn = conectar.return_value
        cursor = conn.cursor.return_value
        cursor.fetchone.side_effect = [(3, None, None, None), None, (None, 4), (14,)]
        r = dao_tutor.calificar_intento_dao(20, 40, 'Practica', legibilidad={
            'alineacion': 4, 'tamano': 4, 'espaciado': 4, 'inclinacion': 4})
        self.assertEqual(r['area'], 'legibilidad')
        consultas = [c.args[0] for c in cursor.execute.call_args_list]
        self.assertLess(next(i for i, s in enumerate(consultas) if 'MERGE Analisis_Caligrafico' in s),
                        next(i for i, s in enumerate(consultas) if 'FROM vw_Progreso_Alumno' in s))
        conn.commit.assert_called_once()
        conn.rollback.assert_not_called()

    @patch('Modelo.dao_tutor.connect_to_database')
    def test_fallo_de_recomendacion_revierte_tambien_la_calificacion(self, conectar):
        conn = conectar.return_value
        conn.cursor.return_value.fetchone.side_effect = [(3, None, None, None), None, (4, 9), None]
        with self.assertRaisesRegex(ValueError, 'migración 007'):
            dao_tutor.calificar_intento_dao(20, 40, 'Practica')
        conn.commit.assert_not_called()
        conn.rollback.assert_called_once()

    @patch('Modelo.dao_tutor.connect_to_database')
    def test_nota_general_sola_no_genera_recomendacion(self, conectar):
        conectar.return_value.cursor.return_value.fetchone.side_effect = [(3, None, None, None), None, (None, None)]
        self.assertIsNone(dao_tutor.calificar_intento_dao(20, 0, 'Revisa'))

    @patch('Modelo.dao_retroalimentacion.connect_to_database')
    def test_lectura_filtrada_por_usuario_incluye_intentos_anteriores(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        r = crear_recomendacion(2, 8)
        cursor.fetchall.return_value = [(20, 'Copia', datetime(2026, 11, 17), json.dumps(r), 3, 'validada', None, None),
                                       (10, 'Copia', datetime(2026, 11, 16), json.dumps(r), 2, 'sugerida', None, None)]
        respuesta = obtener_retroalimentacion_alumno_dao(33)
        self.assertEqual([i['id_intento'] for i in respuesta], [20, 10])
        self.assertEqual(respuesta[0]['practica']['estado'], 'validada')
        consulta = cursor.execute.call_args
        self.assertIn('a.id_usuario = ?', consulta.args[0])
        self.assertIn('i.puntuacion IS NOT NULL', consulta.args[0])
        self.assertEqual(consulta.args[1], (33,))
        conectar.return_value.close.assert_called_once()

    def test_tutor_recibe_el_mismo_detalle_guardado(self):
        r = crear_recomendacion(None, 2)
        cursor = MagicMock()
        cursor.fetchall.return_value = [(20, 3, 'Ana', 2, 'Copia', datetime(2026, 11, 17),
                                        None, None, 20, 'Practica', None, None, None,
                                        2, 2, 2, 2, json.dumps(r))]
        intento = dao_tutor._consultar_intentos(cursor, 99, id_alumno=3, con_imagen=False)[0]
        self.assertEqual(IntentoTutorResponse(**intento).recomendacion, r)
        self.assertEqual(cursor.execute.call_args.args[1], (99, 3))


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.app = FastAPI()
        self.app.include_router(alumno.router, prefix='/api/alumno')
        self.app.include_router(tutor.router, prefix='/api/tutor')
        self.app.dependency_overrides[get_current_user] = lambda: {'id_usuario': 33, 'tipo_usuario': 'alumno'}
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()

    @patch('Control.alumno.obtener_retroalimentacion_alumno_dao')
    def test_alumno_solo_consulta_sus_recomendaciones(self, obtener):
        obtener.return_value = []
        self.assertEqual(self.client.get('/api/alumno/retroalimentacion?id_usuario=99').json(), [])
        obtener.assert_called_once_with(33)
        self.app.dependency_overrides[get_current_user] = lambda: {'id_usuario': 99, 'tipo_usuario': 'tutor'}
        self.assertEqual(self.client.get('/api/alumno/retroalimentacion').status_code, 403)

    @patch('Control.tutor.calificar_intento_dao')
    @patch('Control.tutor.obtener_intento_tutor_dao')
    def test_calificar_devuelve_la_recomendacion_y_verifica_propiedad(self, verificar, calificar):
        self.app.dependency_overrides[get_current_user] = lambda: {'id_usuario': 99, 'tipo_usuario': 'tutor'}
        calificar.return_value = crear_recomendacion(4, 9)
        res = self.client.put('/api/tutor/calificar/20', json={'calificacion': 40})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['recomendacion'], calificar.return_value)
        verificar.assert_called_once_with(20, 99)
        calificar.reset_mock()
        verificar.side_effect = PermissionError('Este intento no pertenece al tutor')
        self.assertEqual(self.client.put('/api/tutor/calificar/20', json={'calificacion': 40}).status_code, 403)
        calificar.assert_not_called()

    def test_recomendaciones_son_solo_de_consulta(self):
        self.assertEqual(self.client.post('/api/alumno/retroalimentacion', json={}).status_code, 405)

    @patch('Control.retroalimentacion.obtener_recomendacion_intento_dao')
    def test_pdf_autenticado_para_alumno_y_tutor(self, obtener):
        obtener.return_value = crear_recomendacion(None, 3)
        for rol, ruta in [('alumno', '/api/alumno/retroalimentacion/7/pdf'),
                          ('tutor', '/api/tutor/intentos/7/retroalimentacion/pdf')]:
            self.app.dependency_overrides[get_current_user] = lambda rol=rol: {'id_usuario': 33, 'tipo_usuario': rol}
            res = self.client.get(ruta)
            self.assertEqual(res.status_code, 200)
            self.assertTrue(res.content.startswith(b'%PDF-'))
            self.assertEqual(res.headers['content-type'], 'application/pdf')
            self.assertIn('attachment', res.headers['content-disposition'])
            self.assertIn('no-store', res.headers['cache-control'])
            obtener.assert_called_with(7, 33, rol)
        obtener.side_effect = FileNotFoundError('No disponible')
        self.assertEqual(self.client.get('/api/tutor/intentos/7/retroalimentacion/pdf').status_code, 404)

    @patch('Control.retroalimentacion.obtener_recomendacion_intento_dao')
    def test_descarga_rechaza_rol_incorrecto_y_sesion_ausente(self, obtener):
        self.assertEqual(self.client.get('/api/tutor/intentos/7/retroalimentacion/pdf').status_code, 403)
        self.app.dependency_overrides.clear()
        self.assertEqual(self.client.get('/api/alumno/retroalimentacion/7/pdf').status_code, 401)
        obtener.assert_not_called()

    @patch('Control.retroalimentacion.obtener_recomendacion_intento_dao')
    def test_error_pdf_controlado_sin_detalles_internos(self, obtener):
        obtener.side_effect = RuntimeError('detalle privado')
        res = self.client.get('/api/alumno/retroalimentacion/7/pdf')
        self.assertEqual(res.status_code, 500)
        self.assertNotIn('detalle privado', res.text)


if __name__ == '__main__':
    unittest.main()
