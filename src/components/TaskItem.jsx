import React from 'react';
import { CheckCircle, Circle, Trash2, Calendar, Clock, Star } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isScheduledForFuture = task.scheduledDate && new Date(task.scheduledDate) > new Date();

  // Colores aleatorios para las tareas
  const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
  ];
  const colorIndex = task.text.length % colors.length;
  const gradientColor = colors[colorIndex];

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-2xl transition-all ${
        task.completed
          ? 'bg-slate-50 opacity-60'
          : 'bg-white border-2 border-slate-100 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:border-purple-200'
      }`}
    >
      {/* Indicador de color */}
      {!task.completed && (
        <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${gradientColor}`} />
      )}

      {/* Botón para marcar/desmarcar */}
      <button
        onClick={() => onToggle(task)}
        className={`shrink-0 transition-all p-1 rounded-full mt-0.5 ${
          task.completed
            ? 'text-emerald-500'
            : 'text-slate-300 hover:text-purple-500 hover:scale-125'
        }`}
      >
        {task.completed ? (
          <CheckCircle size={28} className="fill-emerald-100" />
        ) : (
          <Circle size={28} />
        )}
      </button>

      {/* Contenido de la tarea */}
      <div className="flex-grow min-w-0">
        <p
          className={`text-base leading-snug break-words ${
            task.completed
              ? 'line-through text-slate-400'
              : 'text-slate-700 font-semibold'
          }`}
        >
          {task.text}
        </p>

        {/* Info de la tarea */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
          {/* Autor */}
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            {task.authorName || task.author || 'Anónimo'}
          </span>

          {/* Fecha de creación */}
          <span className="flex items-center gap-1 text-slate-400">
            <Clock size={12} />
            {formatDate(task.createdAt)} {formatTime(task.createdAt)}
          </span>

          {/* Fecha programada */}
          {task.scheduledDate && (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                isScheduledForFuture
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Calendar size={12} />
              {formatDate(task.scheduledDate)} {formatTime(task.scheduledDate)}
            </span>
          )}
        </div>
      </div>

      {/* Botón Eliminar */}
      <button
        onClick={() => onDelete(task.id)}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 opacity-0 group-hover:opacity-100"
        title="Eliminar tarea"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskItem;
