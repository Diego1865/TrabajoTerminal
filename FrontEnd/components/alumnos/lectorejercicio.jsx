'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';

/* ══════════════════════════════════════════════════
   LectorEjercicio — Lee en voz alta el texto del ejercicio
   
   Props:
     texto        string   — texto principal a leer (texto_guia)
     titulo       string   — (opcional) se lee antes del texto principal
     descripcion  string   — (opcional) se lee entre titulo y texto
     etiqueta     string   — (opcional) texto del botón (default: "Escuchar")
     variante     'boton' | 'flotante'
                  boton    — botón rectangular (para integrar en la cabecera del ejercicio)
                  flotante — botón circular flotante (para esquina de pantalla)
══════════════════════════════════════════════════ */

/* ── Ondas animadas que indican que está hablando ── */
const Ondas = ({ color = '#7C3AED' }) => (
  <span className="inline-flex items-end gap-[2px]" aria-hidden="true">
    {[0, 1, 2, 3].map(i => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          width: '3px',
          borderRadius: '999px',
          background: color,
          animation: `onda 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
        }}
      />
    ))}
    <style>{`
      @keyframes onda {
        from { height: 4px; opacity: 0.5; }
        to   { height: 14px; opacity: 1; }
      }
    `}</style>
  </span>
);

/* ── Icono de bocina con pulso cuando está activo ── */
const IconoBocina = ({ activo, color = '#7C3AED', size = 20 }) => (
  <span className="relative inline-flex items-center justify-center">
    {activo && (
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: color, opacity: 0.2 }}
      />
    )}
    <Volume2 size={size} style={{ color, position: 'relative', zIndex: 1 }} />
  </span>
);

/* ══════════════════════════════════════════════════
   HOOK: useLector
   Encapsula toda la lógica de Web Speech API
══════════════════════════════════════════════════ */
const useLector = () => {
  const [estado,  setEstado]  = useState('idle'); // idle | hablando | no-soportado
  const utterRef = useRef(null);
  const soportado = typeof window !== 'undefined' && 'speechSynthesis' in window;

  /* Detener al desmontar */
  useEffect(() => {
    return () => { if (soportado) window.speechSynthesis.cancel(); };
  }, [soportado]);

  /* Selección de voz en español */
  const obtenerVozEspanol = useCallback(() => {
    const voces = window.speechSynthesis.getVoices();
    // Intentar voz de es-MX primero, luego cualquier es-*, luego null (usa la default)
    return (
      voces.find(v => v.lang === 'es-MX') ||
      voces.find(v => v.lang.startsWith('es')) ||
      null
    );
  }, []);

  const leer = useCallback((texto) => {
    if (!soportado) { setEstado('no-soportado'); return; }
    // Si ya está leyendo, detener
    if (estado === 'hablando') {
      window.speechSynthesis.cancel();
      setEstado('idle');
      return;
    }

    window.speechSynthesis.cancel(); // limpiar cola

    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang  = 'es-MX';
    utter.rate  = 0.9;   // un poco más lento para niños
    utter.pitch = 1.05;

    // Las voces pueden cargarse de forma asíncrona
    const iniciar = () => {
      const voz = obtenerVozEspanol();
      if (voz) utter.voice = voz;
      utter.onstart = () => setEstado('hablando');
      utter.onend   = () => setEstado('idle');
      utter.onerror = () => setEstado('idle');
      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      iniciar();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        iniciar();
      };
    }
  }, [estado, soportado, obtenerVozEspanol]);

  const detener = useCallback(() => {
    if (soportado) window.speechSynthesis.cancel();
    setEstado('idle');
  }, [soportado]);

  return { estado, leer, detener, soportado };
};

/* ══════════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════════ */
const LectorEjercicio = ({
  texto        = '',
  titulo       = '',
  descripcion  = '',
  etiqueta     = 'Escuchar',
  variante     = 'boton',
}) => {
  const { estado, leer, detener, soportado } = useLector();

  /* Armar el texto completo a leer (titulo → descripcion → texto) */
  const textoCompleto = [titulo, descripcion, texto]
    .filter(Boolean)
    .join('. ');

  const hablando = estado === 'hablando';
  const noSoportado = estado === 'no-soportado' || !soportado;

  /* ── Variante FLOTANTE (círculo en esquina) ── */
  if (variante === 'flotante') {
    return (
      <button
        onClick={() => leer(textoCompleto)}
        disabled={noSoportado}
        title={noSoportado ? 'Tu navegador no soporta lectura en voz alta' : hablando ? 'Detener' : 'Escuchar ejercicio'}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          width: '56px', height: '56px',
          borderRadius: '50%',
          background: hablando
            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
            : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
          boxShadow: hablando
            ? '0 6px 0 #991b1b, 0 8px 24px rgba(239,68,68,0.4)'
            : '0 6px 0 #4C1D95, 0 8px 24px rgba(109,40,217,0.4)',
          border: 'none',
          cursor: noSoportado ? 'not-allowed' : 'pointer',
          opacity: noSoportado ? 0.4 : 1,
        }}>
        {hablando
          ? <Square size={22} style={{ color: 'white' }} />
          : <Volume2 size={22} style={{ color: 'white' }} />}
      </button>
    );
  }

  /* ── Variante BOTÓN (inline, rectangular) ── */
  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => leer(textoCompleto)}
        disabled={noSoportado}
        className="flex items-center gap-2 px-4 py-2.5 font-black text-sm transition-all hover:scale-105 active:scale-95"
        style={{
          borderRadius: '14px',
          background: hablando ? '#FEF2F2' : '#F5F3FF',
          border: `2.5px solid ${hablando ? '#FCA5A5' : '#DDD6FE'}`,
          color: hablando ? '#DC2626' : '#6D28D9',
          boxShadow: hablando ? '0 3px 0 #FCA5A5' : '0 3px 0 #DDD6FE',
          cursor: noSoportado ? 'not-allowed' : 'pointer',
          opacity: noSoportado ? 0.5 : 1,
          whiteSpace: 'nowrap',
        }}>

        {hablando ? (
          <>
            <Square size={15} />
            <Ondas color="#DC2626" />
            <span>Detener</span>
          </>
        ) : (
          <>
            <IconoBocina activo={false} color="#6D28D9" size={16} />
            <span>{etiqueta}</span>
          </>
        )}
      </button>

      {/* Aviso si el navegador no soporta TTS */}
      {noSoportado && (
        <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>
          ⚠️ Tu navegador no soporta lectura en voz alta.
        </p>
      )}
    </div>
  );
};

export default LectorEjercicio;