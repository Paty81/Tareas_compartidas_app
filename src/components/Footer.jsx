import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer = () => (
  <div className="text-center mt-8 pb-8 space-y-2">
    <p className="text-slate-400 text-xs">Tus cambios se guardan automáticamente en la nube ☁️</p>
    <div className="flex items-center justify-center gap-1 text-slate-500 font-medium text-sm">
      <span>Aplicación hecha por</span>
      <a
        href="https://github.com/Paty81"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-1"
      >
        Paty81
        <Github size={14} />
      </a>
      <Heart size={14} className="text-red-400 fill-red-400 ml-1" />
    </div>
  </div>
);

export default Footer;
