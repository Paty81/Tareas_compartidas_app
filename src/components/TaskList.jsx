import React from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onToggle, onDelete, onSetPriority, isAdmin, appId, selectedLocation, currentUser }) => {
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

  // Separar tareas
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Agrupar tareas por prioridad
  const groups = {
    urgent: { label: 'URGENTE', color: 'text-rose-600', bg: 'bg-rose-100', tasks: [] },
    high: { label: 'ALTA', color: 'text-orange-600', bg: 'bg-orange-100', tasks: [] },
    medium: { label: 'MEDIA', color: 'text-amber-500', bg: 'bg-amber-100', tasks: [] },
    low: { label: 'BAJA / NORMAL', color: 'text-blue-600', bg: 'bg-blue-100', tasks: [] },
  };

  pendingTasks.forEach(t => {
      if (t.priority === 'urgent') groups.urgent.tasks.push(t);
      else if (t.priority === 'high') groups.high.tasks.push(t);
      else if (t.priority === 'medium') groups.medium.tasks.push(t);
      else groups.low.tasks.push(t);
  });

  // Sort within groups by time (Newest first)
  Object.values(groups).forEach(g => {
      g.tasks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  });

  // Clock for Agenda View
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const timeString = currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-slate-50/50 min-h-[300px] pb-48 relative">
      
      {/* Agenda Time Indicator */}
      <div className="sticky top-0 z-20 flex items-center justify-center gap-2 py-3 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 mb-2">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
             AHORA: {timeString}
          </div>
      </div>

      <div className="px-4 space-y-6">
        {['urgent', 'high', 'medium', 'low'].map(key => {
            const group = groups[key];
            if (group.tasks.length === 0) return null;

            return (
                <div key={key} className="relative mb-6">
                    {/* Sticky Section Header */}
                    <div className="sticky top-12 z-10 bg-slate-50/95 py-2 mb-4 backdrop-blur-md flex items-center gap-3 border-b border-slate-100 shadow-sm">
                        <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full ${group.bg} ${group.color} ml-16`}>
                            {group.label}
                        </span>
                        <div className={`h-px flex-grow ${group.bg.replace('bg-', 'bg-')}`} style={{ opacity: 0.5 }}></div>
                    </div>

                    {/* Timeline Flex Layout */}
                    <div className="space-y-0 relative"> 
                        {/* Continuous Vertical Line (Background) - Stronger visibility */}
                        <div className="absolute left-[5.5rem] top-0 bottom-0 w-0.5 bg-indigo-100 z-0"/>

                        {group.tasks.map((task, idx) => (
                            <div key={task.id} className="flex gap-4 relative z-10 group border-b border-slate-100 last:border-0 hover:bg-white/50 transition-colors">
                                
                                {/* 1. Time Column */}
                                <div className="w-16 flex-none text-right py-4">
                                    <span className="text-[11px] font-bold font-mono text-slate-500 block">
                                        {new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>

                                {/* 2. Timeline Graphic Column */}
                                <div className="w-4 flex-none flex flex-col items-center pt-5">
                                    {/* Dot connector */}
                                    <div className={`w-3 h-3 rounded-full border-2 z-10 bg-white transition-all shadow-sm ${
                                        task.completed ? 'border-emerald-400 bg-emerald-50' : 'border-indigo-400 group-hover:scale-125 group-hover:border-indigo-600'
                                    }`} />
                                </div>

                                {/* 3. Task Card Column */}
                                <div className="flex-grow py-2 pr-2 min-w-0">
                                    <TaskItem
                                        task={task}
                                        onToggle={onToggle}
                                        onDelete={onDelete}
                                        onSetPriority={onSetPriority}
                                        isAdmin={isAdmin}
                                        appId={appId}
                                        selectedLocation={selectedLocation}
                                        currentUser={currentUser}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}

        {/* Separador si hay tareas completadas */}
        {completedTasks.length > 0 && pendingTasks.length > 0 && (
            <div className="flex items-center gap-3 py-6 opacity-60">
            <div className="flex-grow h-px bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">HISTORIAL (Completadas)</span>
            <div className="flex-grow h-px bg-slate-300" />
            </div>
        )}

        {/* Tareas completadas */}
        <div className="space-y-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {completedTasks.map((task) => (
                <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onSetPriority={onSetPriority}
                isAdmin={isAdmin}
                appId={appId}
                selectedLocation={selectedLocation}
                currentUser={currentUser}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
