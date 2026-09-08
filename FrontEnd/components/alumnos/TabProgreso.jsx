'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Star, BookOpen, Award, RotateCw, ChevronRight } from 'lucide-react';

/* ══════════════════════════════════════════════════
   CONFIGURACIÓN DE NIVELES
══════════════════════════════════════════════════ */
const NIVELES = [
  {
    min: 3.5, max: 4,
    id: 'excelente',
    label: 'Excelente',
    emoji: '🌟',
    descripcion: 'Dominio total y fluidez en la escritura.',
    color:  '#059669',
    colorLight: '#ECFDF5',
    border: '#A7F3D0',
    shadow: '#065F46',
    barra:  '#10B981',
    puntos: 4,
  },
  {
    min: 2.5, max: 3.49,
    id: 'bueno',
    label: 'Bueno',
    emoji: '👍',
    descripcion: 'Dominio parcial con errores transitorios.',
    color:  '#1D4ED8',
    colorLight: '#EFF6FF',
    border: '#BFDBFE',
    shadow: '#1e3a8a',
    barra:  '#3B82F6',
    puntos: 3,
  },
  {
    min: 1.5, max: 2.49,
    id: 'regular',
    label: 'Regular',
    emoji: '📊',
    descripcion: 'Inconsistencias sistémicas que afectan la comunicación.',
    color:  '#92400E',
    colorLight: '#FFFBEB',
    border: '#FDE68A',
    shadow: '#78350f',
    barra:  '#F59E0B',
    puntos: 2,
  },
  {
    min: 0, max: 1.49,
    id: 'apoyo',
    label: 'Necesita Apoyo',
    emoji: '🤝',
    descripcion: 'Desviación crítica que imposibilita la comprensión o lectura.',
    color:  '#DC2626',
    colorLight: '#FEF2F2',
    border: '#FCA5A5',
    shadow: '#991b1b',
    barra:  '#EF4444',
    puntos: 1,
  },
];

const getNivel = (promedio) => {
  if (promedio === null || promedio === undefined) return null;
  return NIVELES.find(n => promedio >= n.min && promedio <= n.max) || NIVELES[3];
};

const TIPO_CONFIG = {
  Legibilidad: { emoji: '✍️', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  Ortografía:  { emoji: '📝', color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0' },
  Mixto:       { emoji: '🎯', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A' },
};

/* ══════════════════════════════════════════════════
   SUB-COMPONENTES
══════════════════════════════════════════════════ */

/* Barra de nivel (escala 1–4) */
const BarraNivel = ({ promedio, nivel }) => {
  const pct = promedio ? Math.min(((promedio - 1) / 3) * 100, 100) : 0;
  return (
    <div className="w-full">
      {/* Marcas */}
      <div className="flex justify-between mb-1.5">
        {[1, 2, 3, 4].map(n => (
          <span key={n} className="text-xs font-black" style={{ color: '#9CA3AF' }}>{n}</span>
        ))}
      </div>
      {/* Track */}
      <div className="w-full h-5 relative" style={{ background: '#F3F4F6', borderRadius: '999px', border: '2px solid #E5E7EB' }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #A7F3D0, ${nivel?.barra || '#10B981'})`,
            borderRadius: '999px',
            minWidth: pct > 0 ? '20px' : 0,
          }}
        />
        {/* Indicador */}
        {promedio && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center font-black text-white text-xs shadow-md transition-all duration-700"
            style={{
              left: `${pct}%`,
              background: nivel?.barra,
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: `0 2px 8px ${nivel?.barra}66`,
            }}>
            {promedio.toFixed(1)}
          </div>
        )}
      </div>
      {/* Etiquetas */}
      <div className="flex justify-between mt-1.5">
        {NIVELES.slice().reverse().map(n => (
          <span key={n.id} className="text-xs font-bold" style={{ color: '#D1D5DB', fontSize: '0.6rem' }}>
            {n.label.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  );
};

/* Chip de stat */
const StatChip = ({ emoji, label, valor, color }) => (
  <div className="flex flex-col items-center justify-center p-3 flex-1 min-w-0"
    style={{ background: 'white', border: '2px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 3px 0 #E5E7EB' }}>
    <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
    <span className="font-black mt-0.5" style={{ fontSize: '1.1rem', color }}>{valor}</span>
    <span className="font-semibold text-gray-400 text-center" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>{label}</span>
  </div>
);

/* Tarjeta de tipo */
const TarjetaTipo = ({ tipo, datos }) => {
  const cfg = TIPO_CONFIG[tipo] || { emoji: '📋', color: '#374151', bg: '#F9FAFB', border: '#E5E7EB' };
  const nivel = getNivel(datos?.promedio);
  return (
    <div className="flex items-center gap-3 p-3"
      style={{ background: cfg.bg, border: `2px solid ${cfg.border}`, borderRadius: '16px' }}>
      <div className="text-2xl">{cfg.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-black text-sm" style={{ color: cfg.color }}>{tipo}</span>
          <span className="font-black text-xs px-2 py-0.5"
            style={{ background: nivel?.colorLight, color: nivel?.color, border: `1.5px solid ${nivel?.border}`, borderRadius: '8px' }}>
            {nivel?.emoji} {nivel?.label}
          </span>
        </div>
        <div className="w-full h-2" style={{ background: '#E5E7EB', borderRadius: '999px' }}>
          <div style={{
            width: `${datos?.promedio ? Math.min(((datos.promedio - 1) / 3) * 100, 100) : 0}%`,
            background: nivel?.barra,
            height: '100%', borderRadius: '999px', transition: 'width 0.6s ease',
          }} />
        </div>
        <span className="text-xs font-semibold text-gray-400 mt-0.5 block">
          {datos?.total || 0} ejercicio{datos?.total !== 1 ? 's' : ''} · prom. {datos?.promedio?.toFixed(1) || '—'}
        </span>
      </div>
    </div>
  );
};

/* Fila de historial */
const FilaHistorial = ({ item }) => {
  const nivel = getNivel(item.puntuacion);
  const fecha = new Date(item.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  return (
    <div className="flex items-center gap-3 py-2.5 px-3"
      style={{ borderBottom: '1.5px solid #F3F4F6' }}>
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 font-black text-lg"
        style={{ background: nivel?.colorLight, borderRadius: '12px', border: `2px solid ${nivel?.border}` }}>
        {nivel?.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: '#1F2937' }}>{item.titulo}</p>
        <p className="font-semibold text-xs" style={{ color: '#9CA3AF' }}>{item.tipo} · {fecha}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1">
        <span className="font-black text-sm" style={{ color: nivel?.color }}>{item.puntuacion}</span>
        <span className="text-xs font-semibold text-gray-300">/4</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   Endpoint esperado: GET /api/alumno/progreso
   Respuesta:
   {
     promedio_general: number (1-4),
     total_intentos: number,
     mejor_puntuacion: number,
     racha_actual: number,          // días consecutivos activo
     intentos_por_tipo: {
       Legibilidad: { promedio: number, total: number },
       Ortografía:  { promedio: number, total: number },
       Mixto:       { promedio: number, total: number }
     },
     historial_reciente: [
       { fecha: string, titulo: string, tipo: string, puntuacion: number }
     ]
   }
══════════════════════════════════════════════════ */
const TabProgreso = ({ idAlumno }) => {
  const [datos,    setDatos]    = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState(null);

  const cargarProgreso = async () => {
    setCargando(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumno/progreso`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('No se pudo cargar el progreso.');
      const data = await res.json();
      setDatos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarProgreso(); }, [idAlumno]);

  const nivel = getNivel(datos?.promedio_general);

  /* ── Cargando ── */
  if (cargando) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
      <p className="font-bold text-gray-400">Cargando tu progreso...</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
      <div style={{ fontSize: '3.5rem' }}>😔</div>
      <p className="font-black text-lg" style={{ color: '#DC2626' }}>No se pudo cargar el progreso</p>
      <p className="font-semibold text-gray-400 text-sm">{error}</p>
      <button onClick={cargarProgreso}
        className="flex items-center gap-2 px-5 py-2.5 font-black text-sm text-white"
        style={{ background: '#7C3AED', borderRadius: '14px', boxShadow: '0 4px 0 #4C1D95' }}>
        <RotateCw size={16} /> Reintentar
      </button>
    </div>
  );

  /* ── Sin datos ── */
  if (!datos || datos.total_intentos === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
      <div style={{ fontSize: '4rem' }}>📝</div>
      <h2 className="font-black text-xl" style={{ color: '#4C1D95' }}>¡Aún no hay progreso!</h2>
      <p className="font-semibold text-gray-400 text-sm max-w-xs">
        Completa tu primer ejercicio y aquí verás cómo vas avanzando.
      </p>
    </div>
  );

  const historial = datos.historial_reciente || [];
  const tiposDisponibles = Object.keys(datos.intentos_por_tipo || {});

  return (
    <div className="flex flex-col gap-5 pb-8">

      {/* ══ 1. TARJETA PRINCIPAL DE NIVEL ══ */}
      <div className="overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${nivel.colorLight}, white)`,
          border: `3px solid ${nivel.border}`,
          borderRadius: '28px',
          boxShadow: `0 8px 0 ${nivel.border}`,
        }}>

        {/* Header de color */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: nivel.color, opacity: 0.7 }}>
                Tu nivel actual
              </p>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '3rem', lineHeight: 1 }}>{nivel.emoji}</span>
                <div>
                  <h2 className="font-black" style={{ fontSize: '2rem', color: nivel.color, lineHeight: 1 }}>
                    {nivel.label}
                  </h2>
                  <p className="font-semibold text-sm mt-0.5" style={{ color: nivel.color, opacity: 0.75 }}>
                    {nivel.descripcion}
                  </p>
                </div>
              </div>
            </div>
            {/* Puntos */}
            <div className="flex flex-col items-center px-3 py-2 flex-shrink-0"
              style={{ background: nivel.color, borderRadius: '18px', boxShadow: `0 4px 0 ${nivel.shadow}` }}>
              <span className="text-white font-black" style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                {datos.promedio_general?.toFixed(1)}
              </span>
              <span className="text-white font-bold text-xs opacity-80">/ 4 pts</span>
            </div>
          </div>

          {/* Barra de nivel */}
          <BarraNivel promedio={datos.promedio_general} nivel={nivel} />
        </div>

        {/* Chips de stats */}
        <div className="flex gap-2 px-5 pb-5">
          <StatChip emoji="📋" label="Ejercicios completados" valor={datos.total_intentos}     color="#6D28D9" />
          <StatChip emoji="🏆" label="Mejor puntuación"       valor={`${datos.mejor_puntuacion || '—'}/4`} color="#D97706" />
          <StatChip emoji="🔥" label="Racha activa (días)"    valor={datos.racha_actual || 0}  color="#DC2626" />
        </div>
      </div>

      {/* ══ 2. GUÍA DE NIVELES ══ */}
      <div style={{ background: 'white', border: '2.5px solid #DDD6FE', borderRadius: '24px', boxShadow: '0 6px 0 #DDD6FE', overflow: 'hidden' }}>
        <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '2px solid #F3F4F6' }}>
          <Award size={18} style={{ color: '#7C3AED' }} />
          <h3 className="font-black text-base" style={{ color: '#4C1D95' }}>Escala de evaluación</h3>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {NIVELES.map(n => {
            const esActual = nivel?.id === n.id;
            return (
              <div key={n.id}
                className="flex items-center gap-3 p-3 transition-all"
                style={{
                  background: esActual ? n.colorLight : '#FAFAFA',
                  border: `2px solid ${esActual ? n.border : '#F3F4F6'}`,
                  borderRadius: '14px',
                  transform: esActual ? 'scale(1.02)' : 'none',
                  boxShadow: esActual ? `0 4px 0 ${n.border}` : 'none',
                }}>
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                  style={{ background: n.colorLight, borderRadius: '12px', border: `2px solid ${n.border}`, fontSize: '1.3rem' }}>
                  {n.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm" style={{ color: n.color }}>{n.label}</span>
                    <span className="text-xs font-bold px-1.5 py-0.5"
                      style={{ background: n.color, color: 'white', borderRadius: '6px' }}>
                      {n.puntos} pt{n.puntos > 1 ? 's' : ''}
                    </span>
                    {esActual && (
                      <span className="text-xs font-black px-2 py-0.5"
                        style={{ background: n.color, color: 'white', borderRadius: '8px' }}>
                        ← Estás aquí
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: '#6B7280' }}>{n.descripcion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ 3. DESGLOSE POR TIPO ══ */}
      {tiposDisponibles.length > 0 && (
        <div style={{ background: 'white', border: '2.5px solid #DDD6FE', borderRadius: '24px', boxShadow: '0 6px 0 #DDD6FE', overflow: 'hidden' }}>
          <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '2px solid #F3F4F6' }}>
            <BookOpen size={18} style={{ color: '#7C3AED' }} />
            <h3 className="font-black text-base" style={{ color: '#4C1D95' }}>Desempeño por área</h3>
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {tiposDisponibles.map(tipo => (
              <TarjetaTipo key={tipo} tipo={tipo} datos={datos.intentos_por_tipo[tipo]} />
            ))}
          </div>
        </div>
      )}

      {/* ══ 4. HISTORIAL RECIENTE ══ */}
      {historial.length > 0 && (
        <div style={{ background: 'white', border: '2.5px solid #DDD6FE', borderRadius: '24px', boxShadow: '0 6px 0 #DDD6FE', overflow: 'hidden' }}>
          <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '2px solid #F3F4F6' }}>
            <TrendingUp size={18} style={{ color: '#7C3AED' }} />
            <h3 className="font-black text-base" style={{ color: '#4C1D95' }}>Últimos ejercicios</h3>
          </div>
          <div>
            {historial.slice(0, 8).map((item, i) => (
              <FilaHistorial key={i} item={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default TabProgreso;