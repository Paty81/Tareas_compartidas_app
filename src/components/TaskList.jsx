import React from 'react';
import { Calendar } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onToggle, onDelete }) => {
  if (tasks.length === 0 && !loading) {
    return (
      <div className="text-center py-20 opacity-50 bg-white min-h-[300px] flex flex-col items-center justify-center rounded-b-3xl">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <p className="font-medium text-slate-600">Lista vacía</p>
        <p className="text-sm">¡Comparte el enlace y empezad a añadir tareas!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 rounded-b-3xl min-h-[300px] p-4 space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
