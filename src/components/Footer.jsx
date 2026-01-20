import { Heart, Github } from 'lucide-react';

const Footer = () => (
  <div className="text-center mt-6 pb-6 space-y-2">
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

export default Footer;
