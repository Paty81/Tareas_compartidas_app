import React, { useState, useEffect } from 'react';
// Importamos la conexión a Firebase
import { auth, db, appId } from '../config/firebase';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

// Importamos nuestros componentes
import Header from '../components/Header';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';
import InstallModal from '../components/InstallModal';

export default function TodoPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // 1. Iniciar sesión anónima (para poder escribir en la base de datos)
  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Error auth:", err));
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 2. Escuchar cambios en la base de datos (Realtime)
  useEffect(() => {
    if (!user) return;

    // Referencia a la colección en la nube (Ruta pública para compartir)
    // Nota: 'todos' es el nombre de la colección donde se guardan las tareas
    const todosCollection = collection(db, 'public_lists', appId, 'todos');

    const unsubscribe = onSnapshot(todosCollection, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenar: Las más nuevas primero
      todosData.sort((a, b) => b.createdAt - a.createdAt);
      setTasks(todosData);
      setLoading(false);
    }, (error) => {
      console.error("Error sync:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- Funciones de Acción ---

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;
    try {
      const todosCollection = collection(db, 'public_lists', appId, 'todos');
      await addDoc(todosCollection, {
        text: newTask,
        completed: false,
        createdAt: Date.now(),
        author: user.uid.slice(0, 4) // Guardamos ultimos 4 caracteres del ID
      });
      setNewTask("");
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const taskRef = doc(db, 'public_lists', appId, 'todos', task.id);
      await updateDoc(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea permanentemente?")) return;
    try {
      const taskRef = doc(db, 'public_lists', appId, 'todos', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto shadow-xl rounded-3xl bg-white overflow-hidden">
        <Header
          loading={loading}
          onOpenInstall={() => setShowInstallModal(true)}
        />

        <TaskForm
          newTask={newTask}
          setNewTask={setNewTask}
          onAdd={handleAddTask}
          loading={loading}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </div>

      <Footer />

      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
