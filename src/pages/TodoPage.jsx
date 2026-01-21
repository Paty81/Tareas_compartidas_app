import { useState, useEffect, useCallback } from 'react';
import { auth, db, appId } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDoc
} from "firebase/firestore";

import Header from '../components/Header';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import TabSelector from '../components/TabSelector';

// USUARIO DEL ADMINISTRADOR (tu nombre de usuario)
const ADMIN_USERNAME = "paty";
const ADMIN_EMAIL = `${ADMIN_USERNAME}@tareas.app`;

export default function TodoPage() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [scheduledDate, setScheduledDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Locations state - guardadas en Firebase para persistencia
  const defaultLocations = [
    { id: 'hogar', name: 'Hogar', icon: 'home' },
    { id: 'trabajo', name: 'Trabajo', icon: 'briefcase' },
  ];
  const [locations, setLocations] = useState(defaultLocations);
  const [locationsLoaded, setLocationsLoaded] = useState(false);

  // Detectar ubicación desde URL
  const getLocationFromURL = () => {
    const path = window.location.pathname.slice(1); // quitar /
    if (path && path !== '') return path;
    return null;
  };

  const [urlLocation] = useState(getLocationFromURL());
  const [selectedLocation, setSelectedLocation] = useState(urlLocation || 'hogar');

  // Si viene de una URL específica, es vista compartida (bloquear navegación)
  const isSharedView = urlLocation !== null;

  // Notifications
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Cargar locations desde Firebase
  useEffect(() => {
    const locationsDocRef = doc(db, 'public_lists', appId, 'config', 'locations');

    const unsubscribe = onSnapshot(locationsDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().list) {
        setLocations(docSnap.data().list);
      }
      setLocationsLoaded(true);
    }, (error) => {
      console.error("Error loading locations:", error);
      setLocationsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // Show notification for new tasks
  const showNotification = useCallback((task) => {
    if (notificationPermission === 'granted' && document.hidden) {
      new Notification('Nueva tarea añadida', {
        body: `${task.authorName || 'Alguien'}: ${task.text}`,
        icon: '/icon-192.png',
        tag: task.id
      });
    }
  }, [notificationPermission]);

  // Listen to tasks changes
  useEffect(() => {
    if (!user) return;

    const todosCollection = collection(
      db,
      'public_lists',
      appId,
      'locations',
      selectedLocation,
      'todos'
    );

    let isFirstLoad = true;

    const unsubscribe = onSnapshot(todosCollection, (snapshot) => {
      const todosData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      todosData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      if (!isFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newTaskData = { id: change.doc.id, ...change.doc.data() };
            if (newTaskData.authorId !== user.uid) {
              showNotification(newTaskData);
            }
          }
        });
      }
      isFirstLoad = false;

      setTasks(todosData);
      setLoading(false);
    }, (error) => {
      console.error("Error sync:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedLocation, showNotification]);

  // Auth handlers - Usando nombre de usuario (se convierte a email interno)
  const usernameToEmail = (username) => `${username.toLowerCase().trim()}@tareas.app`;

  const handleLogin = async (username, password) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const email = usernameToEmail(username);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'auth/invalid-credential') {
        setAuthError('Usuario o contraseña incorrectos');
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('Usuario no encontrado');
      } else {
        setAuthError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (username, password, displayName) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const email = usernameToEmail(username);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: displayName || username });
    } catch (error) {
      console.error("Register error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Este nombre de usuario ya está en uso');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setAuthError('Error al crear cuenta. Intenta de nuevo.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setTasks([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Task handlers
  const handleAddTask = async (e) => {
    if (e) e.preventDefault();

    const taskText = newTask.trim();
    if (!taskText || !user) return;

    try {
      const todosCollection = collection(
        db,
        'public_lists',
        appId,
        'locations',
        selectedLocation,
        'todos'
      );

      const taskData = {
        text: taskText,
        completed: false,
        createdAt: Date.now(),
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        scheduledDate: scheduledDate ? scheduledDate.getTime() : null
      };

      await addDoc(todosCollection, taskData);

      setNewTask("");
      setScheduledDate(null);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error al añadir: " + error.message);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const taskRef = doc(
        db,
        'public_lists',
        appId,
        'locations',
        selectedLocation,
        'todos',
        task.id
      );
      await updateDoc(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("¿Eliminar permanentemente?")) return;
    try {
      const taskRef = doc(
        db,
        'public_lists',
        appId,
        'locations',
        selectedLocation,
        'todos',
        taskId
      );
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Guardar locations en Firebase
  const saveLocationsToFirebase = async (newLocations) => {
    try {
      const locationsDocRef = doc(db, 'public_lists', appId, 'config', 'locations');
      await setDoc(locationsDocRef, { list: newLocations });
    } catch (error) {
      console.error("Error saving locations:", error);
    }
  };

  const handleAddLocation = async (newLocation) => {
    const newLocations = [...locations, newLocation];
    setLocations(newLocations);
    setSelectedLocation(newLocation.id);
    await saveLocationsToFirebase(newLocations);
  };

  const handleDeleteLocation = async (locationId) => {
    if (!isAdmin) return;
    // No permitir borrar las predeterminadas
    if (locationId === 'hogar' || locationId === 'trabajo') return;

    const newLocations = locations.filter(l => l.id !== locationId);
    setLocations(newLocations);
    // Si estamos en la lista que se borra, volver a hogar
    if (selectedLocation === locationId) {
      setSelectedLocation('hogar');
    }
    await saveLocationsToFirebase(newLocations);
  };

  const handleEditLocation = async (locationId, updates) => {
    if (!isAdmin) return;

    const newLocations = locations.map(l =>
      l.id === locationId
        ? { ...l, name: updates.name, icon: updates.icon }
        : l
    );
    setLocations(newLocations);
    await saveLocationsToFirebase(newLocations);
  };

  // Establecer prioridad de tarea - Solo admin
  const handleSetPriority = async (taskId, priority) => {
    if (!isAdmin) return;
    try {
      const taskRef = doc(
        db,
        'public_lists',
        appId,
        'locations',
        selectedLocation,
        'todos',
        taskId
      );
      await updateDoc(taskRef, { priority });
    } catch (error) {
      console.error("Error setting priority:", error);
    }
  };

  const handleShare = () => {
    const currentLocation = locations.find(l => l.id === selectedLocation);
    const locationName = currentLocation?.name || selectedLocation;
    // Generar URL única para esta ubicación
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/${selectedLocation}`;

    navigator.clipboard.writeText(shareUrl);
    alert(`¡Enlace copiado!\n\nLista: ${locationName}\nURL: ${shareUrl}\n\nComparte este enlace para que otros puedan ver y añadir tareas a esta lista.`);
  };

  const handleOpenNotifications = () => {
    if (notificationPermission === 'default') {
      requestNotificationPermission();
    } else if (notificationPermission === 'denied') {
      alert('Las notificaciones están bloqueadas. Actívalas en la configuración de tu navegador.');
    } else {
      alert('¡Notificaciones activadas! Recibirás alertas de nuevas tareas.');
    }
  };

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // LOGIN OBLIGATORIO
  if (!user) {
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="shadow-2xl rounded-3xl bg-white overflow-hidden">
          <Header
            loading={loading}
            user={user}
            onLogout={handleLogout}
            onOpenNotifications={handleOpenNotifications}
          />

          {/* Solo el admin ve las pestañas Y solo si NO viene de enlace compartido */}
          {isAdmin && !isSharedView ? (
            <TabSelector
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              locations={locations}
              onAddLocation={handleAddLocation}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
              onShare={handleShare}
              isAdmin={isAdmin}
            />
          ) : (
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-6">
              <div className="text-center text-white">
                <p className="text-white/70 text-xs mb-1">Lista compartida</p>
                <span className="font-bold text-xl capitalize">
                  {locations.find(l => l.id === selectedLocation)?.name || selectedLocation.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          )}

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
