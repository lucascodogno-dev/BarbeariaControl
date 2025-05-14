import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingHistory from '../../components/client/BookingHistory';
import { getUserInfo, clearAllBookingData } from '../../utils/localStorage';
import useUiStore from '../../store/uiStore';
import { FiUser, FiCalendar, FiClock, FiMail, FiPhone, FiEdit2, FiLogOut, FiTrash2 } from 'react-icons/fi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { showAlert } = useUiStore();
  
  // Obtém os dados do cliente do localStorage
  const userInfo = getUserInfo();
  
  // Se não houver dados do cliente, redireciona para a página de agendamento
  useEffect(() => {
    if (!userInfo) {
      navigate('/booking');
    }
  }, [userInfo, navigate]);
  
  // Limpa todos os dados do localStorage e redireciona para a página inicial
  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os seus dados? Esta ação não pode ser desfeita.')) {
      clearAllBookingData();
      showAlert('Seus dados foram removidos com sucesso.', 'success');
      navigate('/');
    }
  };
  
  if (!userInfo) {
    return null; // Será redirecionado pelo useEffect
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Seu perfil
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Informações do cliente */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userInfo.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cliente desde {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Informações de contato
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <FiPhone className="text-gray-400 dark:text-gray-500" size={16} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {userInfo.phone}
                  </span>
                </div>
                
                {userInfo.email && (
                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0">
                      <FiMail className="text-gray-400 dark:text-gray-500" size={16} />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {userInfo.email}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col space-y-3">
                <Link
                  to="/booking"
                  className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiCalendar className="mr-2" size={16} />
                  Agendar novo horário
                </Link>
                
                <Link
                  to="/booking"
                  state={{ editProfile: true }}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiEdit2 className="mr-2" size={16} />
                  Editar informações
                </Link>
                
                <button
                  onClick={handleClearData}
                  className="flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <FiTrash2 className="mr-2" size={16} />
                  Limpar meus dados
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Histórico de agendamentos */}
        <div className="md:col-span-2">
          <BookingHistory />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;