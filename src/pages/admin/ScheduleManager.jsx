// components/ScheduleManager.jsx
import React, { useState, useEffect } from 'react';

import useUiStore from '../../store/uiStore';
import { FiClock, FiSave, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import useScheduleStore from '../../store/scheduleStore';

const daysOfWeek = [
  { id: 'monday', name: 'Segunda-feira' },
  { id: 'tuesday', name: 'Terça-feira' },
  { id: 'wednesday', name: 'Quarta-feira' },
  { id: 'thursday', name: 'Quinta-feira' },
  { id: 'friday', name: 'Sexta-feira' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' }
];

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${String(hours).padStart(2, '0')}:${minutes}`;
});

const ScheduleManager = () => {
  const { schedule, fetchSchedule, updateSchedule, loading } = useScheduleStore();
  const { showAlert } = useUiStore();
  const [editingDay, setEditingDay] = useState(null);
  const [formData, setFormData] = useState({
    isClosed: false,
    openingTime: '08:00',
    closingTime: '18:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    hasLunchBreak: false,
    slotDuration: 30
  });

  useEffect(() => {
    fetchSchedule();
    return () => {};
  }, [fetchSchedule]);

  const handleEdit = (day) => {
    const dayData = schedule?.[day] || {
      isClosed: false,
      openingTime: '08:00',
      closingTime: '18:00',
      lunchStart: '12:00',
      lunchEnd: '13:00',
      hasLunchBreak: false,
      slotDuration: 30
    };
    
    setFormData(dayData);
    setEditingDay(day);
  };

  const handleCancel = () => {
    setEditingDay(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSchedule(editingDay, formData);
      showAlert(`Horários de ${daysOfWeek.find(d => d.id === editingDay)?.name} atualizados com sucesso!`, 'success');
      setEditingDay(null);
    } catch (error) {
      console.error('Erro ao atualizar horários:', error);
      showAlert('Erro ao atualizar horários. Tente novamente.', 'error');
    }
  };

  const renderDayCard = (day) => {
    const dayData = schedule?.[day.id] || {
      isClosed: true,
      openingTime: '08:00',
      closingTime: '18:00'
    };

    return (
      <div key={day.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{day.name}</h3>
          {editingDay !== day.id && (
            <button
              onClick={() => handleEdit(day.id)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              title="Editar horários"
            >
              <FiEdit2 size={18} />
            </button>
          )}
        </div>

        {editingDay === day.id ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`${day.id}-closed`}
                name="isClosed"
                checked={formData.isClosed}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor={`${day.id}-closed`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Fechado neste dia
              </label>
            </div>

            {!formData.isClosed && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={`${day.id}-opening`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Abertura
                    </label>
                    <select
                      id={`${day.id}-opening`}
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      disabled={formData.isClosed}
                    >
                      {timeOptions.map(time => (
                        <option key={`open-${time}`} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`${day.id}-closing`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Fechamento
                    </label>
                    <select
                      id={`${day.id}-closing`}
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      disabled={formData.isClosed}
                    >
                      {timeOptions.map(time => (
                        <option key={`close-${time}`} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${day.id}-lunch`}
                    name="hasLunchBreak"
                    checked={formData.hasLunchBreak}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    disabled={formData.isClosed}
                  />
                  <label htmlFor={`${day.id}-lunch`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Pausa para almoço
                  </label>
                </div>

                {formData.hasLunchBreak && !formData.isClosed && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor={`${day.id}-lunchStart`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Início
                      </label>
                      <select
                        id={`${day.id}-lunchStart`}
                        name="lunchStart"
                        value={formData.lunchStart}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      >
                        {timeOptions.map(time => (
                          <option key={`lunch-start-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${day.id}-lunchEnd`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Término
                      </label>
                      <select
                        id={`${day.id}-lunchEnd`}
                        name="lunchEnd"
                        value={formData.lunchEnd}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                      >
                        {timeOptions.map(time => (
                          <option key={`lunch-end-${time}`} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor={`${day.id}-duration`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Duração do slot (minutos)
                  </label>
                  <select
                    id={`${day.id}-duration`}
                    name="slotDuration"
                    value={formData.slotDuration}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    disabled={formData.isClosed}
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiX size={16} className="inline mr-1" /> Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                <FiSave size={16} className="inline mr-1" /> Salvar
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm">
            {dayData.isClosed ? (
              <span className="text-red-600 dark:text-red-400">Fechado</span>
            ) : (
              <div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiClock size={14} className="mr-1" />
                  <span>{dayData.openingTime} - {dayData.closingTime}</span>
                </div>
                {dayData.hasLunchBreak && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pausa: {dayData.lunchStart} - {dayData.lunchEnd}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Duração do slot: {dayData.slotDuration || 30} min
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Horários de Atendimento
        </h2>
      </div>

      {loading && !schedule ? (
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map(day => (
            <div key={day.id} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map(day => renderDayCard(day))}
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;