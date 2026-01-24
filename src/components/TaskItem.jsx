import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Calendar, Clock, AlertTriangle, Flag, Flame, Star } from 'lucide-react';

const priorityOptions = [
  { id: 'none', icon: null, color: '', bg: '', label: 'Sin prioridad' },
  { id: 'low', icon: Flag, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Baja' },
  { id: 'medium', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Media' },
  { id: 'high', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Alta' },
  { id: 'urgent', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-100', label: 'Urgente' },
];

const TaskItem = ({ task, onToggle, onDelete, onSetPriority, isAdmin }) => {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const isScheduledForFuture = task.scheduledDate && new Date(task.scheduledDate) > new Date();
  const currentPriority = priorityOptions.find(p => p.id === task.priority) || priorityOptions[0];
  const PriorityIcon = currentPriority.icon;

  const handlePrioritySelect = (priorityId) => {
    onSetPriority(task.id, priorityId);
    setShowPriorityMenu(false);
  };

  return (
    <div
      className={`glass-card group flex items-start gap-4 rounded-2xl p-4 transition-all hover:-translate-y-1 ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      {/* Checkbox Button */}
      <button
        onClick={() => onToggle(task)}
        className={`mt-1 shrink-0 rounded-full transition-transform active:scale-95 ${
          task.completed ? 'text-emerald-500' : 'text-slate-300 hover:scale-110 hover:text-indigo-500'
        }`}
      >
        {task.completed ? (
          <CheckCircle size={28} className="fill-emerald-100 stroke-[2.5]" />
        ) : (
          <Circle size={28} className="stroke-[2.5]" />
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-grow pt-1">
        <div className="flex items-start gap-2">
          {PriorityIcon && !task.completed && (
            <div className={`mt-0.5 rounded-lg p-1 ${currentPriority.bg} ${currentPriority.color}`}>
              <PriorityIcon size={14} strokeWidth={2.5} />
            </div>
          )}
          <p
            className={`break-words text-[1.05rem] font-medium leading-normal ${
              task.completed ? 'text-slate-500 line-through' : 'text-slate-800'
            }`}
          >
            {task.text}
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {/* Priority Badge */}
          {task.priority && task.priority !== 'none' && !task.completed && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${currentPriority.bg} ${currentPriority.color}`}>
              {PriorityIcon && <PriorityIcon size={10} />}
              {currentPriority.label}
            </span>
          )}

          {/* Author Badge */}
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
            {task.authorName || 'Anónimo'}
          </span>

          {/* Date Info - Agenda Style */}
          <span className="flex items-center gap-1 text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5" title={`Creado el ${formatDate(task.createdAt)} a las ${formatTime(task.createdAt)}`}>
             <Clock size={10} />
             {formatTime(task.createdAt)}
             <span className="text-slate-300">|</span>
             {formatDate(task.createdAt)}
          </span>

          {/* Scheduled Date */}
          {task.scheduledDate && (
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-sm ${
                isScheduledForFuture
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 ring-1 ring-orange-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Calendar size={12} />
              {formatDate(task.scheduledDate)} {formatTime(task.scheduledDate)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons - Always visible */}
      <div className="flex shrink-0 gap-1 opacity-100 transition-opacity">
        {isAdmin && !task.completed && (
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
              title="Cambiar prioridad"
            >
              <Flag size={18} />
            </button>
            {showPriorityMenu && (
              <div className="absolute right-0 top-full z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handlePrioritySelect(opt.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {opt.icon ? <opt.icon size={14} className={opt.color} /> : <div className="h-3.5 w-3.5" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
