(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/CapturaEscritura.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'lucide-react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const CapturaEscritura = ()=>{
    _s();
    const [imagenPreview, setImagenPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Manejar la selección de archivos
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        procesarArchivo(file);
    };
    // Función central para validar y previsualizar 
    const procesarArchivo = (file)=>{
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
        reader.onloadend = ()=>{
            setImagenPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    // Simulación de envío al Controlador (Backend) [cite: 90]
    const enviarCaptura = ()=>{
        if (!imagenPreview) {
            setError('Primero debes tomar una foto de tu tarea.');
            return;
        }
        console.log("Enviando imagen al Controlador...");
        alert("¡Tarea enviada! Ahora la revisaremos.");
    };
    const limpiarCaptura = ()=>{
        setImagenPreview(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border-2 border-blue-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold text-center text-blue-600 mb-4",
                children: "¡Sube tu Escritura!"
            }, void 0, false, {
                fileName: "[project]/components/CapturaEscritura.jsx",
                lineNumber: 69,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-col items-center justify-center min-h-[200px] border-dashed border-4 border-blue-200 rounded-lg bg-blue-50 relative",
                children: imagenPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: imagenPreview,
                            alt: "Tu escritura",
                            className: "w-full h-64 object-contain rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/components/CapturaEscritura.jsx",
                            lineNumber: 79,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: limpiarCaptura,
                            className: "absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(X, {
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/components/CapturaEscritura.jsx",
                                lineNumber: 88,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/CapturaEscritura.jsx",
                            lineNumber: 84,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CapturaEscritura.jsx",
                    lineNumber: 78,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-4 text-gray-500",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Aquí aparecerá tu hoja"
                    }, void 0, false, {
                        fileName: "[project]/components/CapturaEscritura.jsx",
                        lineNumber: 93,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/CapturaEscritura.jsx",
                    lineNumber: 92,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/CapturaEscritura.jsx",
                lineNumber: 75,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/CapturaEscritura.jsx",
                lineNumber: 102,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>fileInputRef.current.click(),
                        className: "flex flex-col items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors cursor-pointer text-blue-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Camera, {
                                size: 32,
                                className: "mb-2"
                            }, void 0, false, {
                                fileName: "[project]/components/CapturaEscritura.jsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold",
                                children: "Tomar Foto"
                            }, void 0, false, {
                                fileName: "[project]/components/CapturaEscritura.jsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CapturaEscritura.jsx",
                        lineNumber: 113,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>fileInputRef.current.click(),
                        className: "flex flex-col items-center justify-center p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors cursor-pointer text-green-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Upload, {
                                size: 32,
                                className: "mb-2"
                            }, void 0, false, {
                                fileName: "[project]/components/CapturaEscritura.jsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold",
                                children: "Subir Archivo"
                            }, void 0, false, {
                                fileName: "[project]/components/CapturaEscritura.jsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CapturaEscritura.jsx",
                        lineNumber: 123,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "file",
                        accept: "image/*",
                        capture: "environment",
                        ref: fileInputRef,
                        onChange: handleFileChange,
                        className: "hidden"
                    }, void 0, false, {
                        fileName: "[project]/components/CapturaEscritura.jsx",
                        lineNumber: 133,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/CapturaEscritura.jsx",
                lineNumber: 109,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: enviarCaptura,
                disabled: !imagenPreview,
                className: `w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2

            ${imagenPreview ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircle, {}, void 0, false, {
                        fileName: "[project]/components/CapturaEscritura.jsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Enviar para Revisión"
                ]
            }, void 0, true, {
                fileName: "[project]/components/CapturaEscritura.jsx",
                lineNumber: 147,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/CapturaEscritura.jsx",
        lineNumber: 68,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CapturaEscritura, "DnQCnM/Bi7B8lubD81eaPwb6Dpo=");
_c = CapturaEscritura;
const __TURBOPACK__default__export__ = CapturaEscritura;
var _c;
__turbopack_context__.k.register(_c, "CapturaEscritura");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/LienzoDigital.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$sketch$2d$canvas$2f$dist$2f$react$2d$sketch$2d$canvas$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-sketch-canvas/dist/react-sketch-canvas.esm.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'lucide-react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const LienzoDigital = ({ alTerminar })=>{
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [esBorrador, setEsBorrador] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Configuración del pincel
    const estilos = {
        border: '4px solid #d1d5db',
        borderRadius: '10px'
    };
    // Función para obtener la imagen y enviarla
    const exportarDibujo = async ()=>{
        try {
            // Exporta el dibujo como imagen PNG
            const imagenDataUrl = await canvasRef.current.exportImage('png');
            console.log("Dibujo exportado para OCR");
            // Aquí pasaríamos la imagen al componente padre o al backend
            if (alTerminar) {
                alTerminar(imagenDataUrl);
            } else {
                alert("¡Dibujo capturado! Listo para enviar al modelo de IA.");
            }
        } catch (e) {
            console.error("Error al exportar", e);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center w-full max-w-2xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setEsBorrador(false);
                            canvasRef.current.eraseMode(false);
                        },
                        className: `p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${!esBorrador ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pen, {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Escribir"
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setEsBorrador(true);
                            canvasRef.current.eraseMode(true);
                        },
                        className: `p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${esBorrador ? 'bg-pink-100 text-pink-700 font-bold' : 'hover:bg-gray-100'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Eraser, {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Borrar"
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px bg-gray-300 mx-2"
                    }, void 0, false, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>canvasRef.current.undo(),
                        className: "p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-gray-100 text-gray-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RotateCcw, {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Deshacer"
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>canvasRef.current.clearCanvas(),
                        className: "p-3 rounded-lg flex flex-col items-center gap-1 hover:bg-red-50 text-red-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Trash2, {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: "Limpiar"
                            }, void 0, false, {
                                fileName: "[project]/components/LienzoDigital.jsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/LienzoDigital.jsx",
                lineNumber: 39,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-80 shadow-inner bg-white rounded-xl overflow-hidden relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 pointer-events-none opacity-20",
                        style: {
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                            backgroundSize: '100% 40px',
                            marginTop: '30px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$sketch$2d$canvas$2f$dist$2f$react$2d$sketch$2d$canvas$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactSketchCanvas"], {
                        ref: canvasRef,
                        style: estilos,
                        strokeWidth: 4,
                        strokeColor: "black",
                        canvasColor: "transparent"
                    }, void 0, false, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/LienzoDigital.jsx",
                lineNumber: 76,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: exportarDibujo,
                className: "mt-6 w-full max-w-xs py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircle, {}, void 0, false, {
                        fileName: "[project]/components/LienzoDigital.jsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Terminar y Revisar"
                ]
            }, void 0, true, {
                fileName: "[project]/components/LienzoDigital.jsx",
                lineNumber: 92,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/LienzoDigital.jsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(LienzoDigital, "l381dqlL9phTytUrQjtka4EHTA0=");
_c = LienzoDigital;
const __TURBOPACK__default__export__ = LienzoDigital;
var _c;
__turbopack_context__.k.register(_c, "LienzoDigital");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CapturaEscritura$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CapturaEscritura.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LienzoDigital$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LienzoDigital.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Home() {
    _s();
    const [modo, setModo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('camara'); // 'camara' o 'lienzo'
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-gray-50 flex flex-col items-center p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold text-blue-800 mb-2",
                children: "Aprende a Escribir"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600 mb-8",
                children: "Práctica para 3º y 4º de Primaria"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex bg-white p-1 rounded-xl shadow-sm border border-blue-100 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setModo('camara'),
                        className: `px-6 py-2 rounded-lg font-medium transition-all ${modo === 'camara' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                        children: "Subir Foto"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setModo('lienzo'),
                        className: `px-6 py-2 rounded-lg font-medium transition-all ${modo === 'lienzo' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                        children: "Escribir Aquí"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-2xl",
                children: modo === 'camara' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CapturaEscritura$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 35,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LienzoDigital$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    alTerminar: (img)=>console.log("Imagen recibida:", img)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 37,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_s(Home, "HoO06DWAi3IJISX/L4voz4oAH1M=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/react-sketch-canvas/dist/react-sketch-canvas.esm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Canvas",
    ()=>Canvas,
    "ReactSketchCanvas",
    ()=>ReactSketchCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
var runtime = {
    exports: {}
};
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function(module) {
    var runtime = function(exports) {
        var Op = Object.prototype;
        var hasOwn = Op.hasOwnProperty;
        var undefined$1; // More compressible than void 0.
        var $Symbol = typeof Symbol === "function" ? Symbol : {};
        var iteratorSymbol = $Symbol.iterator || "@@iterator";
        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
        function define(obj, key, value) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            return obj[key];
        }
        try {
            // IE 8 has a broken Object.defineProperty that only works on DOM objects.
            define({}, "");
        } catch (err) {
            define = function(obj, key, value) {
                return obj[key] = value;
            };
        }
        function wrap(innerFn, outerFn, self, tryLocsList) {
            // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
            var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
            var generator = Object.create(protoGenerator.prototype);
            var context = new Context(tryLocsList || []);
            // The ._invoke method unifies the implementations of the .next,
            // .throw, and .return methods.
            generator._invoke = makeInvokeMethod(innerFn, self, context);
            return generator;
        }
        exports.wrap = wrap;
        // Try/catch helper to minimize deoptimizations. Returns a completion
        // record like context.tryEntries[i].completion. This interface could
        // have been (and was previously) designed to take a closure to be
        // invoked without arguments, but in all the cases we care about we
        // already have an existing method we want to call, so there's no need
        // to create a new function object. We can even get away with assuming
        // the method takes exactly one argument, since that happens to be true
        // in every case, so we don't have to touch the arguments object. The
        // only additional allocation required is the completion record, which
        // has a stable shape and so hopefully should be cheap to allocate.
        function tryCatch(fn, obj, arg) {
            try {
                return {
                    type: "normal",
                    arg: fn.call(obj, arg)
                };
            } catch (err) {
                return {
                    type: "throw",
                    arg: err
                };
            }
        }
        var GenStateSuspendedStart = "suspendedStart";
        var GenStateSuspendedYield = "suspendedYield";
        var GenStateExecuting = "executing";
        var GenStateCompleted = "completed";
        // Returning this object from the innerFn has the same effect as
        // breaking out of the dispatch switch statement.
        var ContinueSentinel = {};
        // Dummy constructor functions that we use as the .constructor and
        // .constructor.prototype properties for functions that return Generator
        // objects. For full spec compliance, you may wish to configure your
        // minifier not to mangle the names of these two functions.
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        // This is a polyfill for %IteratorPrototype% for environments that
        // don't natively support it.
        var IteratorPrototype = {};
        define(IteratorPrototype, iteratorSymbol, function() {
            return this;
        });
        var getProto = Object.getPrototypeOf;
        var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
            // This environment has a native %IteratorPrototype%; use it instead
            // of the polyfill.
            IteratorPrototype = NativeIteratorPrototype;
        }
        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
        GeneratorFunction.prototype = GeneratorFunctionPrototype;
        define(Gp, "constructor", GeneratorFunctionPrototype);
        define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
        GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");
        // Helper for defining the .next, .throw, and .return methods of the
        // Iterator interface in terms of a single ._invoke method.
        function defineIteratorMethods(prototype) {
            [
                "next",
                "throw",
                "return"
            ].forEach(function(method) {
                define(prototype, method, function(arg) {
                    return this._invoke(method, arg);
                });
            });
        }
        exports.isGeneratorFunction = function(genFun) {
            var ctor = typeof genFun === "function" && genFun.constructor;
            return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
        };
        exports.mark = function(genFun) {
            if (Object.setPrototypeOf) {
                Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
            } else {
                genFun.__proto__ = GeneratorFunctionPrototype;
                define(genFun, toStringTagSymbol, "GeneratorFunction");
            }
            genFun.prototype = Object.create(Gp);
            return genFun;
        };
        // Within the body of any async function, `await x` is transformed to
        // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
        // `hasOwn.call(value, "__await")` to determine if the yielded value is
        // meant to be awaited.
        exports.awrap = function(arg) {
            return {
                __await: arg
            };
        };
        function AsyncIterator(generator, PromiseImpl) {
            function invoke(method, arg, resolve, reject) {
                var record = tryCatch(generator[method], generator, arg);
                if (record.type === "throw") {
                    reject(record.arg);
                } else {
                    var result = record.arg;
                    var value = result.value;
                    if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
                        return PromiseImpl.resolve(value.__await).then(function(value) {
                            invoke("next", value, resolve, reject);
                        }, function(err) {
                            invoke("throw", err, resolve, reject);
                        });
                    }
                    return PromiseImpl.resolve(value).then(function(unwrapped) {
                        // When a yielded Promise is resolved, its final value becomes
                        // the .value of the Promise<{value,done}> result for the
                        // current iteration.
                        result.value = unwrapped;
                        resolve(result);
                    }, function(error) {
                        // If a rejected Promise was yielded, throw the rejection back
                        // into the async generator function so it can be handled there.
                        return invoke("throw", error, resolve, reject);
                    });
                }
            }
            var previousPromise;
            function enqueue(method, arg) {
                function callInvokeWithMethodAndArg() {
                    return new PromiseImpl(function(resolve, reject) {
                        invoke(method, arg, resolve, reject);
                    });
                }
                return previousPromise = // If enqueue has been called before, then we want to wait until
                // all previous Promises have been resolved before calling invoke,
                // so that results are always delivered in the correct order. If
                // enqueue has not been called before, then it is important to
                // call invoke immediately, without waiting on a callback to fire,
                // so that the async generator function has the opportunity to do
                // any necessary setup in a predictable way. This predictability
                // is why the Promise constructor synchronously invokes its
                // executor callback, and why async functions synchronously
                // execute code before the first await. Since we implement simple
                // async functions in terms of async generators, it is especially
                // important to get this right, even though it requires care.
                previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
                // invocations of the iterator.
                callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
            }
            // Define the unified helper method that is used to implement .next,
            // .throw, and .return (see defineIteratorMethods).
            this._invoke = enqueue;
        }
        defineIteratorMethods(AsyncIterator.prototype);
        define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
            return this;
        });
        exports.AsyncIterator = AsyncIterator;
        // Note that simple async functions are implemented on top of
        // AsyncIterator objects; they just return a Promise for the value of
        // the final result produced by the iterator.
        exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
            if (PromiseImpl === void 0) PromiseImpl = Promise;
            var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
            return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
             : iter.next().then(function(result) {
                return result.done ? result.value : iter.next();
            });
        };
        function makeInvokeMethod(innerFn, self, context) {
            var state = GenStateSuspendedStart;
            return function invoke(method, arg) {
                if (state === GenStateExecuting) {
                    throw new Error("Generator is already running");
                }
                if (state === GenStateCompleted) {
                    if (method === "throw") {
                        throw arg;
                    }
                    // Be forgiving, per 25.3.3.3.3 of the spec:
                    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                    return doneResult();
                }
                context.method = method;
                context.arg = arg;
                while(true){
                    var delegate = context.delegate;
                    if (delegate) {
                        var delegateResult = maybeInvokeDelegate(delegate, context);
                        if (delegateResult) {
                            if (delegateResult === ContinueSentinel) continue;
                            return delegateResult;
                        }
                    }
                    if (context.method === "next") {
                        // Setting context._sent for legacy support of Babel's
                        // function.sent implementation.
                        context.sent = context._sent = context.arg;
                    } else if (context.method === "throw") {
                        if (state === GenStateSuspendedStart) {
                            state = GenStateCompleted;
                            throw context.arg;
                        }
                        context.dispatchException(context.arg);
                    } else if (context.method === "return") {
                        context.abrupt("return", context.arg);
                    }
                    state = GenStateExecuting;
                    var record = tryCatch(innerFn, self, context);
                    if (record.type === "normal") {
                        // If an exception is thrown from innerFn, we leave state ===
                        // GenStateExecuting and loop back for another invocation.
                        state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                        if (record.arg === ContinueSentinel) {
                            continue;
                        }
                        return {
                            value: record.arg,
                            done: context.done
                        };
                    } else if (record.type === "throw") {
                        state = GenStateCompleted;
                        // Dispatch the exception by looping back around to the
                        // context.dispatchException(context.arg) call above.
                        context.method = "throw";
                        context.arg = record.arg;
                    }
                }
            };
        }
        // Call delegate.iterator[context.method](context.arg) and handle the
        // result, either by returning a { value, done } result from the
        // delegate iterator, or by modifying context.method and context.arg,
        // setting context.delegate to null, and returning the ContinueSentinel.
        function maybeInvokeDelegate(delegate, context) {
            var method = delegate.iterator[context.method];
            if (method === undefined$1) {
                // A .throw or .return when the delegate iterator has no .throw
                // method always terminates the yield* loop.
                context.delegate = null;
                if (context.method === "throw") {
                    // Note: ["return"] must be used for ES3 parsing compatibility.
                    if (delegate.iterator["return"]) {
                        // If the delegate iterator has a return method, give it a
                        // chance to clean up.
                        context.method = "return";
                        context.arg = undefined$1;
                        maybeInvokeDelegate(delegate, context);
                        if (context.method === "throw") {
                            // If maybeInvokeDelegate(context) changed context.method from
                            // "return" to "throw", let that override the TypeError below.
                            return ContinueSentinel;
                        }
                    }
                    context.method = "throw";
                    context.arg = new TypeError("The iterator does not provide a 'throw' method");
                }
                return ContinueSentinel;
            }
            var record = tryCatch(method, delegate.iterator, context.arg);
            if (record.type === "throw") {
                context.method = "throw";
                context.arg = record.arg;
                context.delegate = null;
                return ContinueSentinel;
            }
            var info = record.arg;
            if (!info) {
                context.method = "throw";
                context.arg = new TypeError("iterator result is not an object");
                context.delegate = null;
                return ContinueSentinel;
            }
            if (info.done) {
                // Assign the result of the finished delegate to the temporary
                // variable specified by delegate.resultName (see delegateYield).
                context[delegate.resultName] = info.value;
                // Resume execution at the desired location (see delegateYield).
                context.next = delegate.nextLoc;
                // If context.method was "throw" but the delegate handled the
                // exception, let the outer generator proceed normally. If
                // context.method was "next", forget context.arg since it has been
                // "consumed" by the delegate iterator. If context.method was
                // "return", allow the original .return call to continue in the
                // outer generator.
                if (context.method !== "return") {
                    context.method = "next";
                    context.arg = undefined$1;
                }
            } else {
                // Re-yield the result returned by the delegate method.
                return info;
            }
            // The delegate iterator is finished, so forget it and continue with
            // the outer generator.
            context.delegate = null;
            return ContinueSentinel;
        }
        // Define Generator.prototype.{next,throw,return} in terms of the
        // unified ._invoke helper method.
        defineIteratorMethods(Gp);
        define(Gp, toStringTagSymbol, "Generator");
        // A Generator should always return itself as the iterator object when the
        // @@iterator function is called on it. Some browsers' implementations of the
        // iterator prototype chain incorrectly implement this, causing the Generator
        // object to not be returned from this call. This ensures that doesn't happen.
        // See https://github.com/facebook/regenerator/issues/274 for more details.
        define(Gp, iteratorSymbol, function() {
            return this;
        });
        define(Gp, "toString", function() {
            return "[object Generator]";
        });
        function pushTryEntry(locs) {
            var entry = {
                tryLoc: locs[0]
            };
            if (1 in locs) {
                entry.catchLoc = locs[1];
            }
            if (2 in locs) {
                entry.finallyLoc = locs[2];
                entry.afterLoc = locs[3];
            }
            this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
            var record = entry.completion || {};
            record.type = "normal";
            delete record.arg;
            entry.completion = record;
        }
        function Context(tryLocsList) {
            // The root entry object (effectively a try statement without a catch
            // or a finally block) gives us a place to store values thrown from
            // locations where there is no enclosing try statement.
            this.tryEntries = [
                {
                    tryLoc: "root"
                }
            ];
            tryLocsList.forEach(pushTryEntry, this);
            this.reset(true);
        }
        exports.keys = function(object) {
            var keys = [];
            for(var key in object){
                keys.push(key);
            }
            keys.reverse();
            // Rather than returning an object with a next method, we keep
            // things simple and return the next function itself.
            return function next() {
                while(keys.length){
                    var key = keys.pop();
                    if (key in object) {
                        next.value = key;
                        next.done = false;
                        return next;
                    }
                }
                // To avoid creating an additional object, we just hang the .value
                // and .done properties off the next function object itself. This
                // also ensures that the minifier will not anonymize the function.
                next.done = true;
                return next;
            };
        };
        function values(iterable) {
            if (iterable) {
                var iteratorMethod = iterable[iteratorSymbol];
                if (iteratorMethod) {
                    return iteratorMethod.call(iterable);
                }
                if (typeof iterable.next === "function") {
                    return iterable;
                }
                if (!isNaN(iterable.length)) {
                    var i = -1, next = function next() {
                        while(++i < iterable.length){
                            if (hasOwn.call(iterable, i)) {
                                next.value = iterable[i];
                                next.done = false;
                                return next;
                            }
                        }
                        next.value = undefined$1;
                        next.done = true;
                        return next;
                    };
                    return next.next = next;
                }
            }
            // Return an iterator with no values.
            return {
                next: doneResult
            };
        }
        exports.values = values;
        function doneResult() {
            return {
                value: undefined$1,
                done: true
            };
        }
        Context.prototype = {
            constructor: Context,
            reset: function(skipTempReset) {
                this.prev = 0;
                this.next = 0;
                // Resetting context._sent for legacy support of Babel's
                // function.sent implementation.
                this.sent = this._sent = undefined$1;
                this.done = false;
                this.delegate = null;
                this.method = "next";
                this.arg = undefined$1;
                this.tryEntries.forEach(resetTryEntry);
                if (!skipTempReset) {
                    for(var name in this){
                        // Not sure about the optimal order of these conditions:
                        if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                            this[name] = undefined$1;
                        }
                    }
                }
            },
            stop: function() {
                this.done = true;
                var rootEntry = this.tryEntries[0];
                var rootRecord = rootEntry.completion;
                if (rootRecord.type === "throw") {
                    throw rootRecord.arg;
                }
                return this.rval;
            },
            dispatchException: function(exception) {
                if (this.done) {
                    throw exception;
                }
                var context = this;
                function handle(loc, caught) {
                    record.type = "throw";
                    record.arg = exception;
                    context.next = loc;
                    if (caught) {
                        // If the dispatched exception was caught by a catch block,
                        // then let that catch block handle the exception normally.
                        context.method = "next";
                        context.arg = undefined$1;
                    }
                    return !!caught;
                }
                for(var i = this.tryEntries.length - 1; i >= 0; --i){
                    var entry = this.tryEntries[i];
                    var record = entry.completion;
                    if (entry.tryLoc === "root") {
                        // Exception thrown outside of any try block that could handle
                        // it, so set the completion value of the entire function to
                        // throw the exception.
                        return handle("end");
                    }
                    if (entry.tryLoc <= this.prev) {
                        var hasCatch = hasOwn.call(entry, "catchLoc");
                        var hasFinally = hasOwn.call(entry, "finallyLoc");
                        if (hasCatch && hasFinally) {
                            if (this.prev < entry.catchLoc) {
                                return handle(entry.catchLoc, true);
                            } else if (this.prev < entry.finallyLoc) {
                                return handle(entry.finallyLoc);
                            }
                        } else if (hasCatch) {
                            if (this.prev < entry.catchLoc) {
                                return handle(entry.catchLoc, true);
                            }
                        } else if (hasFinally) {
                            if (this.prev < entry.finallyLoc) {
                                return handle(entry.finallyLoc);
                            }
                        } else {
                            throw new Error("try statement without catch or finally");
                        }
                    }
                }
            },
            abrupt: function(type, arg) {
                for(var i = this.tryEntries.length - 1; i >= 0; --i){
                    var entry = this.tryEntries[i];
                    if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                        var finallyEntry = entry;
                        break;
                    }
                }
                if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                    // Ignore the finally entry if control is not jumping to a
                    // location outside the try/catch block.
                    finallyEntry = null;
                }
                var record = finallyEntry ? finallyEntry.completion : {};
                record.type = type;
                record.arg = arg;
                if (finallyEntry) {
                    this.method = "next";
                    this.next = finallyEntry.finallyLoc;
                    return ContinueSentinel;
                }
                return this.complete(record);
            },
            complete: function(record, afterLoc) {
                if (record.type === "throw") {
                    throw record.arg;
                }
                if (record.type === "break" || record.type === "continue") {
                    this.next = record.arg;
                } else if (record.type === "return") {
                    this.rval = this.arg = record.arg;
                    this.method = "return";
                    this.next = "end";
                } else if (record.type === "normal" && afterLoc) {
                    this.next = afterLoc;
                }
                return ContinueSentinel;
            },
            finish: function(finallyLoc) {
                for(var i = this.tryEntries.length - 1; i >= 0; --i){
                    var entry = this.tryEntries[i];
                    if (entry.finallyLoc === finallyLoc) {
                        this.complete(entry.completion, entry.afterLoc);
                        resetTryEntry(entry);
                        return ContinueSentinel;
                    }
                }
            },
            "catch": function(tryLoc) {
                for(var i = this.tryEntries.length - 1; i >= 0; --i){
                    var entry = this.tryEntries[i];
                    if (entry.tryLoc === tryLoc) {
                        var record = entry.completion;
                        if (record.type === "throw") {
                            var thrown = record.arg;
                            resetTryEntry(entry);
                        }
                        return thrown;
                    }
                }
                // The context.catch method must only be called with a location
                // argument that corresponds to a known catch block.
                throw new Error("illegal catch attempt");
            },
            delegateYield: function(iterable, resultName, nextLoc) {
                this.delegate = {
                    iterator: values(iterable),
                    resultName: resultName,
                    nextLoc: nextLoc
                };
                if (this.method === "next") {
                    // Deliberately forget the last sent value so that we don't
                    // accidentally pass it on to the delegate.
                    this.arg = undefined$1;
                }
                return ContinueSentinel;
            }
        };
        // Regardless of whether this script is executing as a CommonJS module
        // or not, return the runtime object so that we can declare the variable
        // regeneratorRuntime in the outer scope, which allows this module to be
        // injected easily by `bin/regenerator --include-runtime script.js`.
        return exports;
    }(// If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports);
    try {
        regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
        // This module should not be running in strict mode, so the above
        // assignment should always work unless something is misconfigured. Just
        // in case runtime.js accidentally runs in strict mode, in modern engines
        // we can explicitly access globalThis. In older engines we can escape
        // strict mode using a global Function call. This could conceivably fail
        // if a Content Security Policy forbids using Function, but in that case
        // the proper solution is to fix the accidental strict mode problem. If
        // you've misconfigured your bundler to force strict mode and applied a
        // CSP to forbid Function, and you're not willing to fix either of those
        // problems, please detail your unique predicament in a GitHub issue.
        if (typeof globalThis === "object") {
            globalThis.regeneratorRuntime = runtime;
        } else {
            Function("r", "regeneratorRuntime = r")(runtime);
        }
    }
})(runtime);
var _regeneratorRuntime = runtime.exports;
/**
 * Generate SVG Path tag from the given points
 */ var SvgPath = function SvgPath(_ref) {
    var paths = _ref.paths, id = _ref.id, strokeWidth = _ref.strokeWidth, strokeColor = _ref.strokeColor, _ref$command = _ref.command, command = _ref$command === void 0 ? bezierCommand : _ref$command;
    if (paths.length === 1) {
        var _paths$ = paths[0], x = _paths$.x, y = _paths$.y;
        var radius = strokeWidth / 2;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("circle", {
            key: id,
            id: id,
            cx: x,
            cy: y,
            r: radius,
            stroke: strokeColor,
            fill: strokeColor
        });
    }
    var d = paths.reduce(function(acc, point, i, a) {
        return i === 0 ? "M " + point.x + "," + point.y : acc + " " + command(point, i, a);
    }, '');
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        key: id,
        id: id,
        d: d,
        fill: "none",
        strokeLinecap: "round",
        stroke: strokeColor,
        strokeWidth: strokeWidth
    });
};
var line = function line(pointA, pointB) {
    var lengthX = pointB.x - pointA.x;
    var lengthY = pointB.y - pointA.y;
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    };
};
var controlPoint = function controlPoint(controlPoints) {
    var current = controlPoints.current, next = controlPoints.next, previous = controlPoints.previous, reverse = controlPoints.reverse;
    var p = previous || current;
    var n = next || current;
    var smoothing = 0.2;
    var o = line(p, n);
    var angle = o.angle + (reverse ? Math.PI : 0);
    var length = o.length * smoothing;
    var x = current.x + Math.cos(angle) * length;
    var y = current.y + Math.sin(angle) * length;
    return [
        x,
        y
    ];
};
var bezierCommand = function bezierCommand(point, i, a) {
    var cpsX = null;
    var cpsY = null;
    switch(i){
        case 0:
            var _controlPoint = controlPoint({
                current: point
            });
            cpsX = _controlPoint[0];
            cpsY = _controlPoint[1];
            break;
        case 1:
            var _controlPoint2 = controlPoint({
                current: a[i - 1],
                next: point
            });
            cpsX = _controlPoint2[0];
            cpsY = _controlPoint2[1];
            break;
        default:
            var _controlPoint3 = controlPoint({
                current: a[i - 1],
                previous: a[i - 2],
                next: point
            });
            cpsX = _controlPoint3[0];
            cpsY = _controlPoint3[1];
            break;
    }
    var _controlPoint4 = controlPoint({
        current: point,
        previous: a[i - 1],
        next: a[i + 1],
        reverse: true
    }), cpeX = _controlPoint4[0], cpeY = _controlPoint4[1];
    return "C " + cpsX + "," + cpsY + " " + cpeX + "," + cpeY + " " + point.x + ", " + point.y;
};
var Paths = function Paths(_ref2) {
    var id = _ref2.id, paths = _ref2.paths;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, paths.map(function(path, index) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SvgPath, {
            key: id + "__" + index,
            paths: path.paths,
            id: id + "__" + index,
            strokeWidth: path.strokeWidth,
            strokeColor: path.strokeColor,
            command: bezierCommand
        });
    }));
};
var loadImage = function loadImage(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.addEventListener('load', function() {
            if (img.width > 0) {
                resolve(img);
            }
            reject('Image not found');
        });
        img.addEventListener('error', function(err) {
            return reject(err);
        });
        img.src = url;
        img.setAttribute('crossorigin', 'anonymous');
    });
};
function getCanvasWithViewBox(canvas) {
    var _canvas$firstChild;
    var svgCanvas = (_canvas$firstChild = canvas.firstChild) == null ? void 0 : _canvas$firstChild.cloneNode(true);
    var width = canvas.offsetWidth;
    var height = canvas.offsetHeight;
    svgCanvas.setAttribute('viewBox', "0 0 " + width + " " + height);
    svgCanvas.setAttribute('width', width.toString());
    svgCanvas.setAttribute('height', height.toString());
    return {
        svgCanvas: svgCanvas,
        width: width,
        height: height
    };
}
var Canvas = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function(props, ref) {
    var paths = props.paths, isDrawing = props.isDrawing, onPointerDown = props.onPointerDown, onPointerMove = props.onPointerMove, onPointerUp = props.onPointerUp, _props$id = props.id, id = _props$id === void 0 ? 'react-sketch-canvas' : _props$id, _props$width = props.width, width = _props$width === void 0 ? '100%' : _props$width, _props$height = props.height, height = _props$height === void 0 ? '100%' : _props$height, _props$className = props.className, className = _props$className === void 0 ? 'react-sketch-canvas' : _props$className, _props$canvasColor = props.canvasColor, canvasColor = _props$canvasColor === void 0 ? 'red' : _props$canvasColor, _props$backgroundImag = props.backgroundImage, backgroundImage = _props$backgroundImag === void 0 ? '' : _props$backgroundImag, _props$exportWithBack = props.exportWithBackgroundImage, exportWithBackgroundImage = _props$exportWithBack === void 0 ? false : _props$exportWithBack, _props$preserveBackgr = props.preserveBackgroundImageAspectRatio, preserveBackgroundImageAspectRatio = _props$preserveBackgr === void 0 ? 'none' : _props$preserveBackgr, _props$allowOnlyPoint = props.allowOnlyPointerType, allowOnlyPointerType = _props$allowOnlyPoint === void 0 ? 'all' : _props$allowOnlyPoint, _props$style = props.style, style = _props$style === void 0 ? {
        border: '0.0625rem solid #9c9c9c',
        borderRadius: '0.25rem'
    } : _props$style, _props$svgStyle = props.svgStyle, svgStyle = _props$svgStyle === void 0 ? {} : _props$svgStyle;
    var canvasRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null); // Converts mouse coordinates to relative coordinate based on the absolute position of svg
    var getCoordinates = function getCoordinates(pointerEvent) {
        var _canvasRef$current, _window$scrollX, _window$scrollY;
        var boundingArea = (_canvasRef$current = canvasRef.current) == null ? void 0 : _canvasRef$current.getBoundingClientRect();
        var scrollLeft = (_window$scrollX = window.scrollX) != null ? _window$scrollX : 0;
        var scrollTop = (_window$scrollY = window.scrollY) != null ? _window$scrollY : 0;
        if (!boundingArea) {
            return {
                x: 0,
                y: 0
            };
        }
        var point = {
            x: pointerEvent.pageX - boundingArea.left - scrollLeft,
            y: pointerEvent.pageY - boundingArea.top - scrollTop
        };
        return point;
    };
    /* Mouse Handlers - Mouse down, move and up */ var handlePointerDown = function handlePointerDown(event) {
        // Allow only chosen pointer type
        if (allowOnlyPointerType !== 'all' && event.pointerType !== allowOnlyPointerType) {
            return;
        }
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        var point = getCoordinates(event);
        onPointerDown(point);
    };
    var handlePointerMove = function handlePointerMove(event) {
        if (!isDrawing) return; // Allow only chosen pointer type
        if (allowOnlyPointerType !== 'all' && event.pointerType !== allowOnlyPointerType) {
            return;
        }
        var point = getCoordinates(event);
        onPointerMove(point);
    };
    var handlePointerUp = function handlePointerUp(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return; // Allow only chosen pointer type
        if (allowOnlyPointerType !== 'all' && event.pointerType !== allowOnlyPointerType) {
            return;
        }
        onPointerUp();
    };
    /* Mouse Handlers ends */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"](ref, {
        "Canvas.useImperativeHandle": function() {
            return {
                exportImage: function exportImage(imageType) {
                    return new Promise(/*#__PURE__*/ ({
                        "Canvas.useImperativeHandle.exportImage": function() {
                            var _ref = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime.mark(function _callee(resolve, reject) {
                                var canvas, _getCanvasWithViewBox, svgCanvas, _width, _height, canvasSketch, loadImagePromises, img;
                                return _regeneratorRuntime.wrap(function _callee$(_context) {
                                    while(1){
                                        switch(_context.prev = _context.next){
                                            case 0:
                                                _context.prev = 0;
                                                canvas = canvasRef.current;
                                                if (canvas) {
                                                    _context.next = 4;
                                                    break;
                                                }
                                                throw Error('Canvas not rendered yet');
                                            case 4:
                                                _getCanvasWithViewBox = getCanvasWithViewBox(canvas), svgCanvas = _getCanvasWithViewBox.svgCanvas, _width = _getCanvasWithViewBox.width, _height = _getCanvasWithViewBox.height;
                                                canvasSketch = "data:image/svg+xml;base64," + btoa(svgCanvas.outerHTML);
                                                _context.next = 8;
                                                return loadImage(canvasSketch);
                                            case 8:
                                                _context.t0 = _context.sent;
                                                loadImagePromises = [
                                                    _context.t0
                                                ];
                                                if (!exportWithBackgroundImage) {
                                                    _context.next = 21;
                                                    break;
                                                }
                                                _context.prev = 11;
                                                _context.next = 14;
                                                return loadImage(backgroundImage);
                                            case 14:
                                                img = _context.sent;
                                                loadImagePromises.push(img);
                                                _context.next = 21;
                                                break;
                                            case 18:
                                                _context.prev = 18;
                                                _context.t1 = _context["catch"](11);
                                                console.warn('exportWithBackgroundImage props is set without a valid background image URL. This option is ignored');
                                            case 21:
                                                Promise.all(loadImagePromises).then({
                                                    "Canvas.useImperativeHandle.exportImage._ref._callee._callee$": function(images) {
                                                        var renderCanvas = document.createElement('canvas');
                                                        renderCanvas.setAttribute('width', _width.toString());
                                                        renderCanvas.setAttribute('height', _height.toString());
                                                        var context = renderCanvas.getContext('2d');
                                                        if (!context) {
                                                            throw Error('Canvas not rendered yet');
                                                        }
                                                        images.reverse().forEach({
                                                            "Canvas.useImperativeHandle.exportImage._ref._callee._callee$": function(image) {
                                                                context.drawImage(image, 0, 0);
                                                            }
                                                        }["Canvas.useImperativeHandle.exportImage._ref._callee._callee$"]);
                                                        resolve(renderCanvas.toDataURL("image/" + imageType));
                                                    }
                                                }["Canvas.useImperativeHandle.exportImage._ref._callee._callee$"])["catch"]({
                                                    "Canvas.useImperativeHandle.exportImage._ref._callee._callee$": function(e) {
                                                        throw e;
                                                    }
                                                }["Canvas.useImperativeHandle.exportImage._ref._callee._callee$"]);
                                                _context.next = 27;
                                                break;
                                            case 24:
                                                _context.prev = 24;
                                                _context.t2 = _context["catch"](0);
                                                reject(_context.t2);
                                            case 27:
                                            case "end":
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, null, [
                                    [
                                        0,
                                        24
                                    ],
                                    [
                                        11,
                                        18
                                    ]
                                ]);
                            }));
                            return ({
                                "Canvas.useImperativeHandle.exportImage": function(_x, _x2) {
                                    return _ref.apply(this, arguments);
                                }
                            })["Canvas.useImperativeHandle.exportImage"];
                        }
                    })["Canvas.useImperativeHandle.exportImage"]());
                },
                exportSvg: function exportSvg() {
                    return new Promise({
                        "Canvas.useImperativeHandle.exportSvg": function(resolve, reject) {
                            try {
                                var _canvasRef$current2;
                                var canvas = (_canvasRef$current2 = canvasRef.current) != null ? _canvasRef$current2 : null;
                                if (canvas !== null) {
                                    var _svgCanvas$querySelec, _svgCanvas$querySelec2;
                                    var _getCanvasWithViewBox2 = getCanvasWithViewBox(canvas), svgCanvas = _getCanvasWithViewBox2.svgCanvas;
                                    if (exportWithBackgroundImage) {
                                        resolve(svgCanvas.outerHTML);
                                        return;
                                    }
                                    (_svgCanvas$querySelec = svgCanvas.querySelector("#" + id + "__background")) == null ? void 0 : _svgCanvas$querySelec.remove();
                                    (_svgCanvas$querySelec2 = svgCanvas.querySelector("#" + id + "__canvas-background")) == null ? void 0 : _svgCanvas$querySelec2.setAttribute('fill', canvasColor);
                                    resolve(svgCanvas.outerHTML);
                                }
                                reject(new Error('Canvas not loaded'));
                            } catch (e) {
                                reject(e);
                            }
                        }
                    }["Canvas.useImperativeHandle.exportSvg"]);
                }
            };
        }
    }["Canvas.useImperativeHandle"]);
    /* Add event listener to Mouse up and Touch up to
  release drawing even when point goes out of canvas */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "Canvas.useEffect": function() {
            document.addEventListener('pointerup', handlePointerUp);
            return ({
                "Canvas.useEffect": function() {
                    document.removeEventListener('pointerup', handlePointerUp);
                }
            })["Canvas.useEffect"];
        }
    }["Canvas.useEffect"], [
        handlePointerUp
    ]);
    var eraserPaths = paths.filter(function(path) {
        return !path.drawMode;
    });
    var currentGroup = 0;
    var pathGroups = paths.reduce(function(arrayGroup, path) {
        if (!path.drawMode) {
            currentGroup += 1;
            return arrayGroup;
        }
        if (arrayGroup[currentGroup] === undefined) {
            arrayGroup[currentGroup] = [];
        }
        arrayGroup[currentGroup].push(path);
        return arrayGroup;
    }, [
        []
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("div", {
        role: "presentation",
        ref: canvasRef,
        className: className,
        style: _extends({
            touchAction: 'none',
            width: width,
            height: height
        }, style),
        "touch-action": "none",
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", {
        version: "1.1",
        baseProfile: "full",
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
        style: _extends({
            width: '100%',
            height: '100%'
        }, svgStyle),
        id: id
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        id: id + "__eraser-stroke-group",
        display: "none"
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
        id: id + "__mask-background",
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        fill: "white"
    }), eraserPaths.map(function(eraserPath, i) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SvgPath, {
            key: id + "__eraser-" + i,
            id: id + "__eraser-" + i,
            paths: eraserPath.paths,
            strokeColor: "#000000",
            strokeWidth: eraserPath.strokeWidth
        });
    })), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("defs", null, backgroundImage && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("pattern", {
        id: id + "__background",
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        patternUnits: "userSpaceOnUse"
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("image", {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        xlinkHref: backgroundImage,
        preserveAspectRatio: preserveBackgroundImageAspectRatio
    })), eraserPaths.map(function(_, i) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("mask", {
            id: id + "__eraser-mask-" + i,
            key: id + "__eraser-mask-" + i,
            maskUnits: "userSpaceOnUse"
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("use", {
            href: "#" + id + "__mask-background"
        }), Array.from({
            length: eraserPaths.length - i
        }, function(_, j) {
            return j + i;
        }).map(function(k) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("use", {
                key: k.toString(),
                href: "#" + id + "__eraser-" + k.toString()
            });
        }));
    })), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        id: id + "__canvas-background-group"
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
        id: id + "__canvas-background",
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        fill: backgroundImage ? "url(#" + id + "__background)" : canvasColor
    })), pathGroups.map(function(pathGroup, i) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
            id: id + "__stroke-group-" + i,
            key: id + "__stroke-group-" + i,
            mask: "url(#" + id + "__eraser-mask-" + i + ")"
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Paths, {
            id: id,
            paths: pathGroup
        }));
    })));
});
var ReactSketchCanvas = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function(props, ref) {
    var _props$id = props.id, id = _props$id === void 0 ? 'react-sketch-canvas' : _props$id, _props$width = props.width, width = _props$width === void 0 ? '100%' : _props$width, _props$height = props.height, height = _props$height === void 0 ? '100%' : _props$height, _props$className = props.className, className = _props$className === void 0 ? '' : _props$className, _props$canvasColor = props.canvasColor, canvasColor = _props$canvasColor === void 0 ? 'white' : _props$canvasColor, _props$strokeColor = props.strokeColor, strokeColor = _props$strokeColor === void 0 ? 'red' : _props$strokeColor, _props$backgroundImag = props.backgroundImage, backgroundImage = _props$backgroundImag === void 0 ? '' : _props$backgroundImag, _props$exportWithBack = props.exportWithBackgroundImage, exportWithBackgroundImage = _props$exportWithBack === void 0 ? false : _props$exportWithBack, _props$preserveBackgr = props.preserveBackgroundImageAspectRatio, preserveBackgroundImageAspectRatio = _props$preserveBackgr === void 0 ? 'none' : _props$preserveBackgr, _props$strokeWidth = props.strokeWidth, strokeWidth = _props$strokeWidth === void 0 ? 4 : _props$strokeWidth, _props$eraserWidth = props.eraserWidth, eraserWidth = _props$eraserWidth === void 0 ? 8 : _props$eraserWidth, _props$allowOnlyPoint = props.allowOnlyPointerType, allowOnlyPointerType = _props$allowOnlyPoint === void 0 ? 'all' : _props$allowOnlyPoint, _props$style = props.style, style = _props$style === void 0 ? {
        border: '0.0625rem solid #9c9c9c',
        borderRadius: '0.25rem'
    } : _props$style, _props$svgStyle = props.svgStyle, svgStyle = _props$svgStyle === void 0 ? {} : _props$svgStyle, _props$onChange = props.onChange, onChange = _props$onChange === void 0 ? function(_paths) {} : _props$onChange, _props$onStroke = props.onStroke, onStroke = _props$onStroke === void 0 ? function(_path, _isEraser) {} : _props$onStroke, _props$withTimestamp = props.withTimestamp, withTimestamp = _props$withTimestamp === void 0 ? false : _props$withTimestamp;
    var svgCanvas = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRef"]();
    var _React$useState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](true), drawMode = _React$useState[0], setDrawMode = _React$useState[1];
    var _React$useState2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false), isDrawing = _React$useState2[0], setIsDrawing = _React$useState2[1];
    var _React$useState3 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]), resetStack = _React$useState3[0], setResetStack = _React$useState3[1];
    var _React$useState4 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]), undoStack = _React$useState4[0], setUndoStack = _React$useState4[1];
    var _React$useState5 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]), currentPaths = _React$useState5[0], setCurrentPaths = _React$useState5[1];
    var liftStrokeUp = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ReactSketchCanvas.useCallback[liftStrokeUp]": function() {
            var _currentPaths$slice$, _currentPaths$slice;
            var lastStroke = (_currentPaths$slice$ = (_currentPaths$slice = currentPaths.slice(-1)) == null ? void 0 : _currentPaths$slice[0]) != null ? _currentPaths$slice$ : null;
            if (lastStroke === null) {
                console.warn('No stroke found!');
                return;
            }
            onStroke(lastStroke, !lastStroke.drawMode);
        }
    }["ReactSketchCanvas.useCallback[liftStrokeUp]"], [
        isDrawing
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ReactSketchCanvas.useEffect": function() {
            liftStrokeUp();
        }
    }["ReactSketchCanvas.useEffect"], [
        isDrawing
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ReactSketchCanvas.useEffect": function() {
            onChange(currentPaths);
        }
    }["ReactSketchCanvas.useEffect"], [
        currentPaths
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"](ref, {
        "ReactSketchCanvas.useImperativeHandle": function() {
            return {
                eraseMode: function eraseMode(erase) {
                    setDrawMode(!erase);
                },
                clearCanvas: function clearCanvas() {
                    setResetStack([].concat(currentPaths));
                    setCurrentPaths([]);
                },
                undo: function undo() {
                    // If there was a last reset then
                    if (resetStack.length !== 0) {
                        setCurrentPaths([].concat(resetStack));
                        setResetStack([]);
                        return;
                    }
                    setUndoStack({
                        "ReactSketchCanvas.useImperativeHandle.undo": function(undoStack) {
                            return [].concat(undoStack, currentPaths.slice(-1));
                        }
                    }["ReactSketchCanvas.useImperativeHandle.undo"]);
                    setCurrentPaths({
                        "ReactSketchCanvas.useImperativeHandle.undo": function(currentPaths) {
                            return currentPaths.slice(0, -1);
                        }
                    }["ReactSketchCanvas.useImperativeHandle.undo"]);
                },
                redo: function redo() {
                    // Nothing to Redo
                    if (undoStack.length === 0) return;
                    setCurrentPaths({
                        "ReactSketchCanvas.useImperativeHandle.redo": function(currentPaths) {
                            return [].concat(currentPaths, undoStack.slice(-1));
                        }
                    }["ReactSketchCanvas.useImperativeHandle.redo"]);
                    setUndoStack({
                        "ReactSketchCanvas.useImperativeHandle.redo": function(undoStack) {
                            return undoStack.slice(0, -1);
                        }
                    }["ReactSketchCanvas.useImperativeHandle.redo"]);
                },
                exportImage: function exportImage(imageType) {
                    var _svgCanvas$current;
                    var exportImage = (_svgCanvas$current = svgCanvas.current) == null ? void 0 : _svgCanvas$current.exportImage;
                    if (!exportImage) {
                        throw Error('Export function called before canvas loaded');
                    } else {
                        return exportImage(imageType);
                    }
                },
                exportSvg: function exportSvg() {
                    return new Promise({
                        "ReactSketchCanvas.useImperativeHandle.exportSvg": function(resolve, reject) {
                            var _svgCanvas$current2;
                            var exportSvg = (_svgCanvas$current2 = svgCanvas.current) == null ? void 0 : _svgCanvas$current2.exportSvg;
                            if (!exportSvg) {
                                reject(Error('Export function called before canvas loaded'));
                            } else {
                                exportSvg().then({
                                    "ReactSketchCanvas.useImperativeHandle.exportSvg": function(data) {
                                        resolve(data);
                                    }
                                }["ReactSketchCanvas.useImperativeHandle.exportSvg"])["catch"]({
                                    "ReactSketchCanvas.useImperativeHandle.exportSvg": function(e) {
                                        reject(e);
                                    }
                                }["ReactSketchCanvas.useImperativeHandle.exportSvg"]);
                            }
                        }
                    }["ReactSketchCanvas.useImperativeHandle.exportSvg"]);
                },
                exportPaths: function exportPaths() {
                    return new Promise({
                        "ReactSketchCanvas.useImperativeHandle.exportPaths": function(resolve, reject) {
                            try {
                                resolve(currentPaths);
                            } catch (e) {
                                reject(e);
                            }
                        }
                    }["ReactSketchCanvas.useImperativeHandle.exportPaths"]);
                },
                loadPaths: function loadPaths(paths) {
                    setCurrentPaths({
                        "ReactSketchCanvas.useImperativeHandle.loadPaths": function(currentPaths) {
                            return [].concat(currentPaths, paths);
                        }
                    }["ReactSketchCanvas.useImperativeHandle.loadPaths"]);
                },
                getSketchingTime: function getSketchingTime() {
                    return new Promise({
                        "ReactSketchCanvas.useImperativeHandle.getSketchingTime": function(resolve, reject) {
                            if (!withTimestamp) {
                                reject(new Error("Set 'withTimestamp' prop to get sketching time"));
                            }
                            try {
                                var sketchingTime = currentPaths.reduce({
                                    "ReactSketchCanvas.useImperativeHandle.getSketchingTime.sketchingTime": function(totalSketchingTime, path) {
                                        var _path$startTimestamp, _path$endTimestamp;
                                        var startTimestamp = (_path$startTimestamp = path.startTimestamp) != null ? _path$startTimestamp : 0;
                                        var endTimestamp = (_path$endTimestamp = path.endTimestamp) != null ? _path$endTimestamp : 0;
                                        return totalSketchingTime + (endTimestamp - startTimestamp);
                                    }
                                }["ReactSketchCanvas.useImperativeHandle.getSketchingTime.sketchingTime"], 0);
                                resolve(sketchingTime);
                            } catch (e) {
                                reject(e);
                            }
                        }
                    }["ReactSketchCanvas.useImperativeHandle.getSketchingTime"]);
                },
                resetCanvas: function resetCanvas() {
                    setResetStack([]);
                    setUndoStack([]);
                    setCurrentPaths([]);
                }
            };
        }
    }["ReactSketchCanvas.useImperativeHandle"]);
    var handlePointerDown = function handlePointerDown(point) {
        setIsDrawing(true);
        setUndoStack([]);
        var stroke = {
            drawMode: drawMode,
            strokeColor: drawMode ? strokeColor : '#000000',
            strokeWidth: drawMode ? strokeWidth : eraserWidth,
            paths: [
                point
            ]
        };
        if (withTimestamp) {
            stroke = _extends({}, stroke, {
                startTimestamp: Date.now(),
                endTimestamp: 0
            });
        }
        setCurrentPaths(function(currentPaths) {
            return [].concat(currentPaths, [
                stroke
            ]);
        });
    };
    var handlePointerMove = function handlePointerMove(point) {
        if (!isDrawing) return;
        var currentStroke = currentPaths.slice(-1)[0];
        var updatedStroke = _extends({}, currentStroke, {
            paths: [].concat(currentStroke.paths, [
                point
            ])
        });
        setCurrentPaths(function(currentPaths) {
            return [].concat(currentPaths.slice(0, -1), [
                updatedStroke
            ]);
        });
    };
    var handlePointerUp = function handlePointerUp() {
        var _currentPaths$slice$2, _currentPaths$slice2;
        if (!isDrawing) {
            return;
        }
        setIsDrawing(false);
        if (!withTimestamp) {
            return;
        }
        var currentStroke = (_currentPaths$slice$2 = (_currentPaths$slice2 = currentPaths.slice(-1)) == null ? void 0 : _currentPaths$slice2[0]) != null ? _currentPaths$slice$2 : null;
        if (currentStroke === null) {
            return;
        }
        var updatedStroke = _extends({}, currentStroke, {
            endTimestamp: Date.now()
        });
        setCurrentPaths(function(currentPaths) {
            return [].concat(currentPaths.slice(0, -1), [
                updatedStroke
            ]);
        });
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Canvas, {
        ref: svgCanvas,
        id: id,
        width: width,
        height: height,
        className: className,
        canvasColor: canvasColor,
        backgroundImage: backgroundImage,
        exportWithBackgroundImage: exportWithBackgroundImage,
        preserveBackgroundImageAspectRatio: preserveBackgroundImageAspectRatio,
        allowOnlyPointerType: allowOnlyPointerType,
        style: style,
        svgStyle: svgStyle,
        paths: currentPaths,
        isDrawing: isDrawing,
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp
    });
});
;
 //# sourceMappingURL=react-sketch-canvas.esm.js.map
}),
]);

//# sourceMappingURL=_02af90a9._.js.map