/*
 * Implementa el componente TipoEjercicioBadge y muestra una parte de la interfaz.
 */

const TIPOS = {
  Legibilidad: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8', emoji: '✍️' },
  Ortografía:  { bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46', emoji: '📝' },
  Mixto:       { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E', emoji: '🎯' },
};

export default function TipoEjercicioBadge({ tipo }) {
  const { bg, border, color, emoji } = TIPOS[tipo] ?? { bg: '#F3F4F6', border: '#E5E7EB', color: '#374151', emoji: '📋' };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black"
      style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: '8px', color }}>
      {emoji} {tipo}
    </span>
  );
}
