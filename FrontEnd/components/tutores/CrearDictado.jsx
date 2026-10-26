'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

export default function CrearDictado({ token, onCreado, onCerrar }) {
  const [pools, setPools] = useState([]);
  const [poolId, setPoolId] = useState('');
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [propias, setPropias] = useState('');
  const [titulo, setTitulo] = useState('Dictado de palabras');
  const [fecha, setFecha] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const enviando = useRef(false);
  const dialogo = useRef(null);
  const pool = pools.find(item => item.id === poolId);
  const campo = 'w-full rounded-xl border-2 border-violet-200 bg-white p-3 text-gray-800';
  const boton = 'rounded-xl border-2 border-violet-200 px-3 py-2 font-bold text-violet-800 disabled:opacity-40';

  useEffect(() => {
    dialogo.current?.showModal();
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutor/dictados/pools`, {
      headers: { Authorization: `Bearer ${token}` }, signal: controller.signal,
    }).then(async res => {
      if (!res.ok) throw new Error('No se pudo cargar el banco. Puedes agregar palabras propias.');
      const data = await res.json();
      setPools(data);
      setPoolId(data[0]?.id || '');
    }).catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setCargando(false); });
    return () => controller.abort();
  }, [token]);

  function agregar(palabras) {
    const nuevas = [...seleccionadas];
    for (const original of palabras) {
      const palabra = original.trim().normalize('NFC');
      if (!/^[\p{L}]{1,40}$/u.test(palabra)) {
        setError('Usa palabras de hasta 40 letras, sin números ni signos.');
        return false;
      }
      if (!nuevas.some(p => p.toLocaleLowerCase('es') === palabra.toLocaleLowerCase('es'))) nuevas.push(palabra);
    }
    if (nuevas.length > 50) { setError('Puedes seleccionar hasta 50 palabras.'); return false; }
    setSeleccionadas(nuevas);
    setError('');
    return true;
  }

  async function guardar(event) {
    event.preventDefault();
    if (enviando.current) return;
    if (!seleccionadas.length) { setError('Selecciona al menos una palabra.'); return; }
    if (propias.trim()) { setError('Agrega las palabras propias a la selección antes de crear el dictado.'); return; }
    if (fecha && new Date(fecha) <= new Date()) { setError('La fecha límite debe estar en el futuro.'); return; }
    enviando.current = true;
    setGuardando(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutor/dictados`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo.trim(), palabras: seleccionadas,
          fecha_fin: fecha ? new Date(fecha).toISOString() : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Revisa el título y las palabras del dictado.');
      onCreado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      enviando.current = false;
      setGuardando(false);
    }
  }

  return (
    <dialog ref={dialogo} aria-labelledby="titulo-dictado" onCancel={event => {
      event.preventDefault(); if (!guardando) onCerrar();
    }} className="m-auto max-h-[90vh] w-[min(95vw,720px)] overflow-y-auto rounded-3xl border-2 border-violet-200 bg-white p-6 shadow-xl backdrop:bg-black/50">
      <form onSubmit={guardar}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 id="titulo-dictado" className="text-xl font-black text-violet-900">Nuevo dictado</h2>
            <p className="text-sm text-gray-600">Elige un pool o combina palabras de varios bancos.</p>
          </div>
          <button type="button" onClick={onCerrar} disabled={guardando} aria-label="Cerrar" className={boton}><X size={20} /></button>
        </div>
        <fieldset disabled={guardando} className="space-y-4">
          <label className="block font-bold text-gray-700">Título
            <input autoFocus required maxLength={150} value={titulo} onChange={e => setTitulo(e.target.value)} className={campo} />
          </label>
          <label className="block font-bold text-gray-700">Banco de palabras
            <select value={poolId} onChange={e => setPoolId(e.target.value)} disabled={cargando || !pools.length} className={campo}>
              {!pools.length && <option value="">{cargando ? 'Cargando bancos…' : 'Banco no disponible'}</option>}
              {pools.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
            </select>
          </label>
          {pool && <div className="space-y-3 rounded-xl bg-violet-50 p-3">
            <button type="button" className={boton} onClick={() => agregar(pool.palabras)}>Agregar todo el pool</button>
            <div className="flex flex-wrap gap-2">
              {pool.palabras.map(palabra => {
                const elegida = seleccionadas.some(p => p.toLocaleLowerCase('es') === palabra.toLocaleLowerCase('es'));
                return <button key={palabra} type="button" aria-pressed={elegida} className={`${boton} ${elegida ? 'bg-violet-200' : 'bg-white'}`}
                  onClick={() => elegida ? setSeleccionadas(seleccionadas.filter(p => p.toLocaleLowerCase('es') !== palabra.toLocaleLowerCase('es'))) : agregar([palabra])}>
                  {elegida ? '✓ ' : '+ '}{palabra}
                </button>;
              })}
            </div>
          </div>}
          <label className="block font-bold text-gray-700">Palabras propias
            <textarea value={propias} maxLength={2100} onChange={e => setPropias(e.target.value)} className={campo}
              placeholder="Escribe palabras separadas por comas, espacios o saltos de línea" rows={2} />
          </label>
          <button type="button" className={`${boton} flex items-center gap-2`} disabled={!propias.trim()}
            onClick={() => { if (agregar(propias.trim().split(/[\s,;]+/u).filter(Boolean))) setPropias(''); }}><Plus size={16} /> Agregar palabras propias</button>
          <div>
            <h3 className="font-bold text-violet-900">Orden del dictado · {seleccionadas.length}/50 palabras</h3>
            <p className="mb-2 text-sm text-gray-600">Se dictarán en este orden. Quita y vuelve a agregar una palabra para moverla al final.</p>
            {!seleccionadas.length && <p className="text-sm text-gray-500">Aún no has seleccionado palabras.</p>}
            <ol className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {seleccionadas.map((palabra, i) => <li key={palabra}>
                <button type="button" className={boton} aria-label={`Quitar ${palabra}`} onClick={() => setSeleccionadas(seleccionadas.filter(p => p !== palabra))}>
                  {i + 1}. {palabra} ×
                </button>
              </li>)}
            </ol>
          </div>
          <label className="block font-bold text-gray-700">Fecha límite (opcional, hora local)
            <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} className={campo} />
          </label>
        </fieldset>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
        <p className="mt-4 text-sm text-gray-600">Al crear el dictado, estará disponible para todos tus alumnos. Podrás desactivarlo desde Ejercicios.</p>
        <button type="submit" disabled={guardando || !seleccionadas.length || !titulo.trim()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 p-3 font-bold text-white disabled:opacity-50">
          {guardando && <Loader2 className="animate-spin" size={18} />}
          {guardando ? 'Creando dictado…' : 'Crear y activar dictado'}
        </button>
      </form>
    </dialog>
  );
}
