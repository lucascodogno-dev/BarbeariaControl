// src/utils/localStorage.js
/**
 * Funções de utilidade para manipulação do localStorage
 */

import { isPastDate, isPastTime } from './date';

// Chaves do localStorage
const KEYS = {
  USER_INFO: 'barbershop-user-info',
  PAST_BOOKINGS: 'barbershop-past-bookings',
  UPCOMING_BOOKINGS: 'barbershop-upcoming-bookings',
  THEME: 'barbershop-theme'
};

// Salva informações do usuário
export const saveUserInfo = (userInfo) => {
  try {
    localStorage.setItem(KEYS.USER_INFO, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('Erro ao salvar informações do usuário:', error);
    return false;
  }
};

// Obtém informações do usuário
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    return null;
  }
};

// Salva um agendamento no localStorage
export const saveBooking = (booking) => {
  try {
    // Determina se é um agendamento passado ou futuro
const pad = (n) => String(n).padStart(2, '0');
const today = new Date();
const localToday = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    
const isPast = isPastDate(booking.date) || 
  (booking.date === localToday && isPastTime(booking.time, booking.date));
    
    const storageKey = isPast ? KEYS.PAST_BOOKINGS : KEYS.UPCOMING_BOOKINGS;
    
    // Obtém os agendamentos existentes
    const existingBookings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Adiciona o novo agendamento
    existingBookings.push(booking);
    
    // Salva de volta no localStorage
    localStorage.setItem(storageKey, JSON.stringify(existingBookings));
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    return false;
  }
};

// Obtém os agendamentos do localStorage
export const getBookings = (pastOnly = false, upcomingOnly = false) => {
  try {
    // Se pastOnly for true, retorna apenas agendamentos passados
    if (pastOnly) {
      return JSON.parse(localStorage.getItem(KEYS.PAST_BOOKINGS) || '[]');
    }
    
    // Se upcomingOnly for true, retorna apenas agendamentos futuros
    if (upcomingOnly) {
      return JSON.parse(localStorage.getItem(KEYS.UPCOMING_BOOKINGS) || '[]');
    }
    
    // Caso contrário, retorna todos os agendamentos
    const pastBookings = JSON.parse(localStorage.getItem(KEYS.PAST_BOOKINGS) || '[]');
    const upcomingBookings = JSON.parse(localStorage.getItem(KEYS.UPCOMING_BOOKINGS) || '[]');
    
    return [...pastBookings, ...upcomingBookings];
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    return [];
  }
};

// Limpa agendamentos expirados
export const cleanExpiredBookings = () => {
  try {
    // Obtém os agendamentos que supostamente são futuros
    const upcomingBookings = JSON.parse(localStorage.getItem(KEYS.UPCOMING_BOOKINGS) || '[]');
    
    // Filtra para separar os que realmente são futuros dos que já passaram
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const stillUpcoming = [];
    const newPastBookings = [];
    
    upcomingBookings.forEach(booking => {
      // Verifica se o agendamento já passou
      if (booking.date < today) {
        // Se a data for anterior a hoje, é passado
        newPastBookings.push(booking);
      } else if (booking.date === today) {
        // Se for hoje, verifica o horário
        const [bookingHour, bookingMinute] = booking.time.split(':').map(Number);
        
        if (bookingHour < currentHour || (bookingHour === currentHour && bookingMinute < currentMinute)) {
          // Se o horário já passou, é um agendamento passado
          newPastBookings.push(booking);
        } else {
          // Senão, continua sendo futuro
          stillUpcoming.push(booking);
        }
      } else {
        // Se a data for futura, continua sendo um agendamento futuro
        stillUpcoming.push(booking);
      }
    });
    
    // Atualiza os agendamentos futuros
    localStorage.setItem(KEYS.UPCOMING_BOOKINGS, JSON.stringify(stillUpcoming));
    
    // Adiciona os novos agendamentos passados aos existentes
    if (newPastBookings.length > 0) {
      const existingPastBookings = JSON.parse(localStorage.getItem(KEYS.PAST_BOOKINGS) || '[]');
      localStorage.setItem(KEYS.PAST_BOOKINGS, JSON.stringify([...existingPastBookings, ...newPastBookings]));
    }
    
    // Retorna a quantidade de agendamentos que foram movidos
    return newPastBookings.length;
  } catch (error) {
    console.error('Erro ao limpar agendamentos expirados:', error);
    return 0;
  }
};

// Remove um agendamento específico do localStorage
// Remove um agendamento específico do localStorage
export const removeBooking = (bookingId) => {
  try {
    // Tenta remover dos agendamentos futuros
    let upcomingBookings = JSON.parse(localStorage.getItem(KEYS.UPCOMING_BOOKINGS) || '[]');
    const upcomingIndex = upcomingBookings.findIndex(b => b.id === bookingId);
    
    if (upcomingIndex !== -1) {
      upcomingBookings.splice(upcomingIndex, 1);
      localStorage.setItem(KEYS.UPCOMING_BOOKINGS, JSON.stringify(upcomingBookings));
      return true;
    }
    
    // Se não estiver nos futuros, tenta remover dos passados
    let pastBookings = JSON.parse(localStorage.getItem(KEYS.PAST_BOOKINGS) || '[]');
    const pastIndex = pastBookings.findIndex(b => b.id === bookingId);
    
    if (pastIndex !== -1) {
      pastBookings.splice(pastIndex, 1);
      localStorage.setItem(KEYS.PAST_BOOKINGS, JSON.stringify(pastBookings));
      return true;
    }
    
    return false; // Não encontrou o agendamento
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    return false;
  }
};

// Limpa todos os dados do localStorage relacionados à barbearia
export const clearAllBookingData = () => {
  try {
    localStorage.removeItem(KEYS.USER_INFO);
    localStorage.removeItem(KEYS.PAST_BOOKINGS);
    localStorage.removeItem(KEYS.UPCOMING_BOOKINGS);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};
