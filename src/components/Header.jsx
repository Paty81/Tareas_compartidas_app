import { Sparkles, LogOut, Bell, User } from 'lucide-react';

const Header = ({ loading, user, onLogout, onOpenNotifications }) => {
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = today.toLocaleDateString('es-ES', options);

  const hour = today.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <User size={22} />
            </div>
            <div>
              <p className="font-bold text-base">
                {greeting}, {user?.displayName?.split(' ')[0] || 'Usuario'}
                <Sparkles className="inline ml-1 text-yellow-300" size={16} />
              </p>
              <p className="text-white/70 text-sm capitalize">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenNotifications}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
              title="Notificaciones"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={onLogout}
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-black tracking-tight">
            Lista Compartida
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Sincronización en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
