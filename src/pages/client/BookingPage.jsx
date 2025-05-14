import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceSelection from '../../components/client/ServiceSelection';
import DatePicker from '../../components/client/DatePicker';
import TimeSlotGrid from '../../components/client/TimeSlotGrid';
import ClientForm from '../../components/client/ClientForm';
import BookingSummary from '../../components/client/BookingSummary';
import useAppointmentStore from '../../store/appointmentStore';
import useUiStore from '../../store/uiStore';
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

const BookingPage = () => {
  const navigate = useNavigate();
  const { bookingStep } = useUiStore();
  const { 
    selectedService, 
    selectedDate, 
    selectedTime, 
    setupSocketListeners, 
    cleanupSocketListeners 
  } = useAppointmentStore();
  
  // Configura os listeners de socket quando o componente monta
  useEffect(() => {
    setupSocketListeners();
    
    // Limpa os listeners quando o componente desmonta
    return () => {
      cleanupSocketListeners();
    };
  }, [setupSocketListeners, cleanupSocketListeners]);
  
  // Renderiza o passo atual do processo de agendamento
  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return <ServiceSelection />;
      case 2:
        return <DatePicker />;
      case 3:
        return <TimeSlotGrid />;
      case 4:
        return <ClientForm />;
      case 5:
        return <BookingSummary />;
      default:
        return <ServiceSelection />;
    }
  };
  
  // Voltar para a página inicial
  const handleBack = () => {
    navigate('/');
  };
  
  // Renderiza o título da etapa atual
  const getStepTitle = () => {
    switch (bookingStep) {
      case 1:
        return 'Escolha o serviço';
      case 2:
        return 'Selecione a data';
      case 3:
        return 'Escolha o horário';
      case 4:
        return 'Seus dados';
      case 5:
        return 'Confirmar agendamento';
      default:
        return 'Agendar';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Título e botão de voltar */}
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Voltar"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getStepTitle()}
        </h1>
      </div>
      
      {/* Progresso */}
      <div className="mb-8">
        <div className="overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 bg-indigo-600 transition-all duration-500"
            style={{ width: `${(bookingStep / 5) * 100}%` }}
          ></div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          <div 
            className={`flex flex-col items-center ${
              bookingStep >= 1 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center mb-1
              ${
                bookingStep >= 1
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }
            `}>
              <FiCalendar size={16} />
            </div>
            <span className="text-xs font-medium hidden sm:block">Serviço</span>
          </div>
          
          <div 
            className={`flex flex-col items-center ${
              bookingStep >= 2 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center mb-1
              ${
                bookingStep >= 2
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }
            `}>
              <FiCalendar size={16} />
            </div>
            <span className="text-xs font-medium hidden sm:block">Data</span>
          </div>
          
          <div 
            className={`flex flex-col items-center ${
              bookingStep >= 3 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center mb-1
              ${
                bookingStep >= 3
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }
            `}>
              <FiClock size={16} />
            </div>
            <span className="text-xs font-medium hidden sm:block">Horário</span>
          </div>
          
          <div 
            className={`flex flex-col items-center ${
              bookingStep >= 4 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center mb-1
              ${
                bookingStep >= 4
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }
            `}>
              <FiUser size={16} />
            </div>
            <span className="text-xs font-medium hidden sm:block">Dados</span>
          </div>
          
          <div 
            className={`flex flex-col items-center ${
              bookingStep >= 5 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center mb-1
              ${
                bookingStep >= 5
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }
            `}>
              <FiCheckCircle size={16} />
            </div>
            <span className="text-xs font-medium hidden sm:block">Confirmar</span>
          </div>
        </div>
      </div>
      
      {/* Conteúdo do passo atual */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {renderBookingStep()}
        </div>
      </div>
      
      {/* Resumo da seleção atual */}
      {bookingStep > 1 && bookingStep < 5 && (
        <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
            Seleção atual
          </h3>
          
          <div className="flex flex-wrap gap-4">
            {selectedService && (
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-indigo-100 dark:border-indigo-800">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                  <FiCalendar size={16} />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedService.name} - R$ {selectedService.price.toFixed(2)}
                </span>
              </div>
            )}
            
            {selectedDate && (
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-indigo-100 dark:border-indigo-800">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                  <FiCalendar size={16} />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedDate.toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            
            {selectedTime && (
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-indigo-100 dark:border-indigo-800">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                  <FiClock size={16} />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedTime}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;