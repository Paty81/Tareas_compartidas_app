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

  // ... (handleSubmit, handleKeyDown same)

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
          
          {/* Priority Selector */}
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
            {priorities.map(p => (
                <button
                    key={p.id}
                    type="button"
                    onClick={() => setNewPriority(p.id)}
                    className={`p-2.5 rounded-lg transition-all ${
                        newPriority === p.id 
                        ? `${p.bg} ${p.color} shadow-sm ring-1 ${p.ring}` 
                        : 'text-slate-300 hover:bg-white hover:text-slate-400'
                    }`}
                    title={`Prioridad ${p.label}`}
                >
                    <Flag size={20} className={newPriority === p.id ? "fill-current" : ""} />
                </button>
            ))}
          </div>

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
