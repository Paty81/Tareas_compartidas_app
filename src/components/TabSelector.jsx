import React, { useState } from 'react';
import { Home, Briefcase, MapPin, Plus, X, Check, Share2 } from 'lucide-react';

const iconMap = {
  home: Home,
  briefcase: Briefcase,
  pin: MapPin,
};

const TabSelector = ({
  selectedLocation,
  onLocationChange,
  locations,
  onAddLocation,
  onShare,
  isAdmin
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      onAddLocation({
        id: newLocationName.toLowerCase().replace(/\s+/g, '-'),
        name: newLocationName,
        icon: 'pin',
      });
      setNewLocationName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Ubicaciones - Solo admin las ve */}
        {isAdmin && locations.map((location) => {
          const IconComponent = iconMap[location.icon] || MapPin;
          const isSelected = selectedLocation === location.id;

          return (
            <button
              key={location.id}
              onClick={() => onLocationChange(location.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-white text-indigo-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <IconComponent size={16} />
              {location.name}
            </button>
          );
        })}

        {/* Botón añadir ubicación - Solo admin */}
        {isAdmin && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/20 border-2 border-dashed border-white/30 transition-all text-sm"
          >
            <Plus size={16} />
            Nueva
          </button>
        )}

        {/* Formulario añadir ubicación */}
        {isAdmin && showAddForm && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Nombre..."
              className="px-3 py-2 rounded-xl bg-white text-slate-800 text-sm w-32 outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
            />
            <button
              onClick={handleAddLocation}
              className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewLocationName('');
              }}
              className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Botón compartir - Siempre visible a la derecha */}
        <button
          onClick={onShare}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 font-bold text-sm whitespace-nowrap transition-all"
        >
          <Share2 size={16} />
          Compartir
        </button>
      </div>
    </div>
  );
};

export default TabSelector;
