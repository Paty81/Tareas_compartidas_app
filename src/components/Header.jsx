import React from 'react';
import { Users, Loader2, Share2, Smartphone } from 'lucide-react';

const Header = ({ loading, onOpenInstall }) => {
  const handleShare = () => {
    // Copia la dirección web actual
    navigator.clipboard.writeText(window.location.href);
    alert("¡Enlace copiado! 🔗\n\nPégalo en WhatsApp o envíalo por correo para compartir la lista.");
  };

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-sm border-b border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" />
            Lista Compartida
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sincronización en tiempo real.
          </p>
        </div>
        {loading ? (
          <Loader2 className="animate-spin text-indigo-600" />
        ) : (
          <button
            onClick={onOpenInstall}
            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            title="Instalar como App"
          >
            <Smartphone size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShare}
          className="bg-slate-900 text-white py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <Share2 size={16} />
          Copiar Enlace
        </button>
        <button
          onClick={onOpenInstall}
          className="bg-white text-indigo-600 border-2 border-indigo-100 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95"
        >
          <Smartphone size={16} />
          Instalar App
        </button>
      </div>
    </div>
  );
};

export default Header;
