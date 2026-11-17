import { ExternalLink, NotebookPen } from 'lucide-react';

export default function RetroalimentacionEjercicio({ recomendacion }) {
  if (!recomendacion) return null;
  return (
    <section className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 sm:p-5 text-slate-800">
      <div className="flex items-center gap-2 text-violet-800 text-sm font-bold">
        <NotebookPen size={20} aria-hidden="true" /> Retroalimentación · Práctica opcional
      </div>
      <h3 className="mt-2 text-lg font-black">{recomendacion.titulo}</h3>
      <p className="mt-2 text-sm">{recomendacion.motivo}</p>
      <p className="mt-2 text-sm text-violet-800">Puedes practicar a tu ritmo. No tienes que entregar esta actividad y no afecta tu calificación.</p>
      <div className="mt-4 rounded-xl border border-violet-200 bg-white p-3">
        <p className="text-xs font-bold text-violet-800 mb-2">Texto de práctica</p>
        <p className="whitespace-pre-wrap break-words text-lg leading-8">{recomendacion.texto_practica}</p>
      </div>
      <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm">
        {recomendacion.pasos.map((paso, i) => <li key={i}>{paso}</li>)}
      </ol>
      <a href={recomendacion.recurso.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 font-bold text-sm text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
        Abrir recurso para practicar <ExternalLink size={16} aria-hidden="true" />
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
      <p className="mt-2 text-xs text-slate-600">Fuente: {recomendacion.recurso.nombre}. También puedes hacerlo en tu cuaderno con el modelo de arriba.</p>
    </section>
  );
}
