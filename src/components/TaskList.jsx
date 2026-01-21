import React from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onToggle, onDelete, onSetPriority, isAdmin }) => {
  if (loading) {
    return (
      <div className="bg-slate-50/50 min-h-[300px] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-500">Cargando tareas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-white to-slate-50 min-h-[300px] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-10 h-10 text-violet-500" />
        </div>
        <p className="font-bold text-slate-700 text-lg">Lista vacía</p>
        <p className="text-slate-400 text-sm mt-1">
          Añade tu primera tarea arriba
        </p>
      </div>
    );
  }

  // Separar tareas completadas y pendientes
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Ordenar pendientes por prioridad
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4, undefined: 4 };
  pendingTasks.sort((a, b) => {
    const priorityA = priorityOrder[a.priority] ?? 4;
    const priorityB = priorityOrder[b.priority] ?? 4;
    return priorityA - priorityB;
  });

  return (
    <div className="bg-slate-50/50 min-h-[300px] p-4 space-y-3">
      {/* Tareas pendientes */}
      {pendingTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onSetPriority={onSetPriority}
          isAdmin={isAdmin}
        />
      ))}

      {/* Separador si hay tareas completadas */}
      {completedTasks.length > 0 && pendingTasks.length > 0 && (
        <div className="flex items-center gap-3 py-3">
          <div className="flex-grow h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">
            Completadas ({completedTasks.length})
          </span>
          <div className="flex-grow h-px bg-slate-200" />
        </div>
      )}

      {/* Tareas completadas */}
      {completedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onSetPriority={onSetPriority}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default TaskList;
