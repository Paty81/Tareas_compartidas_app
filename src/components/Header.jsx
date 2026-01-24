import React from 'react';
import { Sparkles, LogOut, Bell, User } from 'lucide-react';

const Header = ({ loading, user, onLogout, onOpenNotifications, notificationsActive }) => {
  
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('es-ES', options);

  const hour = today.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-lg">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 translate-y-[-20%] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-40 translate-x-[-20%] translate-y-[20%] rounded-full bg-purple-500/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-lg font-bold tracking-tight">
                {greeting}, {user?.displayName?.split(' ')[0] || 'Usuario'}
                <Sparkles size={18} className="animate-pulse text-yellow-300" />
              </p>
              <p className="text-sm font-medium text-white/80 capitalize">{formattedDate}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenNotifications}
              className={`group relative rounded-xl p-2.5 transition-all active:scale-95 ${
                notificationsActive 
                  ? 'bg-white/20 text-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.3)]' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={notificationsActive ? "Desactivar notificaciones" : "Activar notificaciones"}
            >
              {notificationsActive ? (
                <>
                  <Bell size={20} className="fill-yellow-300" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-purple-600">
                    ON
                  </span>
                </>
              ) : (
                 <Bell size={20} />
              )}
            </button>
            <button
              onClick={onLogout}
              className="rounded-xl bg-white/10 p-2.5 transition-all hover:bg-red-500/20 hover:text-red-100 active:scale-95"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
          <h1 className="text-center text-3xl font-black text-white drop-shadow-sm sm:text-4xl">
            Lista Compartida
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-indigo-100">
            <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            Sincronizado en tiempo real
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
