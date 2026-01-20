import React, { useState } from 'react';
import { Home, Briefcase, MapPin, Plus, X, Check } from 'lucide-react';

const defaultLocations = [
  { id: 'casa', name: 'Casa', icon: 'home', color: 'emerald' },
  { id: 'trabajo', name: 'Trabajo', icon: 'briefcase', color: 'blue' },
];

const iconMap = {
  home: Home,
  briefcase: Briefcase,
  pin: MapPin,
};

const colorMap = {
  emerald: 'from-emerald-500 to-teal-500',
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  orange: 'from-orange-500 to-amber-500',
  rose: 'from-rose-500 to-red-500',
};

const LocationSelector = ({
  locations = defaultLocations,
  selectedLocation,
  onSelectLocation,
  onAddLocation
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      const colors = ['purple', 'orange', 'rose'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      onAddLocation({
        id: newLocationName.toLowerCase().replace(/\s+/g, '-'),
        name: newLocationName,
        icon: 'pin',
        color: randomColor,
      });
      setNewLocationName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {locations.map((location) => {
          const IconComponent = iconMap[location.icon] || MapPin;
          const isSelected = selectedLocation === location.id;

          return (
            <button
              key={location.id}
              onClick={() => onSelectLocation(location.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${colorMap[location.color]} text-white shadow-lg scale-105`
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <IconComponent size={18} />
              {location.name}
              {isSelected && <Check size={16} className="ml-1" />}
            </button>
          );
        })}

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white border-2 border-dashed border-slate-200 transition-all text-sm"
          >
            <Plus size={18} />
            Nueva
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Nombre..."
              className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm w-28 outline-none focus:border-violet-400"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
            />
            <button
              onClick={handleAddLocation}
              className="p-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewLocationName('');
              }}
              className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
