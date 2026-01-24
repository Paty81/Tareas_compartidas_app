import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { gun, user, appId } from '../config/db';
import Header from '../components/Header';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import TabSelector from '../components/TabSelector';

// USUARIO DEL ADMINISTRADOR (tu alias público)
const ADMIN_ALIAS = "Paty";

const translateError = (err) => {
  if (!err) return '';
  if (err.includes('User already created')) return '¡El usuario ya existe!';
  if (err.includes('Wrong user or password')) return '¡Usuario o contraseña incorrectos!';
  if (err.includes('User does not exist')) return '¡El usuario no existe!';
  if (err.includes('Password too short')) return '¡La contraseña es muy corta! (Mínimo 8 caracteres)';
  return err; // Retornar original si no hay traducción
};

export default function TodoPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [scheduledDate, setScheduledDate] = useState(null);
  const [newPriority, setNewPriority] = useState('none');
  const [loading, setLoading] = useState(true);

  // ...

          <TaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            newPriority={newPriority}
            setNewPriority={setNewPriority}
            onAdd={handleAddTask}
            loading={loading}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
          />

  // Main Notification State (Mute logic)
  const [areNotificationsActive, setAreNotificationsActive] = useState(() => {
    return localStorage.getItem('notificationsActive') !== 'false';
  });

  const toggleNotifications = () => {
    if (!('Notification' in window)) {
      alert("Tu navegador no soporta notificaciones.");
      return;
    }

    if (Notification.permission === 'denied') {
      alert("⚠️ Las notificaciones están bloqueadas.\n\nPara activarlas, debes ir a la Configuración de tu navegador (el candado 🔒 junto a la URL) y permitir las notificaciones para esta página.");
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(res => {
        if (res === 'granted') {
           setAreNotificationsActive(true);
           localStorage.setItem('notificationsActive', 'true');
           // Feedback inmediato
           if ('vibrate' in navigator) navigator.vibrate(50);
        } else {
           alert("Has denegado las notificaciones. No recibirás avisos.");
        }
      });
      return;
    }

    // Si ya están concedidas, conmutamos el estado "soft"
    if (Notification.permission === 'granted') {
      const newState = !areNotificationsActive;
      setAreNotificationsActive(newState);
      localStorage.setItem('notificationsActive', String(newState));
    }
  };

  // Locations state
  const defaultLocations = [
    { id: 'hogar', name: 'Hogar', icon: 'home' },
    { id: 'trabajo', name: 'Trabajo', icon: 'briefcase' },
  ];
  const [locations, setLocations] = useState(defaultLocations);

  const { listId } = useParams();
  
  // Si hay parametro en URL, esa es la ubicación seleccionada
  // Si no, usamos el estado interno (por defecto 'hogar')
  const [internalLocation, setInternalLocation] = useState('hogar');
  
  useEffect(() => {
    if (listId) {
        setInternalLocation(listId);
    }
  }, [listId]);

  const selectedLocation = listId || internalLocation;
  const setSelectedLocation = setInternalLocation; // Alias para compatibilidad con código existente

  // Si viene de una URL específica, es vista compartida
  const isSharedView = !!listId;

  // Check if current user is admin
  // En Gun.js comparamos el alias, aunque lo ideal sería pub key para mayor seguridad.
  // Por simplicidad en esta migración usamos alias.
  const isAdmin = currentUser?.alias === ADMIN_ALIAS;

  // Auth listener
  useEffect(() => {
    // Gun recupera sesión automáticamente si localStorage: true
    gun.on('auth', async () => {
      if (user.is) {
        setCurrentUser({ 
          uid: user.is.pub, 
          alias: user.is.alias,
          displayName: user.is.alias // Usamos alias como display name por defecto
        });
        setAuthLoading(false);
      }
    });

    // Timeout de seguridad por si no hay sesión guardada
    setTimeout(() => {
      if (!user.is) {
        setAuthLoading(false);
        setLoading(false);
      }
    }, 1000);
  }, []);

  // Cargar locations
  // Cargar locations
  useEffect(() => {
    // ADMIN: Carga TODAS las listas globales
    if (isAdmin) {
      const locationsRef = gun.get(appId).get('config').get('locations');
      locationsRef.on((data) => {
        if (data) {
          try {
             if(typeof data === 'string') {
                setLocations(JSON.parse(data));
             } else if (data.list) {
               const list = typeof data.list === 'string' ? JSON.parse(data.list) : defaultLocations;
               setLocations(list);
             }
          } catch (e) {
            console.error("Error parsing locations", e);
          }
        }
      });
      // Inicializar si está vacío
      locationsRef.once((data) => {
        if (!data || !data.list) {
           locationsRef.put({ list: JSON.stringify(defaultLocations) });
        }
      });
    } else {
      // USUARIO NORMAL: Carga solo SUS listas descubiertas
      if (!user.is) return;
      
      const myListsRef = user.get('my_shared_lists');
      
      myListsRef.on((data) => {
        if (data) {
          try {
             const list = typeof data === 'string' ? JSON.parse(data) : (data.list ? JSON.parse(data.list) : []);
             setLocations(list);
          } catch (e) {
             console.error("Error loading my lists", e);
          }
        } else {
             setLocations([]);
        }
      });
    }
  }, [isAdmin, currentUser]); // Dependencia currentUser para recargar al loguear

  // Efecto para "Descubrir" listas cuando visito un enlace compartido
  useEffect(() => {
     if (isAdmin || !isSharedView || !currentUser) return;
     
     // Si soy usuario y visito una URL compartida (selectedLocation), la añado a mis listas
     const alreadyHasIt = locations.some(l => l.id === selectedLocation);
     if (!alreadyHasIt) {
        // Necesitamos saber el NOMBRE de la lista. 
        // Leemos la lista global UNA VEZ para encontrar el nombre correcto
        gun.get(appId).get('config').get('locations').once((data) => {
             let foundName = selectedLocation;
             let foundIcon = 'pin';
             
             if (data && data.list) {
                 try {
                     const allList = typeof data.list === 'string' ? JSON.parse(data.list) : data.list;
                     const match = allList.find(l => l.id === selectedLocation);
                     if (match) {
                         foundName = match.name;
                         foundIcon = match.icon;
                     }
                 } catch(e) { console.error("Error finding name", e); }
             }

             const newMyList = [...locations, { id: selectedLocation, name: foundName, icon: foundIcon }];
             // Guardar en mi perfil de usuario
             user.get('my_shared_lists').put(JSON.stringify(newMyList)); 
             
             // Actualizar localmente para feedback inmediato
             setLocations(newMyList);
        });
     }
  }, [isSharedView, selectedLocation, isAdmin, currentUser, locations]);

  // Manejar notificaciones (simplificado para Gun - sin FCM por ahora)
  // Manejar notificaciones (simplificado para Gun - sin FCM por ahora)
  const showNotification = useCallback((task) => {
    if (areNotificationsActive && Notification.permission === 'granted' && document.hidden) {
      new Notification('Nueva tarea', {
        body: `${task.authorName || 'Alguien'}: ${task.text}`,
        icon: '/icon-192.png'
      });
    }
  }, [areNotificationsActive]);

  // Cargar tareas - Gun.js
  useEffect(() => {
    if (!currentUser) return;

    setTasks([]); // Limpiar al cambiar
    setLoading(true);

    const tasksRef = gun.get(appId).get('locations').get(selectedLocation).get('todos');
    
    // map().on() se suscribe a cada item individualmente
    const loadedTasks = new Map();

    const sub = tasksRef.map().on((data, id) => {
      if (!data) {
        // null significa borrado
        loadedTasks.delete(id);
        const tasksArray = Array.from(loadedTasks.values());
        tasksArray.sort((a, b) => b.createdAt - a.createdAt);
        setTasks(tasksArray);
        return;
      }
      
      // Filtrar nodos internos de Gun (_ meta data)
      if (id === '_' || !data.text) return; 

      const task = {
        id,
        ...data
      };

      // Si es nuevo y no soy yo el autor, notificar
      if (!loadedTasks.has(id)) {
        if (task.authorId !== currentUser.uid && (Date.now() - task.createdAt < 10000)) {
           showNotification(task);
        }
      }

      loadedTasks.set(id, task);
      
      const tasksArray = Array.from(loadedTasks.values());
      const getPriorityWeight = (p) => {
        switch(p) {
          case 'high': return 3;
          case 'medium': return 2;
          case 'low': return 1;
          default: return 0;
        }
      };

      tasksArray.sort((a, b) => {
        const priorityA = getPriorityWeight(a.priority);
        const priorityB = getPriorityWeight(b.priority);
        
        if (priorityA !== priorityB) {
          return priorityB - priorityA; // Mayor prioridad primero
        }
        return (b.createdAt || 0) - (a.createdAt || 0); // Más reciente primero
      });

      setTasks(tasksArray);
      setLoading(false);
    });

    // Safety timeout to stop loading if no tasks found
    const loadingTimeout = setTimeout(() => {
        setLoading(false);
    }, 2000);

    return () => {
        sub.off(); // Desuscribir
        clearTimeout(loadingTimeout);
    };
    return () => {
        sub.off(); // Desuscribir
        clearTimeout(loadingTimeout);
    };
  }, [currentUser, selectedLocation, showNotification]); // Removed areNotificationsActive from dependency to avoid re-subscription loop logic if strictly not needed, but showNotification depends on it. Ideally showNotification ref update.

  // Auth Handlers
  const handleLogin = (username, password) => {
    setAuthLoading(true);
    setAuthError('');
    user.auth(username, password, ({ err }) => {
      if (err) {
        setAuthError(translateError(err));
        setAuthLoading(false);
      } else {
        // Login exitoso, el listener 'auth' actualizará el estado
      }
    });
  };

  const handleRegister = (username, password, displayName) => {
    setAuthLoading(true);
    setAuthError('');
    user.create(username, password, ({ err, pub }) => {
      if (err) {
        setAuthError(translateError(err));
        setAuthLoading(false);
      } else {
        // Login automático tras crear
        handleLogin(username, password);
      }
    });
  };

  const handleLogout = async () => {
    user.leave();
    setCurrentUser(null);
    setTasks([]);
    // Reload page to clear memory state cleanly
    window.location.reload(); 
  };

  // Task Handlers
  const handleAddTask = async (e) => {
    if (e) e.preventDefault();
    const taskText = newTask.trim();
    if (!taskText || !currentUser) return;

    const taskData = {
      text: taskText,
      completed: false,
      createdAt: Date.now(),
      authorId: currentUser.uid,
      authorName: currentUser.alias,
      scheduledDate: scheduledDate ? scheduledDate.getTime() : null,
      priority: newPriority
    };

    // set() en Gun genera un ID único automáticamente
    gun.get(appId).get('locations').get(selectedLocation).get('todos').set(taskData);

    setNewTask("");
    setScheduledDate(null);
    setNewPriority('none');
  };

  // Task Handlers
  const handleToggleTask = (task) => {
    // Si la tarea se va a completar, lanzar confeti
    if (!task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899'], // Colores del tema (Indigo, Purple, Pink)
      });
    }

    // Put partial update
    gun.get(appId).get('locations').get(selectedLocation).get('todos').get(task.id).put({
      completed: !task.completed
    });
  };

  const handleDeleteTask = (taskId) => {
    // Confeti al eliminar (rojo/naranja para distinguir acción destructiva pero celebratoria)
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f97316', '#cbd5e1'], 
    });

    if (!confirm("¿Eliminar permanentemente?")) return;
    // En Gun, poner null rompe el enlace
    gun.get(appId).get('locations').get(selectedLocation).get('todos').get(taskId).put(null);
  };

  const handleSetPriority = (taskId, priority) => {
    if (!isAdmin) return;
    gun.get(appId).get('locations').get(selectedLocation).get('todos').get(taskId).put({
      priority
    });
  };

  // Locations Logic
  const saveLocationsToGun = (newLocations) => {
    // Guardamos como string para evitar complejidad de grafos por ahora en config
    gun.get(appId).get('config').get('locations').put({
        list: JSON.stringify(newLocations)
    });
  };

  const handleAddLocation = (newLocation) => {
    const newLocations = [...locations, newLocation];
    // Optimistic update
    setLocations(newLocations);
    setSelectedLocation(newLocation.id);
    saveLocationsToGun(newLocations);
  };

  const handleDeleteLocation = (locationId) => {
    if (!isAdmin) return;
    // Permitemos borrar cualquier lista, incluso las originales
    const newLocations = locations.filter(l => l.id !== locationId);
    setLocations(newLocations);
    
    // Si borramos la actual, ir a la primera disponible o 'hogar' como fallback (aunque no exista, para no romper)
    if (selectedLocation === locationId) {
        setSelectedLocation(newLocations.length > 0 ? newLocations[0].id : 'hogar');
    }
    saveLocationsToGun(newLocations);
  };

  const handleEditLocation = (locationId, updates) => {
    if (!isAdmin) return;
    const newLocations = locations.map(l =>
      l.id === locationId ? { ...l, ...updates } : l
    );
    setLocations(newLocations);
    saveLocationsToGun(newLocations);
  };

  const handleShare = () => {
    // Verificar si estamos en localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      alert("⚠️ ¡CUIDADO! \n\nEstás en modo de prueba (localhost). Si envías este enlace, Nadie podrá abrirlo porque apunta a TU ordenador.\n\nPara compartir, debes abrir la página web que has publicado (ej. tu-app.vercel.app o github.io) y compartir el enlace desde allí.");
      return;
    }

    const currentLocation = locations.find(l => l.id === selectedLocation);
    const locationName = currentLocation?.name || selectedLocation;
    // Construimos la URL con hash para asegurar compatibilidad (#/ubicacion)
    const baseUrl = window.location.href.split('#')[0];
    const shareUrl = `${baseUrl}#/${selectedLocation}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert(`¡Enlace copiado!\n\nLista: ${locationName}\nURL: ${shareUrl}\n\nNota: Compatible con cualquier dispositivo.`);
  };

  const handleOpenNotifications = () => {
     if ('Notification' in window) {
         Notification.requestPermission();
     }
  };

  // Loading View
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Iniciando nodo P2P...</p>
        </div>
      </div>
    );
  }

  // Login View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
          error={authError}
        />
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans transition-colors duration-500">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/40">
          <Header
            loading={loading}
            user={{...currentUser, email: currentUser.alias }} 
            onLogout={handleLogout}
            onOpenNotifications={toggleNotifications}
            notificationsActive={areNotificationsActive && Notification.permission === 'granted'}
          />

          
            <TabSelector
              selectedLocation={selectedLocation}
              onLocationChange={(newId) => {
                // Navegación estilo SPA si estamos en shared link
                if (newId === 'hogar') {
                    window.location.hash = '#/';
                    setSelectedLocation('hogar');
                } else {
                    window.location.hash = `#/${newId}`;
                    setSelectedLocation(newId);
                }
              }}
              locations={locations}
              onAddLocation={handleAddLocation}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
              onShare={handleShare}
              isAdmin={isAdmin}
            />

          <TaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            onAdd={handleAddTask}
            loading={loading}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
          />

          <TaskList
            tasks={tasks}
            loading={loading}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onSetPriority={handleSetPriority}
            isAdmin={isAdmin}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}

