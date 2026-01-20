import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import DatePicker from './DatePicker';

const TaskForm = ({ newTask, setNewTask, onAdd, loading, scheduledDate, setScheduledDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAdd(e);
    setShowDatePicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatScheduledDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-5 shadow-sm border-b border-slate-100 relative">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué necesitas hacer?"
            className="flex-grow px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-violet-500 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-400"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`p-3.5 rounded-xl transition-all shrink-0 ${
              scheduledDate
                ? 'bg-violet-100 text-violet-600 border-2 border-violet-200'
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border-2 border-transparent'
            }`}
            title="Programar tarea"
          >
            <Calendar size={22} />
          </button>
          <button
            type="submit"
            disabled={!newTask.trim() || loading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3.5 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 shrink-0"
          >
            <Plus size={22} />
          </button>
        </div>

        {scheduledDate && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Programada para:</span>
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg font-medium">
              {formatScheduledDate(scheduledDate)}
            </span>
            <button
              type="button"
              onClick={() => setScheduledDate(null)}
              className="text-slate-400 hover:text-red-500 text-xs"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>

      {/* Date Picker Popup */}
      {showDatePicker && (
        <div className="absolute top-full left-4 right-4 mt-2 z-50 flex justify-center">
          <DatePicker
            selectedDate={scheduledDate}
            onSelectDate={(date) => {
              setScheduledDate(date);
              setShowDatePicker(false);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        </div>
      )}
    </div>
  );
};

export default TaskForm;
