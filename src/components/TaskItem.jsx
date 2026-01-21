import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Calendar, Clock, AlertTriangle, Flag, Flame, Star } from 'lucide-react';

// Iconos de prioridad disponibles
const priorityOptions = [
  { id: 'none', icon: null, color: '', bg: '', label: 'Sin prioridad' },
  { id: 'low', icon: Flag, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Baja' },
  { id: 'medium', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Media' },
  { id: 'high', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Alta' },
  { id: 'urgent', icon: Flame, color: 'text-red-500', bg: 'bg-red-100', label: 'Urgente' },
];

const TaskItem = ({ task, onToggle, onDelete, onSetPriority, isAdmin }) => {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

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

  // Obtener prioridad actual
  const currentPriority = priorityOptions.find(p => p.id === task.priority) || priorityOptions[0];
  const PriorityIcon = currentPriority.icon;

  // Colores según prioridad
  const getPriorityGradient = () => {
    switch (task.priority) {
      case 'urgent': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-blue-500 to-blue-600';
      default:
        // Colores aleatorios para tareas sin prioridad
        const colors = [
          'from-pink-500 to-rose-500',
          'from-purple-500 to-indigo-500',
          'from-blue-500 to-cyan-500',
          'from-emerald-500 to-teal-500',
          'from-orange-500 to-amber-500',
        ];
        return colors[task.text.length % colors.length];
    }
  };

  const handlePrioritySelect = (priorityId) => {
    onSetPriority(task.id, priorityId);
    setShowPriorityMenu(false);
  };

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-2xl transition-all relative ${
        task.completed
          ? 'bg-slate-50 opacity-60'
          : task.priority === 'urgent'
            ? 'bg-red-50 border-2 border-red-200 shadow-sm hover:shadow-lg hover:scale-[1.02]'
            : task.priority === 'high'
              ? 'bg-orange-50 border-2 border-orange-200 shadow-sm hover:shadow-lg hover:scale-[1.02]'
              : 'bg-white border-2 border-slate-100 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:border-purple-200'
      }`}
    >
      {/* Indicador de color/prioridad */}
      {!task.completed && (
        <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${getPriorityGradient()}`} />
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
        <div className="flex items-start gap-2">
          {/* Icono de prioridad */}
          {PriorityIcon && !task.completed && (
            <span className={`${currentPriority.bg} ${currentPriority.color} p-1 rounded-lg shrink-0`}>
              <PriorityIcon size={14} />
            </span>
          )}
          <p
            className={`text-base leading-snug break-words ${
              task.completed
                ? 'line-through text-slate-400'
                : 'text-slate-700 font-semibold'
            }`}
          >
            {task.text}
          </p>
        </div>

        {/* Info de la tarea */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
          {/* Prioridad visible */}
          {task.priority && task.priority !== 'none' && !task.completed && (
            <span className={`${currentPriority.bg} ${currentPriority.color} px-2 py-0.5 rounded-full font-bold`}>
              {currentPriority.label}
            </span>
          )}

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

      {/* Botón de Prioridad - Solo Admin */}
      {isAdmin && !task.completed && (
        <div className="relative">
          <button
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            className={`p-2 rounded-xl transition-all shrink-0 ${
              task.priority && task.priority !== 'none'
                ? `${currentPriority.bg} ${currentPriority.color}`
                : 'text-slate-300 hover:text-purple-500 hover:bg-purple-50'
            }`}
            title="Establecer prioridad"
          >
            {PriorityIcon ? <PriorityIcon size={18} /> : <Flag size={18} />}
          </button>

          {/* Menú de prioridades */}
          {showPriorityMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 min-w-[140px]">
              {priorityOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handlePrioritySelect(option.id)}
                    className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm ${
                      task.priority === option.id ? 'bg-slate-100' : ''
                    }`}
                  >
                    {OptionIcon ? (
                      <OptionIcon size={16} className={option.color} />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                    <span className={option.color || 'text-slate-600'}>{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
