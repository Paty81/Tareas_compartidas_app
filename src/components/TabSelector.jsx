import React, { useState } from 'react';
import {
  Home,
  Briefcase,
  MapPin,
  Plus,
  X,
  Check,
  Share2,
  ShoppingCart,
  Heart,
  Star,
  Coffee,
  Car,
  Plane,
  Gift,
  Music,
  Book,
  Camera,
  Phone,
  Utensils,
  Dumbbell,
  Gamepad2,
  Baby,
  Dog,
  Palmtree,
  GraduationCap,
  Stethoscope,
  Wrench,
  Paintbrush
} from 'lucide-react';

// Mapa de iconos disponibles
const iconMap = {
  home: Home,
  briefcase: Briefcase,
  pin: MapPin,
  cart: ShoppingCart,
  heart: Heart,
  star: Star,
  coffee: Coffee,
  car: Car,
  plane: Plane,
  gift: Gift,
  music: Music,
  book: Book,
  camera: Camera,
  phone: Phone,
  utensils: Utensils,
  gym: Dumbbell,
  game: Gamepad2,
  baby: Baby,
  dog: Dog,
  palm: Palmtree,
  graduation: GraduationCap,
  health: Stethoscope,
  tools: Wrench,
  art: Paintbrush,
};

// Lista de iconos para el selector
const availableIcons = [
  { id: 'home', icon: Home, label: 'Casa' },
  { id: 'briefcase', icon: Briefcase, label: 'Trabajo' },
  { id: 'cart', icon: ShoppingCart, label: 'Compras' },
  { id: 'heart', icon: Heart, label: 'Favoritos' },
  { id: 'star', icon: Star, label: 'Importante' },
  { id: 'coffee', icon: Coffee, label: 'Café' },
  { id: 'car', icon: Car, label: 'Coche' },
  { id: 'plane', icon: Plane, label: 'Viajes' },
  { id: 'gift', icon: Gift, label: 'Regalos' },
  { id: 'music', icon: Music, label: 'Música' },
  { id: 'book', icon: Book, label: 'Lectura' },
  { id: 'camera', icon: Camera, label: 'Fotos' },
  { id: 'phone', icon: Phone, label: 'Llamadas' },
  { id: 'utensils', icon: Utensils, label: 'Comida' },
  { id: 'gym', icon: Dumbbell, label: 'Gym' },
  { id: 'game', icon: Gamepad2, label: 'Juegos' },
  { id: 'baby', icon: Baby, label: 'Bebé' },
  { id: 'dog', icon: Dog, label: 'Mascota' },
  { id: 'palm', icon: Palmtree, label: 'Vacaciones' },
  { id: 'graduation', icon: GraduationCap, label: 'Estudios' },
  { id: 'health', icon: Stethoscope, label: 'Salud' },
  { id: 'tools', icon: Wrench, label: 'Reparaciones' },
  { id: 'art', icon: Paintbrush, label: 'Arte' },
  { id: 'pin', icon: MapPin, label: 'Otro' },
];

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
  const [selectedIcon, setSelectedIcon] = useState('pin');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      onAddLocation({
        id: newLocationName.toLowerCase().replace(/\s+/g, '-'),
        name: newLocationName,
        icon: selectedIcon,
      });
      setNewLocationName('');
      setSelectedIcon('pin');
      setShowAddForm(false);
      setShowIconPicker(false);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setNewLocationName('');
    setSelectedIcon('pin');
    setShowIconPicker(false);
  };

  const SelectedIconComponent = iconMap[selectedIcon] || MapPin;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Ubicaciones - Todos las ven */}
        {locations.map((location) => {
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

        {/* Botón compartir - Siempre visible a la derecha */}
        <button
          onClick={onShare}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 font-bold text-sm whitespace-nowrap transition-all"
        >
          <Share2 size={16} />
          Compartir
        </button>
      </div>

      {/* Formulario añadir ubicación - Expandido debajo */}
      {isAdmin && showAddForm && (
        <div className="mt-3 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            {/* Botón selector de icono */}
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="p-3 bg-white rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all shrink-0"
              title="Elegir icono"
            >
              <SelectedIconComponent size={20} />
            </button>

            {/* Input nombre */}
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Nombre de la lista..."
              className="flex-grow px-4 py-3 rounded-xl bg-white text-slate-800 text-sm outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
            />

            {/* Botones confirmar/cancelar */}
            <button
              onClick={handleAddLocation}
              disabled={!newLocationName.trim()}
              className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={20} />
            </button>
            <button
              onClick={resetForm}
              className="p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Grid de iconos */}
          {showIconPicker && (
            <div className="bg-white rounded-xl p-3 mt-2">
              <p className="text-xs text-slate-500 mb-2 font-medium">Elige un icono:</p>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {availableIcons.map((item) => {
                  const IconComp = item.icon;
                  const isIconSelected = selectedIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedIcon(item.id);
                        setShowIconPicker(false);
                      }}
                      className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        isIconSelected
                          ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      title={item.label}
                    >
                      <IconComp size={20} />
                      <span className="text-[10px] truncate w-full text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TabSelector;
