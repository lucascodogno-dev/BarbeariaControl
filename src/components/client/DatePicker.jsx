import React, { useState, useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import useUiStore from '../../store/uiStore';
import { 
  formatDateToBR, 
  getDayOfWeek, 
  generateAvailableDates, 
  isToday 
} from '../../utils/date';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

const DatePicker = () => {
  const { selectedDate, setSelectedDate, fetchAppointmentsByDate } = useAppointmentStore();
  const { setBookingStep, showAlert } = useUiStore();
  
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  
  // Inicializa as datas disponíveis
  useEffect(() => {
    const dates = generateAvailableDates(true); // true para excluir finais de semana
    
    // Define a data atual como selecionada por padrão
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    
    // Configura o mês e ano iniciais
    updateCalendarHeader(dates[0]);
    
    // Gera os dias do calendário
    generateCalendarDays(dates[0]);
  }, [selectedDate, setSelectedDate]);
  
  // Busca os agendamentos quando a data selecionada muda
  useEffect(() => {
    if (selectedDate) {
      fetchAppointmentsByDate(selectedDate);
    }
  }, [selectedDate, fetchAppointmentsByDate]);
  
  // Atualiza o cabeçalho do calendário (mês e ano)
  const updateCalendarHeader = (date) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    setCurrentMonth(months[date.getMonth()]);
    setCurrentYear(date.getFullYear());
  };
  
  // Gera os dias do calendário para o mês atual
  const generateCalendarDays = (startDate) => {
    const date = new Date(startDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Obtém o primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1);
    // Obtém o último dia do mês
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Obtém o dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Array para armazenar os dias do calendário
    const days = [];
    
    // Adiciona dias vazios para o início do mês
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push({ day: null, date: null, disabled: true });
    }
    
    // Data atual para comparações
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Data de amanhã (14 de maio)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Adiciona os dias do mês
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Verifica se é 14 de maio de 2025 (amanhã) - tratamento especial
      const isTomorrow = date.getDate() === tomorrow.getDate() && 
                         date.getMonth() === tomorrow.getMonth() && 
                         date.getFullYear() === tomorrow.getFullYear();
      
      // Verifica se o dia está disponível:
      // 1. Não é fim de semana (0 = domingo, 6 = sábado)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // 2. Não é um dia passado
      const isPastDay = date < today;
      
      // Um dia está disponível se: não é fim de semana E (não é dia passado OU é amanhã - 14 de maio)
      const isAvailable = !isWeekend && (!isPastDay || isTomorrow);
      
      days.push({
        day,
        date: isAvailable ? date : null,
        disabled: !isAvailable
      });
    }
    
    setCalendarDays(days);
  };
  
  // Navega para o mês anterior
  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      const newIndex = currentMonthIndex - 1;
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      
      updateCalendarHeader(newDate);
      generateCalendarDays(newDate);
      setCurrentMonthIndex(newIndex);
    }
  };
  
  // Navega para o próximo mês
  const goToNextMonth = () => {
    // Limita a 1 mês à frente
    if (currentMonthIndex < 1) {
      const newIndex = currentMonthIndex + 1;
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      
      updateCalendarHeader(newDate);
      generateCalendarDays(newDate);
      setCurrentMonthIndex(newIndex);
    }
  };
  
  // Seleciona uma data
  const handleDateSelect = (date) => {
    if (!date) return;
    
    setSelectedDate(date);
    showAlert(`Data selecionada: ${formatDateToBR(date)}`, 'success');
  };
  
  // Avança para o próximo passo
  const handleContinue = () => {
    if (!selectedDate) {
      showAlert('Por favor, selecione uma data para continuar.', 'error');
      return;
    }
    
    setBookingStep(3);
  };
  
  // Volta para o passo anterior
  const handleBack = () => {
    setBookingStep(1);
  };
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Escolha a data
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        {/* Cabeçalho do calendário */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            disabled={currentMonthIndex === 0}
            className={`p-2 rounded-full ${
              currentMonthIndex === 0
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiChevronLeft size={20} />
          </button>
          
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentMonth} {currentYear}
          </div>
          
          <button
            onClick={goToNextMonth}
            disabled={currentMonthIndex === 1}
            className={`p-2 rounded-full ${
              currentMonthIndex === 1
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
            <div
              key={index}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, index) => (
            <div
              key={index}
              className={`
                text-center py-2 rounded-lg transition-colors
                ${
                  item.disabled
                    ? 'text-gray-300 dark:text-gray-600'
                    : selectedDate && item.date && selectedDate.getDate() === item.day && 
                      selectedDate.getMonth() === item.date.getMonth()
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                }
                ${isToday(item.date) ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''}
              `}
              onClick={() => !item.disabled && handleDateSelect(item.date)}
            >
              {item.day}
              
              {/* Indicador de "Hoje" */}
              {isToday(item.date) && (
                <div className="text-[10px] font-medium">
                  Hoje
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Data selecionada */}
      {selectedDate && (
        <div className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-6">
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
            <FiCalendar size={20} />
          </div>
          <div className="ml-4">
            <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">
              Data selecionada
            </div>
            <div className="text-lg text-gray-900 dark:text-white font-semibold">
              {getDayOfWeek(selectedDate)}, {formatDateToBR(selectedDate)}
            </div>
          </div>
        </div>
      )}
      
      {/* Botões de navegação */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Voltar
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedDate}
          className={`
            px-6 py-2 rounded-lg font-medium text-white
            ${
              selectedDate
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }
            transition-colors
          `}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default DatePicker;