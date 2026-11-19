'use client';
import { useEffect, useState } from 'react';
import CapturaEscritura from './alumnos/CapturaEscritura';

async function solicitarPractica(ruta, opciones = {}) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + ruta, {
    ...opciones,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...opciones.headers,
    },
    cache: 'no-store',
  });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof datos.detail === 'string' ? datos.detail : 'No se pudo consultar o guardar la práctica.');
  }
  return datos;
}

const boton = 'min-h-11 rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-bold text-violet-800 disabled:opacity-60';
const estados = {
  sugerida: 'Sin entregar',
  completada: 'Entregada. Espera la revisión del tutor.',
  validada: 'Validada por el tutor.',
};

export default function SeguimientoPractica({ idIntento, rol, practicaAlumno, onPracticaGuardada }) {
  const [capturando, setCapturando] = useState(false);
  const [practicaTutor, setPracticaTutor] = useState(null);
  const [revision, setRevision] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');
  const esTutor = rol === 'tutor';
  const rutaTutor = '/api/tutor/intentos/' + idIntento + '/retroalimentacion/practica';
  const practica = esTutor ? practicaTutor : practicaAlumno;

  useEffect(() => {
    if (!esTutor) return;
    const controller = new AbortController();
    solicitarPractica(rutaTutor, { signal: controller.signal })
      .then(datos => { if (!controller.signal.aborted) setPracticaTutor(datos); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); });
    return () => controller.abort();
  }, [esTutor, rutaTutor, revision]);

  const enviarPractica = async (imagen) => {
    const ruta = '/api/alumno/retroalimentacion/' + idIntento + '/practica/' + practica.id_recomendacion;
    const datos = await solicitarPractica(ruta, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagen_codificada: imagen }),
    });
    onPracticaGuardada(datos);
    setCapturando(false);
  };

  const verEvidencia = async () => {
    setOcupado(true);
    setError('');
    try {
      setPracticaTutor(await solicitarPractica(rutaTutor + '?incluir_imagen=true'));
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const validarPractica = async () => {
    setOcupado(true);
    setError('');
    try {
      const datos = await solicitarPractica(rutaTutor + '/' + practica.id_recomendacion, { method: 'PUT' });
      setPracticaTutor(actual => ({ ...actual, ...datos }));
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  if (!esTutor && !practica) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-violet-200 pt-4">
      <p className="text-sm font-semibold" role="status">
        {esTutor && practica?.estado === 'completada' ? 'Entregada. Pendiente de validar.'
          : practica ? estados[practica.estado] : error ? 'Estado de la práctica no disponible.' : 'Consultando práctica…'}
      </p>
      {practica?.fecha_completada && (
        <p className="text-xs text-slate-600">
          Entregada el {new Date(practica.fecha_completada).toLocaleString('es-MX')}
          {practica.fecha_validada && ' · Validada el ' + new Date(practica.fecha_validada).toLocaleString('es-MX')}
        </p>
      )}
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      {esTutor && (!practica || practica.estado === 'sugerida' || error) && (
        <button type="button" className={boton} disabled={ocupado} onClick={() => {
          setError('');
          setRevision(n => n + 1);
        }}>Actualizar estado</button>
      )}
      {!esTutor && practica.estado === 'sugerida' && (
        <>
          <button type="button" className={boton} onClick={() => setCapturando(mostrar => !mostrar)}>
            {capturando ? 'Cerrar captura' : 'Enviar foto al tutor'}
          </button>
          {capturando && <CapturaEscritura onEnviar={enviarPractica} />}
        </>
      )}
      {esTutor && practica?.fecha_completada && !practica.imagen_codificada && (
        <button type="button" className={boton} onClick={verEvidencia} disabled={ocupado}>
          {ocupado ? 'Cargando…' : 'Ver foto de la práctica'}
        </button>
      )}
      {esTutor && practica?.imagen_codificada && (
        <>
          <img src={practica.imagen_codificada} alt="Foto de la práctica entregada" className="max-h-[65vh] w-full rounded-lg bg-white object-contain" />
          {practica.estado === 'completada' && (
            <button type="button" className={boton} onClick={validarPractica} disabled={ocupado}>
              {ocupado ? 'Guardando…' : 'Validar práctica'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
