import React, { useState, useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import useUiStore from '../../store/uiStore';
import { getUserInfo, saveUserInfo } from '../../utils/localStorage';
import { FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

const ClientForm = () => {
  const { selectedService, selectedDate, selectedTime } = useAppointmentStore();
  const { setBookingStep, showAlert } = useUiStore();

  // Estado para os dados do cliente
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Estados de validação
  const [errors, setErrors] = useState({});
  const [hasExistingData, setHasExistingData] = useState(false);

  // Carrega dados do cliente do localStorage, se existirem
  useEffect(() => {
    const savedUserInfo = getUserInfo();
    if (savedUserInfo) {
      setClientData({
        name: savedUserInfo.name || '',
        phone: savedUserInfo.phone || '',
        email: savedUserInfo.email || '',
        notes: ''
      });
      setHasExistingData(true);
    }
  }, []);

  // Manipulador para mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value
    });

    // Limpa o erro ao editar o campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validação dos campos
  const validateForm = () => {
    const newErrors = {};

    if (!clientData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!clientData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(clientData.phone)) {
      newErrors.phone = 'Formato inválido. Use (99) 99999-9999';
    }

    if (clientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Aplicar máscara ao telefone
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      
      setClientData({
        ...clientData,
        phone: value
      });
      
      if (errors.phone) {
        setErrors({
          ...errors,
          phone: null
        });
      }
    }
  };

  // Avança para o próximo passo
  const handleContinue = () => {
    if (!validateForm()) {
      showAlert('Por favor, corrija os erros no formulário.', 'error');
      return;
    }

    // Salva os dados do cliente no localStorage
    saveUserInfo({
      name: clientData.name,
      phone: clientData.phone,
      email: clientData.email
    });

    // Avança para o passo de confirmação
    setBookingStep(5);
    showAlert('Informações salvas com sucesso!', 'success');
  };

  // Volta para o passo anterior
  const handleBack = () => {
    setBookingStep(3);
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Seus dados
      </h2>

      {hasExistingData && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-800 dark:text-green-300 text-sm">
            Encontramos seus dados anteriores! Você pode editar se necessário.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={clientData.name}
                onChange={handleChange}
                className={`
                  pl-10 w-full rounded-md border py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  ${
                    errors.name
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                  dark:text-white
                `}
                placeholder="Digite seu nome completo"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telefone *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                type="text"
                id="phone"
                name="phone"
                value={clientData.phone}
                onChange={handlePhoneChange}
                className={`
                  pl-10 w-full rounded-md border py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  ${
                    errors.phone
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                  dark:text-white
                `}
                placeholder="(99) 99999-9999"
                maxLength={15}
              />
            </div>
            {errors.phone ? (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Será utilizado para confirmação e lembretes
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={clientData.email}
                onChange={handleChange}
                className={`
                  pl-10 w-full rounded-md border py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  ${
                    errors.email
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                  dark:text-white
                `}
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observações <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FiMessageSquare className="text-gray-400" />
              </div>
              <textarea
                id="notes"
                name="notes"
                value={clientData.notes}
                onChange={handleChange}
                rows={3}
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Alguma informação adicional para o barbeiro?"
              />
            </div>
          </div>
        </div>
      </div>

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
          className="px-6 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ClientForm;