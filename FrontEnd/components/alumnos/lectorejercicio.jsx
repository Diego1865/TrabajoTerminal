'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Square, Turtle, Rabbit } from 'lucide-react';

/* ══════════════════════════════════════════════════
   LectorEjercicio — Lee en voz alta el ejercicio

   Props:
     titulo       string — se lee primero
     descripcion  string — la instrucción
     texto        string — texto guía (no se lee en modo «completar»: daría la respuesta)
     pista        string — se lee al final
     modo         string — evaluacion.modo del ejercicio (copia | completar | imagen)
     etiqueta     string — texto del botón (default: "Escuchar")

   Cada parte se dice por separado con una pausa entre ellas, sin emojis ni
   guiones bajos. El alumno elige la velocidad (lento / normal) y el navegador
   la recuerda.
══════════════════════════════════════════════════ */

const VELOCIDADES = { lento: 0.7, normal: 0.9 };
const CLAVE_VELOCIDAD = 'lector-velocidad';
const PAUSA_MS = 700;

// Quita emojis (la voz diría «emoji de queso…») y los huecos «_» de los ejercicios de completar.
export const textoParaVoz = (texto) => String(texto || '')
  .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}\u{20E3}]/gu, ' ')
  .replace(/_+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Partes que se leen, en orden. En «completar» el texto guía revela la respuesta.
export const partesParaLeer = ({ titulo, descripcion, texto, pista, modo }) =>
  [titulo, descripcion, modo === 'completar' ? '' : texto, pista && `Pista: ${pista}`]
    .map(textoParaVoz)
    .filter(Boolean);

const leerVelocidadGuardada = () => {
  try {
    const v = localStorage.getItem(CLAVE_VELOCIDAD);
    return v in VELOCIDADES ? v : 'lento';
  } catch { return 'lento'; }
};

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

/* ══════════════════════════════════════════════════
   HOOK: useLector — Web Speech API, frase por frase
══════════════════════════════════════════════════ */
const useLector = () => {
  const soportado = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [hablando, setHablando] = useState(false);
  // El lector solo se monta al abrir un ejercicio (en el cliente), así que leer localStorage aquí es seguro.
  const [velocidad, setVelocidadEstado] = useState(leerVelocidadGuardada);
  const turnoRef = useRef(0);       // invalida lecturas anteriores al detener o volver a empezar
  const pausaRef = useRef(null);

  const setVelocidad = useCallback((v) => {
    setVelocidadEstado(v);
    try { localStorage.setItem(CLAVE_VELOCIDAD, v); } catch { /* sin almacenamiento: solo dura esta sesión */ }
  }, []);

  const detener = useCallback(() => {
    turnoRef.current += 1;
    clearTimeout(pausaRef.current);
    if (soportado) window.speechSynthesis.cancel();
    setHablando(false);
  }, [soportado]);

  /* Detener al desmontar */
  useEffect(() => detener, [detener]);

  const leer = useCallback((frases) => {
    if (!soportado || !frases.length) return;
    detener();
    const turno = turnoRef.current;
    const sintesis = window.speechSynthesis;

    const vozEspanol = () => {
      const voces = sintesis.getVoices();
      return voces.find(v => v.lang === 'es-MX') || voces.find(v => v.lang.startsWith('es')) || null;
    };

    const decir = (i) => {
      if (turno !== turnoRef.current) return;
      if (i >= frases.length) { setHablando(false); return; }
      const utter = new SpeechSynthesisUtterance(frases[i]);
      utter.lang  = 'es-MX';
      utter.rate  = VELOCIDADES[velocidad];
      utter.pitch = 1.05;
      const voz = vozEspanol();
      if (voz) utter.voice = voz;
      const siguiente = () => { pausaRef.current = setTimeout(() => decir(i + 1), PAUSA_MS); };
      utter.onend   = siguiente;
      utter.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') siguiente(); };
      sintesis.speak(utter);
    };

    setHablando(true);
    if (sintesis.getVoices().length > 0) { decir(0); return; }
    // Las voces cargan de forma asíncrona; algunos navegadores nunca avisan, así que hay un respaldo.
    let iniciado = false;
    const iniciar = () => { if (!iniciado) { iniciado = true; sintesis.onvoiceschanged = null; decir(0); } };
    sintesis.onvoiceschanged = iniciar;
    setTimeout(iniciar, 500);
  }, [soportado, detener, velocidad]);

  return { hablando, leer, detener, soportado, velocidad, setVelocidad };
};

/* ── Selector lento / normal ── */
const BotonVelocidad = ({ activo, onClick, children, titulo }) => (
  <button type="button" onClick={onClick} aria-pressed={activo} title={titulo}
    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-black transition-all"
    style={{
      borderRadius: '10px',
      background: activo ? '#7C3AED' : 'transparent',
      color: activo ? 'white' : '#7C3AED',
      fontFamily: 'inherit', border: 'none', cursor: 'pointer',
    }}>
    {children}
  </button>
);

/* ══════════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════════ */
const LectorEjercicio = ({
  texto       = '',
  titulo      = '',
  descripcion = '',
  pista       = '',
  modo        = '',
  etiqueta    = 'Escuchar',
}) => {
  const { hablando, leer, detener, soportado, velocidad, setVelocidad } = useLector();
  const frases = partesParaLeer({ titulo, descripcion, texto, pista, modo });

  if (!soportado) {
    return (
      <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>
        ⚠️ Tu navegador no soporta lectura en voz alta.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => (hablando ? detener() : leer(frases))}
        className="flex items-center gap-2 px-4 py-2.5 font-black text-sm transition-all hover:scale-105 active:scale-95"
        style={{
          borderRadius: '14px',
          background: hablando ? '#FEF2F2' : '#F5F3FF',
          border: `2.5px solid ${hablando ? '#FCA5A5' : '#DDD6FE'}`,
          color: hablando ? '#DC2626' : '#6D28D9',
          boxShadow: hablando ? '0 3px 0 #FCA5A5' : '0 3px 0 #DDD6FE',
          fontFamily: 'inherit',
          cursor: 'pointer',
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
            <Volume2 size={16} />
            <span>{etiqueta}</span>
          </>
        )}
      </button>

      <div role="group" aria-label="Velocidad de lectura" className="flex items-center gap-0.5 p-0.5"
        style={{ borderRadius: '12px', border: '2px solid #DDD6FE', background: 'white' }}>
        <BotonVelocidad activo={velocidad === 'lento'} onClick={() => setVelocidad('lento')} titulo="Leer despacio">
          <Turtle size={15} /> Lento
        </BotonVelocidad>
        <BotonVelocidad activo={velocidad === 'normal'} onClick={() => setVelocidad('normal')} titulo="Leer a velocidad normal">
          <Rabbit size={15} /> Normal
        </BotonVelocidad>
      </div>
    </div>
  );
};

export default LectorEjercicio;
