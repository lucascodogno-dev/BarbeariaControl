import React from 'react';
import ServiceManager from '../../components/admin/ServiceManager';
import useAuthStore from '../../store/authStore';
import { Navigate } from 'react-router-dom';

const ServicesPage = () => {
  const { isAdmin, loading } = useAuthStore();

  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Se não for admin, redireciona para a página de login
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Gerenciar Serviços
      </h1>
      
      <ServiceManager />
    </div>
  );
};

export default ServicesPage;