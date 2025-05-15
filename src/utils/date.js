
// Formata a data para o formato YYYY-MM-DD
export const formatDateToISO = (date) => {
  return date.toISOString().split('T')[0];
};

// Formata a data para exibição (DD/MM/YYYY)
export const formatDateToBR = (dateStr) => {
  if (!dateStr) return '';
  
  if (dateStr instanceof Date) {
    const day = String(dateStr.getDate()).padStart(2, '0');
    const month = String(dateStr.getMonth() + 1).padStart(2, '0');
    const year = dateStr.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

// Gera um array de datas disponíveis (a partir da data atual até um mês à frente)
export const generateAvailableDates = (excludeWeekends = false) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Data um mês à frente
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  
  for (let date = new Date(today); date <= oneMonthLater; date.setDate(date.getDate() + 1)) {
    // Se excludeWeekends for true, pula sábados (6) e domingos (0)
    if (excludeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
      continue;
    }
    
    dates.push(new Date(date));
  }
  
  return dates;
};

// Gera horários disponíveis a partir de um horário inicial e final, com intervalo em minutos
export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  const slots = [];
  
  // Converte hora no formato "HH:MM" para um objeto Date para facilitar cálculos
  const getDateFromTimeStr = (timeStr, baseDate = new Date()) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  
  const formatTimeSlot = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const start = getDateFromTimeStr(startTime);
  const end = getDateFromTimeStr(endTime);
  
  // Intervalo em milissegundos
  const interval = intervalMinutes * 60 * 1000;
  
  for (let time = start; time < end; time = new Date(time.getTime() + interval)) {
    slots.push(formatTimeSlot(time));
  }
  
  return slots;
};

// Verifica se uma data é hoje
export const isToday = (date) => {
  if (!date) return false; // 🚨 proteção
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};


// Verifica se uma data já passou
export const isPastDate = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateStr instanceof Date) {
    return dateStr < today;
  }
  
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date < today;
};

// Verifica se o horário já passou ou é após o limite (para o dia de hoje)
export const isPastTime = (timeStr, dateStr) => {
  const now = new Date();
  const today = formatDateToISO(now);
  
  // Se não for hoje, não importa o horário
  if (dateStr !== today) return false;
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Verifica se o horário é após 20h (limite de agendamento para o dia atual)
if (now.getHours() >= 20 && dateStr === today) return true;

  
  const timeDate = new Date();
  timeDate.setHours(hours, minutes, 0, 0);
  
  return timeDate <= now;
};

// Obtém o nome do dia da semana (em português)
export const getDayOfWeek = (date) => {
  const days = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  return days[date.getDay()];
};

// Obtém o nome do mês (em português)
export const getMonthName = (date) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[date.getMonth()];
};

// Formata a data para exibição (Nome do dia, DD de Nome do Mês)
export const formatDateFull = (date) => {
  const day = date.getDate();
  return `${getDayOfWeek(date)}, ${day} de ${getMonthName(date)}`;
};

// utils/date.js
// utils/date.js
export const isTimeBetween = (time, startTime, endTime) => {
  const [timeHours, timeMinutes] = time.split(':').map(Number);
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const timeInMinutes = timeHours * 60 + timeMinutes;
  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;

  return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
};