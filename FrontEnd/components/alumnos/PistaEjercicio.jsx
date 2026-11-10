// Pista para el alumno, escrita en lenguaje infantil (contenido_base.pedagogia.pista).
const PistaEjercicio = ({ pista }) => {
  if (!pista) return null;
  return (
    <div className="mb-3 flex items-start gap-2 px-3 py-2.5"
      style={{ background: '#FFFBEB', border: '2px solid #FDE68A', borderRadius: '14px' }}>
      <span aria-hidden="true" style={{ fontSize: '1.1rem', lineHeight: 1.3 }}>💡</span>
      <p className="text-sm font-bold" style={{ color: '#92400E', lineHeight: 1.45 }}>
        <span className="font-black">Pista: </span>{pista}
      </p>
    </div>
  );
};

export default PistaEjercicio;
