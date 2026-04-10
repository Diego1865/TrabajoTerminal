'use client';
import { useState, useEffect , useRef } from 'react';
import { LogOut, UserPlus, Trash2, Loader2 } from 'lucide-react';
import TabEjercicios from './TabEjercicios';

const DashboardTutor = ({ onLogout }) => {
  const [pestañaActiva, setPestañaActiva] = useState('ejercicios');
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '', 
    usuario: '', contrasena: '', grado: '', grupo: ''
  });

  const [usuarioManual, setUsuarioManual] = useState(false);
  const sufijoAleatorio = useRef(Math.floor(Math.random() * 90) + 10);

  // Obtener el ID del tutor desde el almacenamiento local
  const getTutorId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id_usuario;
  };

  // Función para obtener la lista de alumnos
  const fetchAlumnos = async () => {
    const idTutor = getTutorId();
    if (!idTutor) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumnos/tutor/${idTutor}`);
      if (!response.ok) throw new Error('Error al obtener la lista de alumnos');
      const data = await response.json();
      setAlumnos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Cargar alumnos al iniciar o al cambiar a la pestaña de alumnos
  useEffect(() => {
    if (pestañaActiva === 'alumnos') {
      fetchAlumnos();
    }
  }, [pestañaActiva]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'usuario') {
      setUsuarioManual(true);
    }
    
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!usuarioManual && formData.nombre && formData.apellido_paterno) {
      const normalizar = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      };

      const primerNombre = normalizar(formData.nombre).split(' ')[0];
      const prefijoApellido = normalizar(formData.apellido_paterno).substring(0, 2);

      if (primerNombre && prefijoApellido) {
        setFormData((prev) => ({ 
          ...prev, 
          usuario: `${primerNombre}${prefijoApellido}${sufijoAleatorio.current}` 
        }));
      }
    } else if (!usuarioManual && (!formData.nombre || !formData.apellido_paterno)) {
      // Limpia el campo de usuario si se borran el nombre o el apellido
      setFormData((prev) => ({ ...prev, usuario: '' }));
    }
  }, [formData.nombre, formData.apellido_paterno, usuarioManual]);

  const handleAgregarAlumno = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const idTutor = getTutorId();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumnos/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id_tutor: idTutor }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrar alumno');
      }

      // Limpiar formulario y refrescar lista
      setFormData({ nombre: '', apellido_paterno: '', apellido_materno: '', usuario: '', contrasena: '', grado: '', grupo: '' });
      setUsuarioManual(false);
      sufijoAleatorio.current = Math.floor(Math.random() * 90) + 10;
      await fetchAlumnos();
      alert('Alumno registrado con éxito');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDarDeBaja = async (id_alumno) => {
    if (!confirm('¿Está seguro de que desea dar de baja a este alumno?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alumnos/baja/${id_alumno}`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Error al procesar la baja');
      
      await fetchAlumnos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 relative">
      <button 
        onClick={onLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>

      <div className="flex justify-center mb-10 mt-4">
        <div className="flex bg-gray-200 p-1 rounded-full shadow-inner">
          <button
            onClick={() => setPestañaActiva('ejercicios')}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              pestañaActiva === 'ejercicios' ? 'bg-blue-400 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Ejercicios
          </button>
          <button
            onClick={() => setPestañaActiva('alumnos')}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              pestañaActiva === 'alumnos' ? 'bg-blue-400 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Agregar alumnos
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {pestañaActiva === 'ejercicios' && (
            <TabEjercicios idTutor={getTutorId()} />
        )}

        {pestañaActiva === 'alumnos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <UserPlus className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Alta de Alumno</h3>
              </div>
              <form onSubmit={handleAgregarAlumno} className="space-y-4">
                {/* Campos de entrada con estilos oscurecidos */}
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre(s)" required className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} placeholder="Apellido Paterno" required className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                  <input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} placeholder="Apellido Materno" className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                </div>
                <input type="text" name="usuario" value={formData.usuario} onChange={handleInputChange} placeholder="Usuario de acceso" required className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                <input type="password" name="contrasena" value={formData.contrasena} onChange={handleInputChange} placeholder="Contraseña temporal" required className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="grado" value={formData.grado} onChange={handleInputChange} placeholder="Grado" required className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                  <input type="text" name="grupo" value={formData.grupo} onChange={handleInputChange} placeholder="Grupo" className="w-full p-2.5 border border-gray-400 bg-gray-50 text-gray-900 rounded-lg outline-none" />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  {loading ? 'Registrando...' : 'Registrar Alumno'}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Alumnos Inscritos</h3>
              <div className="space-y-3 overflow-y-auto max-h-[500px]">
                {alumnos.map(alumno => (
                  <div key={alumno.id_alumno} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">{alumno.nombre} {alumno.apellido_paterno}</p>
                      <p className="text-xs text-gray-500">Usr: {alumno.usuario} | {alumno.grado} "{alumno.grupo}"</p>
                    </div>
                    <button onClick={() => handleDarDeBaja(alumno.id_alumno)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTutor;