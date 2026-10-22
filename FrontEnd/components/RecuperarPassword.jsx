'use client';
import { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react';

// Recuperación por correo, solo para tutores. A los alumnos se la restablece su tutor.
const RecuperarPassword = ({ onNavigateLogin }) => {
  const [correo, setCorreo] = useState('');
  const [tokenVerificacion, setTokenVerificacion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const validatePassword = (password) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/(?=.*[a-z])/.test(password)) return "La contraseña debe contener al menos una letra minúscula.";
    if (!/(?=.*[A-Z])/.test(password)) return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/(?=.*\d)/.test(password)) return "La contraseña debe contener al menos un número.";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "La contraseña debe contener al menos un carácter especial (@$!%*?&).";
    return "";
  };

  const enviar = async (ruta, body) => {
    const response = await fetch(`${API_URL}/api/auth/${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Revisa los datos e intenta de nuevo.');
    return data;
  };

  const solicitarCodigo = async (e) => {
    e?.preventDefault();
    setError(''); setAviso('');
    if (!correo) return;
    setLoading(true);
    try {
      const data = await enviar('recuperar/codigo', { correo });
      setTokenVerificacion(data.token_verificacion);
      setAviso(`${data.message} Revisa también la carpeta de spam.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setError('');
    const passwordError = validatePassword(nueva);
    if (passwordError) return setError(passwordError);
    if (nueva !== confirmacion) return setError('Las contraseñas no coinciden.');
    setLoading(true);
    try {
      const data = await enviar('recuperar/cambiar', { correo, codigo, token_verificacion: tokenVerificacion, nueva_contrasena: nueva });
      alert(data.message);
      onNavigateLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClase = "kids-input w-full py-4 pl-12 pr-4 font-bold text-gray-800 placeholder-gray-400";
  const inputEstilo = { border: '2.5px solid #DDD6FE', borderRadius: '16px', background: '#FAFAFA', fontSize: '1rem' };
  const iconoEstilo = { color: '#8B5CF6' };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .kids-input:focus { outline: none; border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
        .kids-btn-primary { transition: transform 0.1s, box-shadow 0.1s; }
        .kids-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 7px 0 #4C1D95 !important; }
        .kids-btn-primary:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 2px 0 #4C1D95 !important; }
      `}</style>

      <div className="min-h-screen flex flex-col justify-center items-center p-4"
        style={{ background: 'linear-gradient(145deg, #F5F0FF 0%, #EFF6FF 50%, #F0FDF4 100%)' }}>

        <div className="mb-3 select-none" style={{ fontSize: '4.5rem' }}>🔑</div>

        <div className="max-w-md w-full">
          <div className="bg-white p-8"
            style={{ borderRadius: '28px', border: '3px solid #DDD6FE', boxShadow: '0 8px 0 #C4B5FD, 0 14px 40px rgba(109,40,217,0.12)' }}>

            <div className="text-center mb-6">
              <h2 className="font-black mb-1" style={{ fontSize: '1.9rem', color: '#6D28D9' }}>Recuperar contraseña</h2>
              <p className="font-semibold text-gray-500 text-sm">
                {tokenVerificacion
                  ? 'Escribe el código que te enviamos y tu nueva contraseña.'
                  : 'Escribe el correo de tu cuenta de tutor y te enviaremos un código.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 font-bold text-sm"
                style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
                😅 {error}
              </div>
            )}
            {aviso && !error && (
              <div className="mb-5 p-4 font-bold text-sm"
                style={{ background: '#ECFDF5', border: '2px solid #A7F3D0', borderRadius: '16px', color: '#065F46' }}>
                📧 {aviso}
              </div>
            )}

            <form onSubmit={tokenVerificacion ? cambiarPassword : solicitarCodigo} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={iconoEstilo} />
                <input type="email" required placeholder="correo@ejemplo.com" value={correo}
                  onChange={(e) => setCorreo(e.target.value)} disabled={loading || !!tokenVerificacion}
                  className={inputClase} style={inputEstilo} />
              </div>

              {tokenVerificacion && (
                <>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={iconoEstilo} />
                    <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required
                      placeholder="Código de 6 dígitos" value={codigo}
                      onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} disabled={loading}
                      className={`${inputClase} tracking-widest`} style={inputEstilo} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={iconoEstilo} />
                    <input type="password" required placeholder="Nueva contraseña" value={nueva}
                      onChange={(e) => setNueva(e.target.value)} disabled={loading}
                      className={inputClase} style={inputEstilo} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={iconoEstilo} />
                    <input type="password" required placeholder="Repite la nueva contraseña" value={confirmacion}
                      onChange={(e) => setConfirmacion(e.target.value)} disabled={loading}
                      className={inputClase} style={inputEstilo} />
                  </div>
                </>
              )}

              <button type="submit" disabled={loading}
                className="kids-btn-primary w-full py-4 font-black text-lg text-white"
                style={{
                  borderRadius: '18px',
                  background: loading ? '#A78BFA' : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  boxShadow: loading ? 'none' : '0 5px 0 #4C1D95',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? '⏳ Un momento...' : tokenVerificacion ? 'Cambiar contraseña' : 'Enviar código'}
              </button>
            </form>

            {tokenVerificacion && (
              <div className="flex justify-between mt-3 text-sm font-black">
                <button type="button" onClick={solicitarCodigo} disabled={loading} className="hover:underline" style={{ color: '#7C3AED' }}>
                  Reenviar código
                </button>
                <button type="button" onClick={() => { setTokenVerificacion(''); setCodigo(''); setAviso(''); setError(''); }}
                  disabled={loading} className="hover:underline" style={{ color: '#6B7280' }}>
                  Usar otro correo
                </button>
              </div>
            )}

            <p className="mt-5 text-xs font-semibold text-gray-400 text-center">
              ¿Eres alumno? Pídele a tu maestro que te asigne una contraseña nueva.
            </p>

            <div className="mt-4 text-center">
              <button onClick={onNavigateLogin} className="font-black hover:underline inline-flex items-center gap-1" style={{ color: '#7C3AED' }}>
                <ArrowLeft size={16} /> Volver a iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;
