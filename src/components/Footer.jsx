import { useState, useEffect } from 'react';
import { Heart, Github, Download, Smartphone } from 'lucide-react';

const Footer = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detectar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Mostrar instrucciones manuales para iOS/Safari
      alert('Para instalar esta app:\n\n1. Abre el menú de compartir (iOS) o los 3 puntos (Android/Chrome)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Confirma la instalación');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="text-center mt-6 pb-6 space-y-3">
      {/* Botón de instalar app */}
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm font-bold hover:from-indigo-600 hover:to-violet-600 transition-all shadow-md hover:shadow-lg"
      >
        <Smartphone size={16} />
        Instalar App en tu dispositivo
        <Download size={16} />
      </button>

      <p className="text-slate-500 text-xs">
        Tus cambios se guardan automáticamente en la nube
      </p>
      <div className="flex items-center justify-center gap-1 text-slate-600 font-medium text-sm">
        <span>Hecho con</span>
        <Heart size={14} className="text-red-500 fill-red-500 mx-1" />
        <span>por</span>
        <a
          href="https://github.com/Paty81"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-1 ml-1"
        >
          Paty81
          <Github size={14} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
