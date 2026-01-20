import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';

const DatePicker = ({ selectedDate, onSelectDate, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const [hours, minutes] = selectedTime.split(':');
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      parseInt(hours),
      parseInt(minutes)
    );
    onSelectDate(date);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-lg">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-7 gap-1 p-3 bg-slate-50">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 p-3">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const past = isPast(day);

            return (
              <button
                key={day}
                onClick={() => !past && handleDateClick(day)}
                disabled={past}
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all mx-auto
                  ${isToday(day)
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : past
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'hover:bg-purple-100 text-slate-700 hover:scale-110'
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Time selector */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50">
          <Clock size={20} className="text-purple-500" />
          <span className="text-sm text-slate-600">Hora:</span>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="flex-grow px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 outline-none focus:border-purple-400 text-center font-medium"
          />
        </div>

        {/* Actions */}
        <div className="p-4 flex gap-2 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const [hours, minutes] = selectedTime.split(':');
              today.setHours(parseInt(hours), parseInt(minutes));
              onSelectDate(today);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 font-bold text-sm shadow-lg"
          >
            Hoy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
