'use client';
import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onLogin, onNavigateRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Error al iniciar sesión');
      localStorage.setItem('token', data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes float-kids { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .float-kids { animation: float-kids 3s ease-in-out infinite; }
        .float-kids-delay { animation: float-kids 3.5s ease-in-out infinite 0.7s; }
        .float-kids-delay2 { animation: float-kids 4s ease-in-out infinite 1.4s; }
        .kids-input:focus { outline: none; border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
        .kids-btn-primary { transition: transform 0.1s, box-shadow 0.1s; }
        .kids-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 7px 0 #4C1D95 !important; }
        .kids-btn-primary:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 2px 0 #4C1D95 !important; }
      `}</style>

      <div className="min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #F5F0FF 0%, #EFF6FF 50%, #F0FDF4 100%)' }}>

        {/* Decoraciones flotantes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
          <span className="absolute float-kids" style={{ top: '6%', left: '4%', fontSize: '2.2rem' }}>⭐</span>
          <span className="absolute float-kids-delay" style={{ top: '12%', right: '6%', fontSize: '1.8rem' }}>🌟</span>
          <span className="absolute float-kids-delay2" style={{ bottom: '22%', left: '3%', fontSize: '2rem' }}>✨</span>
          <span className="absolute float-kids" style={{ bottom: '28%', right: '4%', fontSize: '2.2rem' }}>💫</span>
          <span className="absolute float-kids-delay" style={{ top: '45%', left: '1.5%', fontSize: '1.4rem' }}>🌈</span>
          <span className="absolute float-kids-delay2" style={{ top: '55%', right: '2%', fontSize: '1.6rem' }}>⭐</span>
          <span className="absolute float-kids" style={{ top: '30%', left: '8%', fontSize: '1.2rem' }}>📚</span>
          <span className="absolute float-kids-delay" style={{ bottom: '12%', right: '9%', fontSize: '1.3rem' }}>🎒</span>
        </div>

        {/* Emoji principal flotante */}
        <div className="float-kids mb-3 select-none" style={{ fontSize: '5rem' }}>✏️</div>
        <p className="font-black mb-6 text-xl" style={{ color: '#7C3AED', letterSpacing: '0.05em' }}>¡HORA DE APRENDER!</p>

        <div className="max-w-md w-full">
          <div className="bg-white p-8 relative"
            style={{
              borderRadius: '28px',
              border: '3px solid #DDD6FE',
              boxShadow: '0 8px 0 #C4B5FD, 0 14px 40px rgba(109,40,217,0.12)'
            }}>

            <div className="text-center mb-7">
              <h2 className="font-black mb-1" style={{ fontSize: '2.2rem', color: '#6D28D9' }}>
                ¡Bienvenido! 👋
              </h2>
              <p className="font-semibold text-gray-500 text-base">Ingresa para seguir practicando</p>
            </div>

            {error && (
              <div className="mb-5 p-4 font-bold text-sm flex items-center gap-2"
                style={{ background: '#FFF0F0', border: '2px solid #FCA5A5', borderRadius: '16px', color: '#DC2626' }}>
                😅 {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black mb-2" style={{ color: '#7C3AED' }}>👤 Nombre de Usuario</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#8B5CF6' }} />
                  <input
                    type="text"
                    required
                    className="kids-input w-full py-4 pl-12 pr-4 font-bold text-gray-800 placeholder-gray-400"
                    style={{ border: '2.5px solid #DDD6FE', borderRadius: '16px', background: '#FAFAFA', fontSize: '1rem' }}
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black mb-2" style={{ color: '#7C3AED' }}>🔒 Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#8B5CF6' }} />
                  <input
                    type="password"
                    required
                    className="kids-input w-full py-4 pl-12 pr-4 font-bold text-gray-800 placeholder-gray-400"
                    style={{ border: '2.5px solid #DDD6FE', borderRadius: '16px', background: '#FAFAFA', fontSize: '1rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="kids-btn-primary w-full py-4 font-black text-xl text-white flex items-center justify-center gap-2"
                style={{
                  borderRadius: '18px',
                  background: loading ? '#A78BFA' : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  boxShadow: loading ? 'none' : '0 5px 0 #4C1D95',
                  letterSpacing: '0.02em',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? '⏳ Cargando...' : (
                  <><span>¡Entrar!</span> <span style={{ fontSize: '1.3rem' }}>🚀</span></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-semibold text-gray-600">
                ¿No tienes cuenta?{' '}
                <button onClick={onNavigateRegister} className="font-black hover:underline" style={{ color: '#7C3AED' }}>
                  ¡Regístrate! 🎉
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;