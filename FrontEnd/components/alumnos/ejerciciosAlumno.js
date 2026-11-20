/*
 * Contiene funciones auxiliares relacionadas con ejerciciosAlumno.
 */

import { useEffect, useState } from 'react';

// Hook que carga los ejercicios del alumno según su identificador y estado.
export function useEjerciciosAlumno(idAlumno, estado, mensajeError) {
  // Guarda el resultado de la última carga realizada.
  const [resultado, setResultado] = useState(null);

  // Ejecuta la petición cuando cambia el alumno, el estado o el mensaje de error.
  useEffect(() => {
    if (!idAlumno) return;

    // Permite cancelar la petición si ya no es necesaria.
    const controller = new AbortController();
    const { signal } = controller;

    // Obtiene los ejercicios desde la API usando el token de la sesión.
    const cargar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/ejercicios/${estado}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!res.ok) throw new Error(mensajeError);
        const ejercicios = await res.json();

        // Solo actualiza el estado si la petición no fue cancelada.
        if (!signal.aborted) setResultado({ idAlumno, estado, ejercicios, error: '' });
      } catch (err) {
        // Guarda una lista vacía y el mensaje de error si la petición falla.
        if (!signal.aborted) setResultado({ idAlumno, estado, ejercicios: [], error: err.message });
      }
    };

    cargar();

    // Cancela la petición al desmontar o volver a ejecutar el efecto.
    return () => controller.abort();
  }, [idAlumno, estado, mensajeError]);

  // Selecciona el resultado solo si corresponde a los parámetros actuales.
  const cargaActual = resultado?.idAlumno === idAlumno && resultado?.estado === estado ? resultado : null;

  // Expone los ejercicios, el error y el estado de carga al componente consumidor.
  return {
    ejercicios: cargaActual?.ejercicios ?? [],
    error: cargaActual?.error ?? '',
    loadingPage: cargaActual === null,
  };
}

// Convierte una fecha de ejercicio a texto localizado; usa un valor alternativo si no existe.
export function formatearFechaEjercicio(fecha, sinFecha = '—') {
  if (!fecha) return sinFecha;
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// Envía el intento de un ejercicio al servidor y lanza un error si la operación falla.
export async function enviarIntento(datos, mensajeError) {
  // Requiere una sesión activa para poder enviar el intento.
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Sesión expirada.');

  // Realiza la petición POST con los datos del intento y el token de autenticación.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/intento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });

  // Extrae el detalle del error cuando el servidor lo devuelve.
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail || mensajeError);
  }
}
