'use client';
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle } from 'lucide-react';

const CapturaEscritura = () => {
    const [imagenPreview, setImagenPreview] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Manejar la selección de archivos

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        procesarArchivo(file);
    };


    // Función central para validar y previsualizar 

    const procesarArchivo = (file) => {
        setError('');
        if (!file) return;

        // Validación 1: Tipo de archivo
        if (!file.type.startsWith('image/')) {
        setError('¡Ups! Solo podemos leer imágenes (fotos).');
        return;
        }

        // Validación 2: Tamaño (ejemplo: max 5MB para evitar cargas lentas)
        if (file.size > 5 * 1024 * 1024) {
        setError('La imagen es muy grande. Pide ayuda para reducirla.');
        return;
        }

        // Crear previsualización para el usuario (Feedback inmediato)
        const reader = new FileReader();
        reader.onloadend = () => {
        setImagenPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Simulación de envío al Controlador (Backend) [cite: 90]
    const enviarCaptura = () => {
        if (!imagenPreview) {
        setError('Primero debes tomar una foto de tu tarea.');
        return;
    }

    alert("¡Tarea enviada! Ahora la revisaremos.");
    };


    const limpiarCaptura = () => {

    setImagenPreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = "";

    };


    return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border-2 border-blue-100">
    <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
    ¡Sube tu Escritura!
    </h2>

    {/* Área de Visualización */}

    <div className="mb-6 flex flex-col items-center justify-center min-h-[200px] border-dashed border-4 border-blue-200 rounded-lg bg-blue-50 relative">

            {imagenPreview ? (
            <div className="relative w-full h-full">
                    <img 
                    src={imagenPreview} 
                    alt="Tu escritura" 
                    className="w-full h-64 object-contain rounded-lg"
                    />
                    <button 
                        onClick={limpiarCaptura}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                    <X size={24} />
                    </button>
            </div>
            ) : (
            <div className="text-center p-4 text-gray-500">
                <p>Aquí aparecerá tu hoja</p>
            </div>
            )}
        </div>


        {/* Mensajes de Error (Validación Cliente)  */}

        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
            {error}
            </div>
        )}

        {/* Controles de Entrada */}

        <div className="grid grid-cols-2 gap-4 mb-4">
        
            {/* Botón Cámara (Input nativo captura móvil) */}

            <button 
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors cursor-pointer text-blue-700"
            >
            <Camera size={32} className="mb-2" />
            <span className="font-bold">Tomar Foto</span>
            </button>

            {/* Botón Subir Archivo */}

            <button 
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors cursor-pointer text-green-700"
            >
            <Upload size={32} className="mb-2" />
            <span className="font-bold">Subir Archivo</span>
            </button>   

            {/* Input oculto que maneja ambos casos */}

            <input 
                type="file" 
                accept="image/*" 
                capture="environment" // Fuerza la cámara trasera en móviles
                ref={fileInputRef}

                onChange={handleFileChange}
                className="hidden"
            />

        </div>

        {/* Botón de Acción Principal */}

        <button
            onClick={enviarCaptura}
            disabled={!imagenPreview}
            className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2

            ${imagenPreview 

                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
        <CheckCircle/>
                Enviar para Revisión
        </button>
    </div>
    );

    };


    export default CapturaEscritura; 