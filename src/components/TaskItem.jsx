import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Calendar, Clock, AlertTriangle, Flag, Flame, Star, MessageCircle, Send } from 'lucide-react';
import { gun } from '../config/db';

const priorityOptions = [
  { id: 'none', icon: null, color: '', bg: '', label: 'Sin prioridad' },
  { id: 'low', icon: Flag, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Baja' },
  { id: 'medium', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Media' },
  { id: 'high', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Alta' },
  { id: 'urgent', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-100', label: 'Urgente' },
];

// Don't forget imports! But I can't add imports with replace_file_content in the middle easily without context of top.
// I will rewrite the component definition and imports if needed, but imports are at top.
// I'll assume I have to add imports in a separate step or hope MessageCircle is available?
// Wait, I need to check imports in TaskItem. Step 652 shows `Trash2` etc. `MessageCircle` is NOT imported.
// I will do two edits. One for imports, one for logic.

const TaskItem = ({ task, onToggle, onDelete, onSetPriority, isAdmin, appId, selectedLocation, currentUser }) => {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  
  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  // GunDB for Comments
  // We need 'gun' instance? We don't have it passed.
  // We can import it. `import { gun } from '../config/db';`
  // But I can't add imports here easily. 
  // Code smell: modifying imports separately.
  
  // Let's assume I'll add imports in next step.
  
  React.useEffect(() => {
    if (!showComments || !appId || !selectedLocation) return;
    
    // Subscribe to comments
    // Direct import usage below or assume it acts as closure if I define logic? Not safe.
    // I MUST import gun.
    // I will write the LOGIC here assuming `gun` is available (I will add import next).
    
    const commentsRef = gun.get(appId).get('locations').get(selectedLocation).get('todos').get(task.id).get('comments');
    
    const sub = commentsRef.map().on((data, id) => {
        if (!data) return;
        setComments(prev => {
            if (prev.find(c => c.id === id)) return prev;
            return [...prev, { ...data, id }].sort((a,b) => a.createdAt - b.createdAt);
        });
    });
    
    return () => sub.off();
  }, [showComments, task.id, appId, selectedLocation]);

  const handleAddComment = (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      
      const commentData = {
          text: newComment.trim(),
          createdAt: Date.now(),
          author: currentUser ? currentUser.alias : "Anónimo"
          // Ideally pass `currentUser` or `userAlias` to TaskItem.
          // For now, let's just say "Usuario". 
          // Or better: Pass `userAlias` from TaskList -> TodoPage.
      };
      
      gun.get(appId).get('locations').get(selectedLocation).get('todos').get(task.id).get('comments').set(commentData);
      setNewComment("");
  };

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

  return (
    <div className={`glass-card group flex flex-col rounded-2xl p-4 transition-all hover:-translate-y-1 ${task.completed ? 'bg-slate-50/60' : ''}`}>
       <div className="flex items-start gap-4">
          {/* ... Checkbox & Content & Actions (Original Top Row) ... */}
          {/* I will replicate the original JSX structure mostly but wrap it or append comment section */}
          {/* NOTE: To save context size, I will replace the WHOLE return to include comments. */}
          
          {/* Checkbox */}
          <button onClick={() => onToggle(task)} className={`mt-1 shrink-0 rounded-full transition-transform active:scale-95 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:scale-110 hover:text-indigo-500'}`}>
            {task.completed ? <CheckCircle size={28} className="fill-emerald-100 stroke-[2.5]" /> : <Circle size={28} className="stroke-[2.5]" />}
          </button>

          {/* Content */}
          <div className="min-w-0 flex-grow pt-1">
             <div className="flex items-start gap-2">
                 {PriorityIcon && !task.completed && (
                    <div className={`mt-0.5 rounded-lg p-1 ${currentPriority.bg} ${currentPriority.color}`}>
                       <PriorityIcon size={14} strokeWidth={2.5} />
                    </div>
                 )}
                 <p className={`break-words text-[1.05rem] font-medium leading-normal ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {task.text}
                 </p>
             </div>
             
             {/* Metadata */}
             <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                 {/* ... (Existing Badges) ... */}
                 {task.priority && task.priority !== 'none' && !task.completed && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${currentPriority.bg} ${currentPriority.color}`}>
                       {PriorityIcon && <PriorityIcon size={10} />}
                       {currentPriority.label}
                    </span>
                 )}
                 <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{task.authorName || 'Anónimo'}</span>
                 <span className="flex items-center gap-1 text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5">
                     <Clock size={10} />
                     {formatTime(task.createdAt)}
                     <span className="text-slate-300">|</span>
                     {formatDate(task.createdAt)}
                 </span>
                 {task.scheduledDate && (
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-sm ${isScheduledForFuture ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 ring-1 ring-orange-200' : 'bg-slate-100 text-slate-500'}`}>
                        <Calendar size={12} />
                        {formatDate(task.scheduledDate)} {formatTime(task.scheduledDate)}
                    </span>
                 )}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 gap-1 opacity-100 transition-opacity items-start">
             {/* Comment Toggle Button */}
             <button
               onClick={() => setShowComments(!showComments)}
               className={`rounded-xl p-2 transition-colors ${showComments ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-500'}`}
               title="Comentarios"
             >
                <div className="relative">
                   <MessageCircle size={18} />
                   {/* We could show count if we had it, but for now just dot if comments exist? Hard without subscribing all. */}
                </div>
             </button>

             {isAdmin && !task.completed && (
               <div className="relative">
                 <button onClick={() => setShowPriorityMenu(!showPriorityMenu)} className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" title="Cambiar prioridad">
                    <Flag size={18} />
                 </button>
                 {showPriorityMenu && (
                    <div className="absolute right-0 top-full z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                        {priorityOptions.map((opt) => (
                           <button key={opt.id} onClick={() => handlePrioritySelect(opt.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                              {opt.icon ? <opt.icon size={14} className={opt.color} /> : <div className="h-3.5 w-3.5" />}
                              {opt.label}
                           </button>
                        ))}
                    </div>
                 )}
               </div>
             )}
             
             <button onClick={() => onDelete(task.id)} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500" title="Eliminar">
                <Trash2 size={18} />
             </button>
          </div>
       </div>

       {/* Comments Section */}
       {showComments && (
           <div className="mt-4 pl-4 border-l-2 border-indigo-100 space-y-3 animate-in fade-in slide-in-from-top-2">
               {/* List */}
               <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                   {comments.length === 0 && <p className="text-xs text-slate-400 italic">No hay comentarios aún.</p>}
                   {comments.map(comment => (
                       <div key={comment.id} className="bg-slate-50 p-2 rounded-lg rounded-tl-none text-sm">
                           <p className="text-slate-700">{comment.text}</p>
                           <p className="text-[10px] text-slate-400 mt-1 flex justify-between">
                               <span>{comment.author || 'Anónimo'}</span>
                               <span>{new Date(comment.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                           </p>
                       </div>
                   ))}
               </div>
               
               {/* Input */}
               <form onSubmit={handleAddComment} className="flex gap-2">
                   <input
                       type="text"
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       placeholder="Escribe una respuesta..."
                       className="flex-grow px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                       autoFocus
                   />
                   <button type="submit" disabled={!newComment.trim()} className="p-1.5 bg-indigo-500 text-white rounded-lg disabled:opacity-50">
                       <Send size={14} />
                   </button>
               </form>
           </div>
       )}
    </div>

  );
};

export default TaskItem;
