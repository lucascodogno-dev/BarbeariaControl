import React from "react";

const TimeSelector = ({ slots, selectedTime, onSelect, label }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <div className="grid grid-cols-3 gap-2 mt-2">
      {slots.length === 0 ? (
        <p className="text-gray-500 col-span-3">Nenhum horário disponível</p>
      ) : (
        slots.map(({ time, isBooked }) => (
          <button
            key={time}
            disabled={isBooked}
            onClick={() => onSelect(time)}
            className={`px-2 py-1 rounded text-sm border transition ${
              isBooked
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : selectedTime === time
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-700 border-gray-300 text-gray-700 dark:text-white hover:bg-indigo-50"
            }`}
          >
            {time}
          </button>
        ))
      )}
    </div>
  </div>
);

export default TimeSelector;
