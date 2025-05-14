import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppointmentStore from '../../store/appointmentStore';
import useUiStore from '../../store/uiStore';
import { getUserInfo } from '../../utils/localStorage';
import { formatDateToBR, formatDateFull } from '../../utils/date';
import { saveBooking } from '../../utils/localStorage';
import { FiCheck, FiCalendar, FiClock, FiScissors, FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

const BookingSummary = () => {
  const navigate = useNavigate();
  const { 
    selectedService, 
    selectedDate, 
    selectedTime, 
    createAppointment,
    setSelectedDate,
    setSelectedService,
    setSelectedTime
  } = useAppointmentStore();
  
  const { setBookingStep, showAlert } = useUiStore();
  
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  
  // Obtém os dados do cliente do localStorage
  const clientData = getUserInfo() || {};
  
  // Verifica se todos os dados necessários estão disponíveis
  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime) {
      showAlert('Por favor, complete todas as etapas do agendamento', 'error');
      setBookingStep(1); // Volta para a primeira etapa
    }
  }, [selectedService, selectedDate, selectedTime, showAlert, setBookingStep]);
  
  // Volta para o passo anterior
  const handleBack = () => {
    setBookingStep(4);
  };
  
  // Confirma o agendamento
  const handleConfirm = async () => {
    if (loading) return;
    
    // Verificação adicional antes de prosseguir
    if (!selectedService || !selectedDate || !selectedTime) {
      showAlert('Dados incompletos. Por favor, reinicie o processo de agendamento.', 'error');
      return;
    }
    
    setLoading(true);
    const pad = (n) => String(n).padStart(2, '0');
    try {
      // Prepara os dados do agendamento
      const appointmentData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
       date: `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`,
        time: selectedTime,
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientEmail: clientData.email || '',
        notes: clientData.notes || '',
        status: 'agendado',
        createdAt: new Date().toISOString()
      };
      
      // Cria o agendamento no Firebase
      const newAppointment = await createAppointment(appointmentData);
      
      // Salva o agendamento no localStorage
      saveBooking(newAppointment);
      
      // Exibe mensagem de sucesso
      showAlert('Agendamento confirmado com sucesso!', 'success');
      
      // Marca como confirmado
      setConfirmed(true);
      
      // Reseta o formulário após 3 segundos
      setTimeout(() => {
        // Limpa as seleções
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
        
        // Volta para a página inicial
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      showAlert('Erro ao confirmar agendamento. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  if (confirmed) {
    return (
      <div className="py-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <FiCheck className="text-green-600 dark:text-green-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Agendamento confirmado!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Você receberá uma confirmação por telefone ou email.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Redirecionando...
        </div>
      </div>
    );
  }
  
  // Renderiza um indicador de carregamento enquanto verifica os dados
  if (!selectedService || !selectedDate || !selectedTime) {
    return (
      <div className="py-10 flex flex-col items-center justify-center text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Verificando dados do agendamento...
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Confirme seu agendamento
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Resumo do agendamento
          </h3>
        </div>
        
        {/* Detalhes do agendamento */}
        <div className="p-6 space-y-6">
          {/* Serviço */}
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FiScissors size={20} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Serviço
              </h4>
              <div className="mt-1 flex items-baseline">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedService.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({selectedService.duration || 30} min)
                </span>
              </div>
              <div className="mt-1 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {formatPrice(selectedService.price)}
              </div>
            </div>
          </div>
          
          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data */}
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FiCalendar size={20} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data
                </h4>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDateFull(selectedDate)}
                </div>
              </div>
            </div>
            
            {/* Hora */}
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FiClock size={20} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Horário
                </h4>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTime}
                </div>
              </div>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
          
          {/* Dados do cliente */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Seus dados
            </h4>
            
            <div className="space-y-3">
              {/* Nome */}
              <div className="flex items-center">
                <div className="w-6 text-gray-400 dark:text-gray-500">
                  <FiUser size={16} />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {clientData.name}
                  </div>
                </div>
              </div>
              
              {/* Telefone */}
              <div className="flex items-center">
                <div className="w-6 text-gray-400 dark:text-gray-500">
                  <FiPhone size={16} />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {clientData.phone}
                  </div>
                </div>
              </div>
              
              {/* Email (se houver) */}
              {clientData.email && (
                <div className="flex items-center">
                  <div className="w-6 text-gray-400 dark:text-gray-500">
                    <FiMail size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {clientData.email}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Observações (se houver) */}
              {clientData.notes && (
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 dark:text-gray-500 mt-1">
                    <FiMessageSquare size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {clientData.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Política de cancelamento */}
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Política de cancelamento:</strong> Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.
            Caso contrário, poderá ser cobrada uma taxa de 50% do valor do serviço.
          </p>
        </div>
      </div>
      
      {/* Botões de navegação */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          disabled={loading}
        >
          Voltar
        </button>
        
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`
            px-6 py-3 rounded-lg font-medium text-white bg-indigo-600 
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}
            transition-colors flex items-center
          `}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            <>
              Confirmar Agendamento
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;