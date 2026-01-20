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
  onSnapshot
} from "firebase/firestore";

import Header from '../components/Header';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import TabSelector from '../components/TabSelector';

// EMAIL DEL ADMINISTRADOR
const ADMIN_EMAIL = "molinamartosp@gmail.com";

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

  // Locations state
  const [locations, setLocations] = useState([
    { id: 'casa', name: 'Casa', icon: 'home' },
    { id: 'trabajo', name: 'Trabajo', icon: 'briefcase' },
  ]);
  const [selectedLocation, setSelectedLocation] = useState('casa');

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

  // Auth handlers
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === 'auth/invalid-credential') {
        setAuthError('Correo o contraseña incorrectos');
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('Usuario no encontrado');
      } else {
        setAuthError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email, password, displayName) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      console.error("Register error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Este correo ya está registrado');
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

  const handleAddLocation = (newLocation) => {
    setLocations([...locations, newLocation]);
    setSelectedLocation(newLocation.id);
  };

  const handleShare = () => {
    const currentLocation = locations.find(l => l.id === selectedLocation);
    const locationName = currentLocation?.name || selectedLocation;
    const shareUrl = window.location.href;

    navigator.clipboard.writeText(shareUrl);
    alert(`¡Enlace copiado!\n\nLista: ${locationName}\n\nComparte este enlace para que otros puedan ver y añadir tareas.`);
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

          <TabSelector
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            locations={locations}
            onAddLocation={handleAddLocation}
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
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
