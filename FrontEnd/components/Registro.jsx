'use client';
import { useState } from 'react';
import { CheckCircle, Mail, Lock, User, UserCheck } from 'lucide-react';

const Registro = ({ onRegister, onNavigateLogin }) => {
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateUsername = (username) => {
    if (username.length < 6) return "El nombre de usuario debe tener al menos 6 caracteres.";
    if (/\s/.test(username)) return "El nombre de usuario no puede contener espacios.";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/(?=.*[a-z])/.test(password)) return "La contraseña debe contener al menos una letra minúscula.";
    if (!/(?=.*[A-Z])/.test(password)) return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/(?=.*\d)/.test(password)) return "La contraseña debe contener al menos un número.";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "La contraseña debe contener al menos un carácter especial (@$!%*?&).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!nombre || !username || !email || !password) return;

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    if (usernameError) { setError(usernameError); return; }
    if (passwordError) { setError(passwordError); return; }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Error al registrar usuario');
      if (typeof onNavigateLogin === 'function') onNavigateLogin();
      else if (typeof onRegister === 'function') onRegister();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: '😊 Nombre Tutor', icon: User, type: 'text', placeholder: 'Tu nombre completo', value: nombre, onChange: setNombre, required: true },
    { label: '🧑‍💻 Nombre de Usuario', icon: UserCheck, type: 'text', placeholder: 'usuario_genial123', value: username, onChange: setUsername, required: true },
    { label: '📧 Correo Electrónico', icon: Mail, type: 'email', placeholder: 'correo@ejemplo.com', value: email, onChange: setEmail, required: true },
    { label: '🔒 Contraseña', icon: Lock, type: 'password', placeholder: '••••••••', value: password, onChange: setPassword, required: true },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes float-reg { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .float-r { animation: float-reg 3s ease-in-out infinite; }
        .float-r2 { animation: float-reg 3.8s ease-in-out infinite 0.6s; }
        .float-r3 { animation: float-reg 4.2s ease-in-out infinite 1.2s; }
        .kids-input-g:focus { outline: none; border-color: #059669 !important; box-shadow: 0 0 0 3px rgba(5,150,105,0.2); }
        .btn-green-kids { transition: transform 0.1s, box-shadow 0.1s; }
        .btn-green-kids:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 7px 0 #065F46 !important; }
        .btn-green-kids:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 2px 0 #065F46 !important; }
      `}</style>

      <div className="min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #F0FDF4 0%, #ECFDF5 50%, #F0F9FF 100%)' }}>

        {/* Decoraciones flotantes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
          <span className="absolute float-r" style={{ top: '5%', left: '5%', fontSize: '2rem' }}>🎉</span>
          <span className="absolute float-r2" style={{ top: '10%', right: '7%', fontSize: '1.8rem' }}>⭐</span>
          <span className="absolute float-r3" style={{ bottom: '20%', left: '4%', fontSize: '2rem' }}>🌟</span>
          <span className="absolute float-r" style={{ bottom: '30%', right: '5%', fontSize: '1.7rem' }}>✨</span>
          <span className="absolute float-r2" style={{ top: '40%', left: '2%', fontSize: '1.3rem' }}>🎈</span>
          <span className="absolute float-r3" style={{ top: '60%', right: '3%', fontSize: '1.5rem' }}>💚</span>
        </div>

        <div className="float-r mb-3 select-none" style={{ fontSize: '5rem' }}>🚀</div>
        <p className="font-black mb-6 text-xl" style={{ color: '#059669', letterSpacing: '0.05em' }}>¡CREA TU CUENTA!</p>

        <div className="max-w-md w-full">
          <div className="bg-white p-8"
            style={{
              borderRadius: '28px',
              border: '3px solid #A7F3D0',
              boxShadow: '0 8px 0 #6EE7B7, 0 14px 40px rgba(5,150,105,0.12)'
            }}>

            <div className="text-center mb-7">
              <h2 className="font-black mb-1" style={{ fontSize: '2.2rem', color: '#059669' }}>¡Regístrate! 🎊</h2>
              <p className="font-semibold text-gray-500 text-base">Únete como tutor ahora</p>
            </div>

            {error && (
              <div className="mb-5 p-4 font-bold text-sm flex items-center gap-2"
                style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
                😅 {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-black mb-1.5" style={{ color: '#065F46' }}>{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#059669' }} />
                    <input
                      type={f.type}
                      required={f.required}
                      className="kids-input-g w-full py-3.5 pl-12 pr-4 font-bold text-gray-800 placeholder-gray-400"
                      style={{ border: '2.5px solid #A7F3D0', borderRadius: '14px', background: '#F8FFFE', fontSize: '0.95rem' }}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="btn-green-kids w-full py-4 font-black text-xl text-white flex items-center justify-center gap-2 mt-2"
                style={{
                  borderRadius: '18px',
                  background: loading ? '#6EE7B7' : 'linear-gradient(135deg, #10B981, #059669)',
                  boxShadow: loading ? 'none' : '0 5px 0 #065F46',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? '⏳ Registrando...' : (
                  <><span>¡Crear Cuenta!</span> <CheckCircle size={22} /></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-semibold text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <button onClick={onNavigateLogin} className="font-black hover:underline" style={{ color: '#059669' }}>
                  Inicia sesión 👋
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;