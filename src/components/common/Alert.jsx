import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose }) => {
  // Configurações específicas para cada tipo de alerta
  const alertStyles = {
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-300',
      icon: <FiCheckCircle size={18} className="text-green-500 dark:text-green-400" />
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-300',
      icon: <FiXCircle size={18} className="text-red-500 dark:text-red-400" />
    },
    warning: {
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-800 dark:text-amber-300',
      icon: <FiAlertCircle size={18} className="text-amber-500 dark:text-amber-400" />
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-300',
      icon: <FiInfo size={18} className="text-blue-500 dark:text-blue-400" />
    }
  };
  
  const { bgColor, borderColor, textColor, icon } = alertStyles[type] || alertStyles.info;
  
  return (
    <div className={`flex items-start p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor} animate-fade-in mb-4`}>
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-4 flex-shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Fechar"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;