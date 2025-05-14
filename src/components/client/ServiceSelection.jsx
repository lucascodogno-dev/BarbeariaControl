import React, { useState, useEffect } from 'react';
import useServiceStore from '../../store/serviceStore';
import useAppointmentStore from '../../store/appointmentStore';
import useUiStore from '../../store/uiStore';
import { FiScissors, FiTrendingUp, FiClock } from 'react-icons/fi';

const ServiceSelection = () => {
  const { services, fetchServices, loading } = useServiceStore();
  const { setSelectedService, selectedService } = useAppointmentStore();
  const { setBookingStep, showAlert } = useUiStore();
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleServiceSelect = (service) => {
    setSelectedServiceId(service.id);
    setSelectedService(service);
    showAlert(`Serviço "${service.name}" selecionado!`, 'success');
  };

  const handleContinue = () => {
    if (!selectedService) {
      showAlert('Por favor, selecione um serviço para continuar.', 'error');
      return;
    }
    setBookingStep(2);
  };

  // Se estiver carregando, exibe um esqueleto de carregamento
  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div 
              key={index} 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Escolha seu serviço
      </h2>
      
      {services.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            Nenhum serviço disponível no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`
                relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm border
                transition-all duration-300 cursor-pointer
                ${selectedServiceId === service.id 
                  ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500 ring-opacity-50 transform scale-[1.02]' 
                  : 'border-gray-100 dark:border-gray-700 hover:shadow-md'}
              `}
              onClick={() => handleServiceSelect(service)}
            >
              {/* Marca de Seleção */}
              {selectedServiceId === service.id && (
                <div className="absolute top-3 right-3 h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FiScissors size={20} />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FiClock className="mr-1" />
                    <span>{service.duration || 30} min</span>
                  </div>
                  <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                    R$ {service.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedService}
          className={`
            px-6 py-2 rounded-lg font-medium text-white
            ${
              selectedService
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }
            transition-colors duration-300
          `}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;