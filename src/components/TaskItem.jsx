import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => (
  <div
    className={`group flex items-center gap-3 p-4 rounded-xl transition-all border border-transparent ${
      task.completed ? 'bg-slate-50' : 'bg-white border-slate-100 shadow-sm'
    }`}
  >
    {/* Botón para marcar/desmarcar */}
    <button
      onClick={() => onToggle(task)}
      className={`shrink-0 transition-colors p-1 rounded-full hover:bg-slate-200 ${
        task.completed ? 'text-green-500' : 'text-slate-300 hover:text-indigo-500'
      }`}
    >
      {task.completed ? <CheckCircle size={26} /> : <Circle size={26} />}
    </button>

    {/* Texto e info de la tarea */}
    <div className="flex-grow min-w-0">
      <p className={`text-lg leading-tight break-words ${
        task.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
      }`}>
        {task.text}
      </p>
      <div className="flex gap-2 text-[10px] text-slate-400 font-mono items-center mt-1">
        <span>Por: {task.author || 'anon'}</span>
        <span>•</span>
        <span>{new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>

    {/* Botón Eliminar (Rojo) */}
    <button
      onClick={() => onDelete(task.id)}
      className="p-3 text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all shrink-0"
      title="Eliminar definitivamente"
    >
      <Trash2 size={20} />
    </button>
  </div>
);

export default TaskItem;
