import React, { useEffect, useState } from 'react';
import { getBookings, cleanExpiredBookings } from '../../utils/localStorage';
import { formatDateToBR, isPastDate } from '../../utils/date';
import { FiClock, FiCheck, FiX, FiAlertCircle, FiCalendar, FiScissors } from 'react-icons/fi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Limpa agendamentos expirados
    cleanExpiredBookings();
    
    // Carrega os agendamentos do localStorage
    loadBookings();
  }, []);
  
  const loadBookings = () => {
    setLoading(true);
    
    // Verifica se há agendamentos no localStorage
    const upcomingBookings = getBookings(false, true);
    const pastBookings = getBookings(true, false);
    
    // Organiza por data (mais recentes primeiro)
    const sortedUpcoming = upcomingBookings.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });
    
    const sortedPast = pastBookings.sort((a, b) => {
      if (a.date === b.date) {
        return b.time.localeCompare(a.time);
      }
      return b.date.localeCompare(a.date);
    });
    
    setBookings({
      upcoming: sortedUpcoming,
      past: sortedPast
    });
    
    setLoading(false);
  };
  
  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Obtém a cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'cancelado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'concluido':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };
  
  // Obtém o ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'agendado':
        return <FiClock size={14} />;
      case 'cancelado':
        return <FiX size={14} />;
      case 'concluido':
        return <FiCheck size={14} />;
      default:
        return <FiAlertCircle size={14} />;
    }
  };

  // Renderiza um agendamento
  const renderBookingCard = (booking) => (
    <div 
      key={booking.id} 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {booking.serviceName}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatPrice(booking.servicePrice)}
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span className="ml-1">
            {booking.status === 'agendado' ? 'Agendado' : 
             booking.status === 'cancelado' ? 'Cancelado' : 
             booking.status === 'concluido' ? 'Concluído' : booking.status}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <FiCalendar size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
          <span>{formatDateToBR(booking.date)}</span>
        </div>
        <div className="flex items-center">
          <FiClock size={16} className="mr-2 text-gray-400 dark:text-gray-500" />
          <span>{booking.time}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Seus agendamentos
      </h2>
      
      {/* Abas */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximos
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'past'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Anteriores
        </button>
      </div>
      
      {/* Conteúdo */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((item) => (
            <div 
              key={item}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings[activeTab] && bookings[activeTab].length > 0 ? (
            bookings[activeTab].map(renderBookingCard)
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-3 text-4xl">
                <FiScissors className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Nenhum agendamento {activeTab === 'upcoming' ? 'futuro' : 'anterior'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === 'upcoming'
                  ? 'Você não tem nenhum agendamento futuro. Que tal agendar um corte agora?'
                  : 'Você não tem nenhum agendamento anterior.'}
              </p>
              {activeTab === 'upcoming' && (
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Agendar agora
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;