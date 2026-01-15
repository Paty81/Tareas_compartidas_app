import React from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ newTask, setNewTask, onAdd, loading }) => (
  <div className="bg-white p-6 shadow-sm border-b border-slate-50">
    <form onSubmit={onAdd} className="flex gap-3">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Escribe una nueva tarea..."
        className="flex-grow px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-900"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!newTask.trim() || loading}
        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 shrink-0"
      >
        <Plus />
      </button>
    </form>
  </div>
);

export default TaskForm;
