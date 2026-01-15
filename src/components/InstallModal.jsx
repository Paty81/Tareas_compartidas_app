import React from 'react';
import { X, Smartphone } from 'lucide-react';

const InstallModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-full">
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Smartphone size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Instalar App</h3>
          <p className="text-slate-500 text-sm mb-6">Añade esta lista a tu inicio para usarla como una App.</p>

          <div className="space-y-4 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-700 text-sm">🍏 iPhone (Safari)</p>
              <p className="text-xs text-slate-500">Botón <strong>Compartir</strong> &gt; <strong>Añadir a pantalla de inicio</strong>.</p>
            </div>
            <div className="h-px bg-slate-200/50" />
            <div>
              <p className="font-bold text-slate-700 text-sm">🤖 Android (Chrome)</p>
              <p className="text-xs text-slate-500">Menú (3 puntos) &gt; <strong>Instalar aplicación</strong>.</p>
            </div>
          </div>

          <button onClick={onClose} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallModal;
