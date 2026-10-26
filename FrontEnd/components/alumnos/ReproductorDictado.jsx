'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, Square } from 'lucide-react';

export default function ReproductorDictado({ palabras = [] }) {
  const [indice, setIndice] = useState(0);
  const [hablando, setHablando] = useState(false);
  const [error, setError] = useState('');
  const [escuchadas, setEscuchadas] = useState(() => new Set());
  const vozActual = useRef(null);
  const boton = 'rounded-xl border-2 border-violet-200 bg-white px-4 py-2 font-bold text-violet-800 disabled:opacity-40';

  useEffect(() => () => {
    if (vozActual.current) {
      vozActual.current.onend = null;
      vozActual.current.onerror = null;
      window.speechSynthesis?.cancel();
    }
  }, []);

  function detener() {
    if (vozActual.current) {
      vozActual.current.onend = null;
      vozActual.current.onerror = null;
    }
    window.speechSynthesis?.cancel();
    setHablando(false);
  }

  function escuchar() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setError('Este navegador no puede reproducir el dictado. Pide a tu profesor que lo lea en voz alta.');
      return;
    }
    detener();
    setError('');
    const voz = new SpeechSynthesisUtterance(palabras[indice]);
    const voces = window.speechSynthesis.getVoices();
    const vozEspanol = voces.find(v => v.lang.toLowerCase() === 'es-mx') || voces.find(v => v.lang.startsWith('es'));
    if (vozEspanol) voz.voice = vozEspanol;
    voz.lang = 'es-MX';
    voz.rate = 0.8;
    voz.onend = () => {
      setHablando(false);
      setEscuchadas(prev => new Set(prev).add(indice));
    };
    voz.onerror = () => {
      setHablando(false);
      setError('No se pudo reproducir el audio. Inténtalo otra vez o pide ayuda a tu profesor.');
    };
    vozActual.current = voz;
    setHablando(true);
    window.speechSynthesis.speak(voz);
  }

  if (!palabras.length) return <p role="alert">Este dictado no tiene palabras. Consulta a tu profesor.</p>;

  return <section aria-label="Reproductor del dictado" className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
    <p aria-live="polite" className="font-black text-violet-900">Palabra {indice + 1} de {palabras.length}</p>
    <p className="mb-3 text-sm text-gray-600">Escucha y escribe sin numerar. Avanza cuando estés listo; puedes repetir el audio.</p>
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={boton} disabled={indice === 0} onClick={() => { detener(); setIndice(indice - 1); }}>Anterior</button>
      <button type="button" className={`${boton} flex items-center gap-2`} onClick={hablando ? detener : escuchar}>
        {hablando ? <Square size={18} /> : <Volume2 size={18} />}
        {hablando ? 'Detener' : escuchadas.has(indice) ? 'Repetir palabra' : 'Escuchar palabra'}
      </button>
      <button type="button" className={boton} disabled={indice === palabras.length - 1} onClick={() => { detener(); setIndice(indice + 1); }}>Siguiente</button>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <p className="mt-3 text-sm text-gray-600" aria-live="polite">
      {escuchadas.size === palabras.length ? 'Ya escuchaste todas las palabras. Revisa tu escritura y envía tu ejercicio.' : `${escuchadas.size} de ${palabras.length} palabras escuchadas.`}
    </p>
  </section>;
}
