import React, { useState } from 'react';
import { Plus, Calendar, Flag } from 'lucide-react';

const TaskForm = ({ newTask, setNewTask, newPriority, setNewPriority, onAdd, loading, scheduledDate, setScheduledDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Priority options configuration
  const priorities = [
    { id: 'high', color: 'text-red-500', bg: 'bg-red-50', ring: 'ring-red-200', label: 'Alta' },
    { id: 'medium', color: 'text-orange-500', bg: 'bg-orange-50', ring: 'ring-orange-200', label: 'Media' },
    { id: 'low', color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-200', label: 'Baja' },
    { id: 'none', color: 'text-slate-400', bg: 'bg-slate-50', ring: 'ring-slate-200', label: 'Normal' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAdd(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white p-5 shadow-sm border-b border-slate-100 relative">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué necesitas hacer?"
            className="w-full flex-grow px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-violet-500 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-400"
            disabled={loading}
          />
          
          <div className="flex items-center justify-between sm:justify-start gap-2">
            {/* Priority Selector - Colorful & clear */}
            <div className="flex gap-3">
              {priorities.map(p => (
                  <button
                      key={p.id}
                      type="button"
                      onClick={(e) => { e.preventDefault(); setNewPriority(p.id); }}
                      className={`relative group flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all border-2 ${
                          newPriority === p.id 
                          ? `bg-white border-current ${p.color} scale-110 shadow-md ring-2 ring-offset-2 ring-indigo-50` 
                          : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm hover:scale-105'
                      }`}
                      title={`${p.label}`}
                  >
                      {/* Icon always colored */}
                      {p.id === 'high' && <Flag size={18} className="text-red-500 fill-red-500" />}
                      {p.id === 'medium' && <Flag size={18} className="text-orange-500 fill-orange-500" />}
                      {p.id === 'low' && <Flag size={18} className="text-blue-500 fill-blue-500" />}
                      {p.id === 'none' && <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}

                      {/* Label on hover (or selected) could be helpful, but tight space. 
                          Let's trust the color + Title attribute. 
                      */}
                  </button>
              ))}
            </div>

            <div className="flex gap-2">
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
          </div>
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
