import { useId } from 'react';
import { agruparEjercicios } from './rutaEjercicios';

export default function GruposEjercicios({ ejercicios, renderEjercicio }) {
  const id = useId();

  return (
    <div className="space-y-6">
      {agruparEjercicios(ejercicios).map(grupo => (
        <section key={grupo.id} aria-labelledby={`${id}-${grupo.id}`}>
          <div className="mb-3 flex items-stretch overflow-hidden rounded-2xl border"
            style={{ background: grupo.fondo, borderColor: grupo.acento }}>
            <span aria-hidden="true" className="flex w-14 shrink-0 items-center justify-center text-2xl sm:w-20 sm:text-3xl"
              style={{ background: grupo.acento }}>
              {grupo.icono}
            </span>
            <div className="min-w-0 px-3 py-3 text-slate-800 sm:px-5">
              <h3 id={`${id}-${grupo.id}`} className="font-black leading-tight sm:text-lg">{grupo.titulo}</h3>
              {grupo.letras && (
                <p className="mt-1 text-sm font-bold leading-snug text-slate-700 sm:text-base">{grupo.letras}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grupo.ejercicios.map(renderEjercicio)}
          </div>
        </section>
      ))}
    </div>
  );
}
