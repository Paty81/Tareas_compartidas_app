import React, { useState } from 'react';
import { X, Lock, User, LogIn, UserPlus, Loader2, Sparkles } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister, loading, error }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(username, password);
    } else {
      onRegister(username, password, displayName);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setDisplayName('');
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-panel w-full max-w-md overflow-hidden rounded-3xl animate-in zoom-in-95 duration-300 shadow-2xl relative">
        
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
           {/* Close button not strictly needed if modal is forced, but good for UX if optional
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
           */}
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm ring-1 ring-white/30">
              {isLoginMode ? <LogIn size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isLoginMode ? 'Bienvenido' : 'Crear cuenta'}
            </h2>
            <p className="mt-2 text-indigo-100 font-medium">
              {isLoginMode
                ? 'Accede a tu espacio compartido'
                : 'Únete para empezar a colaborar'}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="relative z-10 p-8 space-y-5">
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium text-center animate-in slide-up">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre visible (solo en registro) */}
            {!isLoginMode && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={20} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                  required={!isLoginMode}
                />
              </div>
            )}

            {/* Nombre de usuario */}
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold transition-colors group-focus-within:text-indigo-500">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                placeholder="Usuario"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                required
                pattern="[a-zA-Z0-9_]+"
              />
            </div>

            {/* Contraseña */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : isLoginMode ? (
              <>Ingresar</>
            ) : (
              <>Registrarme</>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={toggleMode}
              className="text-slate-500 hover:text-indigo-600 font-medium text-sm transition-colors py-2 px-4 rounded-lg hover:bg-indigo-50"
            >
              {isLoginMode
                ? '¿No tienes cuenta? Crea una gratis'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
