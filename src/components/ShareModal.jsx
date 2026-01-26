import React, { useState, useEffect } from 'react';
import { X, Share2, Check, Copy, Link as LinkIcon } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, locations }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Default to selecting all when opened
  useEffect(() => {
    if (isOpen) {
        setSelectedIds(locations.map(l => l.id));
    }
  }, [isOpen, locations]);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(lid => lid !== id));
    } else {
        setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCopy = () => {
    if (selectedIds.length === 0) return;

    const idsString = selectedIds.join(',');
    const origin = window.location.origin;
    const shareUrl = `${origin}/#/${idsString}`;
    
    navigator.clipboard.writeText(shareUrl);
    
    // Close and alert logic handled by parent usually, but here we can just alert
    alert(`¡Enlace copiado! 📋\n\nIncluye ${selectedIds.length} listas.\nURL: ${shareUrl}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-panel w-full max-w-md overflow-hidden rounded-3xl animate-in zoom-in-95 duration-300 shadow-2xl relative bg-white">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
             <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
             </button>
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm">
                    <Share2 size={24} />
                </div>
                <h2 className="text-2xl font-bold">Compartir Grupo</h2>
                <p className="text-indigo-100 text-sm mt-1">Elige qué listas quieres incluir en el enlace</p>
             </div>
        </div>

        {/* List Selection */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
                {locations.map(location => {
                     const isSelected = selectedIds.includes(location.id);
                     // Resolve Name Logic duplicated from TodoPage (simplified)
                     let name = location.name;
                     if (!name && location.id.includes('-')) {
                        const parts = location.id.split('-');
                        name = parts.slice(0, -1).join(' ');
                     }
                     if (!name) name = location.id;

                     return (
                        <div 
                            key={location.id}
                            onClick={() => toggleSelection(location.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                isSelected 
                                ? 'border-indigo-500 bg-indigo-50/50' 
                                : 'border-slate-100 hover:border-indigo-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {/* Icon logic not passed, generic list icon */}
                                    <LinkIcon size={18} />
                                </div>
                                <span className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </span>
                            </div>
                            
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                                {isSelected && <Check size={14} className="text-white stroke-[3]" />}
                            </div>
                        </div>
                     );
                })}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 bg-white">
            <button
                onClick={handleCopy}
                disabled={selectedIds.length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
            >
                <Copy size={20} />
                {selectedIds.length > 0 ? `Copiar Enlace (${selectedIds.length})` : 'Selecciona listas'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
