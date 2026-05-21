'use client';
import React from 'react';

const AvisoDePrivacidad = ({ onNavigateBack }) => {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }} className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg" style={{ border: '2px solid #A7F3D0' }}>
        
        <button 
          onClick={onNavigateBack}
          className="mb-6 text-sm font-bold text-gray-600 hover:text-gray-900"
          style={{ color: '#059669' }}
        >
          &larr; Volver
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-6" style={{ color: '#059669' }}>
          Aviso de Privacidad
        </h1>

        <div className="space-y-6 text-gray-700 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Identidad y domicilio del responsable</h2>
            <p>
              El presente sistema, desarrollado en el marco del Trabajo Terminal de la Escuela Superior de Cómputo del Instituto Politécnico Nacional, es responsable del uso y protección de los datos personales recopilados, operando bajo las normativas aplicables de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Datos personales sometidos a tratamiento</h2>
            <p>El tratamiento de los datos generados por el sistema constituye tratamiento de datos personales en los términos de la LFPDPPP. Los datos recabados incluyen:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Muestras de escritura manuscrita.</li>
              <li>Credenciales de acceso de tutores y alumnos.</li>
              <li>Resultados de análisis ortográfico y caligráfico.</li>
              <li>Métricas de desempeño académico.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Tratamiento de datos de menores de edad</h2>
            <p>
              Dado que los usuarios finales son estudiantes de tercer y cuarto grado de educación primaria, el sistema se somete a un régimen reforzado de protección. En cumplimiento con el Artículo 7 de la LFPDPPP, el consentimiento para tratar datos de menores es otorgado exclusivamente por padres, madres o tutores legales a través del registro en la plataforma. Únicamente el tutor autenticado puede dar de alta alumnos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Finalidades del tratamiento</h2>
            <p>La información recopilada se utilizará exclusivamente con fines educativos para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Proporcionar retroalimentación automatizada sobre legibilidad del trazo manuscrito y ortografía[cite: 3, 4].</li>
              <li>Generar reportes de progreso para el docente o tutor[cite: 14].</li>
              <li>Asignar actividades de refuerzo académico[cite: 5].</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Medidas de seguridad</h2>
            <p>
              En cumplimiento con los Artículos 19 y 20 de la LFPDPPP, el sistema implementa medidas de seguridad técnicas, administrativas y físicas para proteger los datos. Estas incluyen:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Autenticación basada en tokens JWT que impiden el acceso no autorizado.</li>
              <li>Almacenamiento de contraseñas mediante algoritmos de hash BCrypt.</li>
              <li>Separación de roles que garantiza que un alumno solo visualice sus resultados y que únicamente el tutor responsable consulte o modifique los resultados de sus alumnos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Ejercicio de Derechos ARCO</h2>
            <p>
              Para el ejercicio de los derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) por parte de menores de edad, la ley dispone que deberá realizarse a través de su representante legal. El sistema permite al tutor modificar los resultados de los ejercicios de sus alumnos y contempla bajas lógicas en lugar de eliminación física de registros para procesar cancelaciones de datos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AvisoDePrivacidad;