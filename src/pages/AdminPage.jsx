import React, { useState, useEffect } from 'react';
import { gun, appId } from '../config/db';
import { Shield, ShieldAlert, User, Search, Lock, Unlock, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Cargar Usuarios Registrados
    gun.get(appId).get('users').map().on((data, pub) => {
        if (!data || !data.alias) return;
        setUsers(prev => {
            const exists = prev.find(u => u.pub === pub);
            if (exists) return prev;
            return [...prev, { ...data, pub }];
        });
    });

    // 2. Cargar Lista Negra
    gun.get(appId).get('banned_users').map().on((isBanned, pub) => {
        setBannedUsers(prev => ({ ...prev, [pub]: isBanned }));
    });
  }, []);

  const toggleBan = (pub, currentStatus) => {
      if (!confirm(currentStatus ? "¿Desbloquear usuario?" : "¿BLOQUEAR usuario? No podrá entrar más.")) return;
      
      gun.get(appId).get('banned_users').get(pub).put(!currentStatus);
  };

  const deleteUser = (pub) => {
      if (!confirm("¿ELIMINAR usuario de la lista? \n\nEsto lo borrará de tu registro, pero si vuelve a iniciar sesión aparecerá de nuevo.")) return;
      
      // Borrar del registro público
      gun.get(appId).get('users').get(pub).put(null);
      
      // Actualizar estado local inmediatamente
      setUsers(prev => prev.filter(u => u.pub !== pub));
  };

  const filteredUsers = users.filter(u => 
      u.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                <ArrowLeft size={20} />
                Volver a la App
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
                <ShieldAlert className="text-indigo-600" />
                <span className="font-bold text-slate-700">Panel de Administrador</span>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-400 text-sm font-medium">Usuarios Totales</p>
                <p className="text-3xl font-black text-slate-800">{users.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-400 text-sm font-medium">Bloqueados</p>
                <p className="text-3xl font-black text-rose-500">
                    {Object.values(bannedUsers).filter(Boolean).length}
                </p>
            </div>
        </div>

        {/* Search */}
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar usuario..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold">Usuario</th>
                        <th className="p-4 font-semibold">ID / PubKey</th>
                        <th className="p-4 font-semibold">Estado</th>
                        <th className="p-4 font-semibold text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(user => {
                        const isBanned = bannedUsers[user.pub];
                        return (
                            <tr key={user.pub} className={`hover:bg-slate-50 transition-colors ${isBanned ? 'bg-red-50/50' : ''}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBanned ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                            <User size={20} />
                                        </div>
                                        <span className={`font-bold ${isBanned ? 'text-red-700' : 'text-slate-700'}`}>
                                            {user.alias}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-xs font-mono text-slate-400 truncate max-w-[150px]" title={user.pub}>
                                    {user.pub.slice(0, 8)}...{user.pub.slice(-8)}
                                </td>
                                <td className="p-4">
                                    {isBanned ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                            <Lock size={12} /> BLOQUEADO
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                                            <Shield size={12} /> ACTIVO
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => toggleBan(user.pub, isBanned)}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                                                isBanned 
                                                ? 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200' 
                                                : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200'
                                            }`}
                                            title={isBanned ? "Desbloquear" : "Bloquear acceso"}
                                        >
                                            {isBanned ? <Unlock size={16}/> : <Lock size={16}/>}
                                        </button>
                                        
                                        <button 
                                            onClick={() => deleteUser(user.pub)}
                                            className="px-3 py-2 rounded-lg text-sm font-bold bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                                            title="Eliminar del registro"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    No se encontraron usuarios
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
