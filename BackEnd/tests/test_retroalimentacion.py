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
from Modelo.dao_retroalimentacion import guardar_recomendacion, obtener_retroalimentacion_alumno_dao
from Modelo.schemas_tutor import IntentoTutorResponse
from Servicios.retroalimentacion import crear_recomendacion


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
            self.assertTrue(r['recurso']['url'].startswith('https://'))
            self.assertNotIn('id_ejercicio', r)

    def test_planas_usan_modelo_no_errores_del_ocr(self):
        contenido = {'evaluacion': {'respuestas_aceptadas': ['El niño mira el árbol y el jardín.']}}
        r = crear_recomendacion(3, 9, contenido)
        self.assertEqual(r['texto_practica'], 'El\nniño\nmira\nárbol\ny')
        self.assertNotIn('error', ' '.join(r['pasos']))

    def test_modelo_generico_si_no_hay_referencia(self):
        for contenido in (None, {}, [], {'evaluacion': {}}):
            self.assertIn('árbol', crear_recomendacion(2, None, contenido)['texto_practica'])


class PersistenciaTests(unittest.TestCase):
    def test_recalificar_reemplaza_y_puede_retirar_recomendacion(self):
        cursor = MagicMock()
        cursor.fetchone.side_effect = [(2, 8), (14,), (9, 8)]
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
        cursor.fetchone.side_effect = [(3, None, None, None), (None, 4), (14,)]
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
        conn.cursor.return_value.fetchone.side_effect = [(3, None, None, None), (4, 9), None]
        with self.assertRaisesRegex(ValueError, 'migración 007'):
            dao_tutor.calificar_intento_dao(20, 40, 'Practica')
        conn.commit.assert_not_called()
        conn.rollback.assert_called_once()

    @patch('Modelo.dao_tutor.connect_to_database')
    def test_nota_general_sola_no_genera_recomendacion(self, conectar):
        conectar.return_value.cursor.return_value.fetchone.side_effect = [(3, None, None, None), (None, None)]
        self.assertIsNone(dao_tutor.calificar_intento_dao(20, 0, 'Revisa'))

    @patch('Modelo.dao_retroalimentacion.connect_to_database')
    def test_lectura_filtrada_por_usuario_incluye_intentos_anteriores(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        r = crear_recomendacion(2, 8)
        cursor.fetchall.return_value = [(20, 'Copia', datetime(2026, 11, 17), json.dumps(r)),
                                       (10, 'Copia', datetime(2026, 11, 16), json.dumps(r))]
        respuesta = obtener_retroalimentacion_alumno_dao(33)
        self.assertEqual([i['id_intento'] for i in respuesta], [20, 10])
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


if __name__ == '__main__':
    unittest.main()
