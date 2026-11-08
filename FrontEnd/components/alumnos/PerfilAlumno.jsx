'use client';
import { useEffect, useState } from 'react';

// Perfil de solo lectura: el alumno no edita sus datos ni su contraseña; eso lo hace su tutor.
const FICHAS = [
  { clave: 'usuario',   etiqueta: '🔑 Usuario',          color: '#7C3AED', fondo: '#F5F3FF', borde: '#DDD6FE' },
  { clave: 'grado',     etiqueta: '🎒 Grado',            color: '#2563EB', fondo: '#EFF6FF', borde: '#BFDBFE' },
  { clave: 'grupo',     etiqueta: '🏫 Grupo',            color: '#059669', fondo: '#ECFDF5', borde: '#A7F3D0' },
  { clave: 'tutor',     etiqueta: '🧑‍🏫 Mi tutor',         color: '#DB2777', fondo: '#FDF2F8', borde: '#FBCFE8' },
  { clave: 'desde',     etiqueta: '📅 En Grafía desde',   color: '#EA580C', fondo: '#FFF7ED', borde: '#FED7AA' },
];

const formatearFecha = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime())
    ? null
    : fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function PerfilAlumno() {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/perfil`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('No pudimos cargar tus datos. Intenta más tarde.');
        setPerfil(await res.json());
      } catch (err) {
        setError(err.message);
      }
    };
    cargar();
  }, []);

  const nombreCompleto = perfil
    ? [perfil.nombre, perfil.apellido_paterno, perfil.apellido_materno].filter(Boolean).join(' ')
    : '';
  const iniciales = perfil
    ? [perfil.nombre, perfil.apellido_paterno].filter(Boolean).map(p => p.trim()[0]).join('').toUpperCase()
    : '';
  const valores = perfil && { ...perfil, desde: formatearFecha(perfil.fecha_registro) };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ fontSize: '2.2rem' }}>👤</div>
          <h2 className="font-black" style={{ fontSize: '1.8rem', color: '#1E3A5F' }}>Mi Perfil</h2>
        </div>

        {error ? (
          <div className="p-4 font-bold text-sm flex items-center gap-2"
            style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
            😅 {error}
          </div>
        ) : !perfil ? (
          <div className="p-8 text-center font-bold text-gray-400"
            style={{ background: 'white', borderRadius: '24px', border: '2.5px solid #DDD6FE' }}>
            Cargando tus datos... ⏳
          </div>
        ) : (
          <>
            {/* Tarjeta principal */}
            <div className="bg-white p-6 flex items-center gap-5 flex-wrap"
              style={{ borderRadius: '24px', border: '2.5px solid #DDD6FE', boxShadow: '0 6px 0 #DDD6FE' }}>
              <div className="flex items-center justify-center font-black text-white shrink-0"
                style={{
                  width: '76px', height: '76px', borderRadius: '50%', fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', boxShadow: '0 4px 0 #4C1D95',
                }}>
                {iniciales || '🙂'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black" style={{ color: '#7C3AED' }}>😊 Mi nombre</p>
                <p className="font-black break-words" style={{ fontSize: '1.5rem', color: '#1E3A5F' }}>{nombreCompleto}</p>
              </div>
            </div>

            {/* Datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FICHAS.map(({ clave, etiqueta, color, fondo, borde }, i) => (
                <div key={clave} className={`p-4 ${i === FICHAS.length - 1 && FICHAS.length % 2 ? 'sm:col-span-2' : ''}`}
                  style={{ background: fondo, borderRadius: '20px', border: `2.5px solid ${borde}`, boxShadow: `0 4px 0 ${borde}` }}>
                  <p className="text-sm font-black" style={{ color }}>{etiqueta}</p>
                  <p className="font-black break-words mt-0.5" style={{ fontSize: '1.15rem', color: '#1F2937' }}>
                    {valores[clave] || '—'}
                  </p>
                </div>
              ))}
            </div>

            {/* Aviso */}
            <div className="p-4 font-bold text-sm flex items-center gap-3"
              style={{ background: '#FEFCE8', border: '2px solid #FDE68A', borderRadius: '16px', color: '#92400E' }}>
              <span style={{ fontSize: '1.4rem' }}>🔑</span>
              ¿Olvidaste tu contraseña o hay un dato mal? Pídele a tu tutor que lo cambie.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
