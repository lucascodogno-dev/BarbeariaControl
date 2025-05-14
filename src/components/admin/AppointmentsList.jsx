import React, { useState, useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import useServiceStore from '../../store/serviceStore';
import useUiStore from '../../store/uiStore';
import socket from '../../services/socket';
import { formatDateToBR, isPastDate, isPastTime } from '../../utils/date';
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiCheck,
  FiX,
  FiRotateCcw,
  FiTrash2,
  FiRefreshCw,
  FiChevronDown,
  FiList,
  FiGrid,
  FiAlertCircle,
  FiMessageSquare,
  FiAlertTriangle,
  FiScissors
} from 'react-icons/fi';

const AppointmentsList = () => {
  const { appointments, fetchAppointments, updateAppointmentStatus, deleteAppointment, loading } = useAppointmentStore();
  const { services, fetchServices } = useServiceStore();
  const { showAlert, openModal, closeModal, modals } = useUiStore();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  
  // Estado para ordenação
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Estado para visualização
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  
  // Estado para agendamento a ser excluído
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
  // Estado para agendamento selecionado (detalhes)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Busca os dados quando o componente monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchAppointments(),
          fetchServices()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showAlert('Erro ao carregar dados. Tente novamente.', 'error');
      }
    };
    
    fetchData();
    
    // Configura listeners de socket para atualizações em tempo real
    socket.on('appointment-created', fetchAppointments);
    socket.on('appointment-updated', fetchAppointments);
    socket.on('appointment-deleted', fetchAppointments);
    socket.on('appointment-status-updated', fetchAppointments);
    
    return () => {
      socket.off('appointment-created', fetchAppointments);
      socket.off('appointment-updated', fetchAppointments);
      socket.off('appointment-deleted', fetchAppointments);
      socket.off('appointment-status-updated', fetchAppointments);
    };
  }, [fetchAppointments, fetchServices, showAlert]);
  
  // Reseta os filtros para o estado inicial
  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setServiceFilter('');
  };
  
  // Atualiza o status de um agendamento
  const handleStatusChange = async (id, currentStatus) => {
    try {
      let newStatus;
      
      // Ciclo de status: agendado -> concluido -> cancelado -> agendado
      if (currentStatus === 'agendado') {
        newStatus = 'concluido';
      } else if (currentStatus === 'concluido') {
        newStatus = 'cancelado';
      } else {
        newStatus = 'agendado';
      }
      
      await updateAppointmentStatus(id, newStatus);
      showAlert(`Status atualizado para ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showAlert('Erro ao atualizar status. Tente novamente.', 'error');
    }
  };
  
  // Abre o modal de confirmação de exclusão
  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    openModal('deleteConfirmation');
  };
  
  // Confirma a exclusão de um agendamento
  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;
    
    try {
      await deleteAppointment(appointmentToDelete.id);
      showAlert('Agendamento excluído com sucesso!', 'success');
      setAppointmentToDelete(null);
      closeModal('deleteConfirmation');
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      showAlert('Erro ao excluir agendamento. Tente novamente.', 'error');
    }
  };
  
  // Abre o modal de detalhes do agendamento
  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    openModal('appointmentDetails');
  };
  
  // Alterna o modo de ordenação
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Se já estiver ordenando por este campo, inverte a direção
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Senão, ordena por este campo em ordem ascendente
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Filtra e ordena os agendamentos
  const filteredAndSortedAppointments = appointments
    // Filtragem
    .filter(appointment => {
      // Filtra por termo de busca (nome do cliente)
      if (searchTerm && !appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtra por data de início
      if (startDate && appointment.date < startDate) {
        return false;
      }
      
      // Filtra por data de fim
      if (endDate && appointment.date > endDate) {
        return false;
      }
      
      // Filtra por status
      if (statusFilter && appointment.status !== statusFilter) {
        return false;
      }
      
      // Filtra por serviço
      if (serviceFilter && appointment.serviceId !== serviceFilter) {
        return false;
      }
      
      return true;
    })
    // Ordenação
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'date':
          return a.date === b.date
            ? a.time.localeCompare(b.time) * direction
            : a.date.localeCompare(b.date) * direction;
        
        case 'client':
          return (a.clientName || '').localeCompare(b.clientName || '') * direction;
        
        case 'service':
          return (a.serviceName || '').localeCompare(b.serviceName || '') * direction;
        
        case 'price':
          return ((a.servicePrice || 0) - (b.servicePrice || 0)) * direction;
        
        case 'status':
          return (a.status || '').localeCompare(b.status || '') * direction;
        
        default:
          return 0;
      }
    });
  
  // Obtém o nome do serviço a partir do ID
  const getServiceNameById = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Desconhecido';
  };
  
  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Obtém a classe CSS para o status
  const getStatusClass = (status) => {
    switch (status) {
      case 'agendado':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'concluido':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'cancelado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };
  
  // Verifica se um agendamento é passado (data e horário já passaram)
  const isAppointmentPast = (appointment) => {
    return isPastDate(appointment.date) || 
      (appointment.date === new Date().toISOString().split('T')[0] && isPastTime(appointment.time, appointment.date));
  };
  
  // Renderiza o botão de ordenação para o cabeçalho da tabela
  const renderSortButton = (field, label) => (
    <button
      onClick={() => handleSortChange(field)}
      className="flex items-center space-x-1 group"
    >
      <span>{label}</span>
      <FiChevronDown 
        className={`
          ${sortBy === field ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100'} 
          transition-transform
          ${sortBy === field && sortDirection === 'desc' ? 'transform rotate-180' : ''}
        `} 
        size={14} 
      />
    </button>
  );
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Agendamentos
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }
            `}
            title="Visualização em lista"
          >
            <FiList size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }
            `}
            title="Visualização em grid"
          >
            <FiGrid size={18} />
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <FiFilter className="mr-2" size={18} />
            Filtros
          </h3>
          
          <button
            onClick={resetFilters}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
            title="Limpar filtros"
          >
            <FiRotateCcw className="mr-1" size={14} />
            Limpar filtros
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Busca por nome */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente"
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Filtro por data de início */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" size={16} />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Filtro por data de fim */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" size={16} />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Filtro por status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="agendado">Agendado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          {/* Filtro por serviço */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os serviços</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de agendamentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : filteredAndSortedAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FiCalendar size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm || startDate || endDate || statusFilter || serviceFilter
                ? 'Nenhum agendamento corresponde aos filtros selecionados. Tente ajustar os filtros para encontrar o que procura.'
                : 'Não há agendamentos registrados no sistema.'}
            </p>
            {(searchTerm || startDate || endDate || statusFilter || serviceFilter) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg inline-flex items-center hover:bg-indigo-700 transition-colors"
              >
                <FiRotateCcw className="mr-2" size={16} />
                Limpar filtros
              </button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          // Visualização em lista (tabela)
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {renderSortButton('date', 'Data e Hora')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {renderSortButton('client', 'Cliente')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {renderSortButton('service', 'Serviço')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {renderSortButton('price', 'Valor')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {renderSortButton('status', 'Status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedAppointments.map(appointment => {
                  const isPast = isAppointmentPast(appointment);
                  
                  return (
                    <tr 
                      key={appointment.id}
                      className={`
                        hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors
                        ${isPast ? 'opacity-60' : ''}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDateToBR(appointment.date)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            {appointment.clientName ? appointment.clientName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.clientName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {appointment.clientPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {appointment.serviceName || getServiceNameById(appointment.serviceId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(appointment.servicePrice || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                          {appointment.status === 'agendado' ? 'Agendado' : 
                           appointment.status === 'concluido' ? 'Concluído' : 
                           appointment.status === 'cancelado' ? 'Cancelado' : 
                           appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDetailsClick(appointment)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                          title="Ver detalhes"
                        >
                          <FiList size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, appointment.status)}
                          className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mr-3"
                          title="Alterar status"
                          disabled={isPast && appointment.status !== 'agendado'}
                        >
                          <FiRefreshCw size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(appointment)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // Visualização em grid
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedAppointments.map(appointment => {
              const isPast = isAppointmentPast(appointment);
              
              return (
                <div 
                  key={appointment.id}
                  className={`
                    bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm
                    hover:shadow-md transition-shadow
                    ${isPast ? 'opacity-60' : ''}
                  `}
                >
                  <div className={`h-2 ${getStatusClass(appointment.status)}`}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          {appointment.clientName ? appointment.clientName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.clientName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {appointment.clientPhone}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FiCalendar size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                        {formatDateToBR(appointment.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FiClock size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FiScissors size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                        {appointment.serviceName || getServiceNameById(appointment.serviceId)}
                      </div>
                      <div className="font-medium text-indigo-600 dark:text-indigo-400">
                        {formatPrice(appointment.servicePrice || 0)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                        {appointment.status === 'agendado' ? 'Agendado' : 
                         appointment.status === 'concluido' ? 'Concluído' : 
                         appointment.status === 'cancelado' ? 'Cancelado' : 
                         appointment.status}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDetailsClick(appointment)}
                          className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          title="Ver detalhes"
                        >
                          <FiList size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, appointment.status)}
                          className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          title="Alterar status"
                          disabled={isPast && appointment.status !== 'agendado'}
                        >
                          <FiRefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(appointment)}
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Excluir"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal de detalhes do agendamento */}
      {modals.appointmentDetails.isOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Detalhes do Agendamento
              </h3>
              <button
                onClick={() => closeModal('appointmentDetails')}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedAppointment.status)}`}>
                  {selectedAppointment.status === 'agendado' ? 'Agendado' : 
                   selectedAppointment.status === 'concluido' ? 'Concluído' : 
                   selectedAppointment.status === 'cancelado' ? 'Cancelado' : 
                   selectedAppointment.status}
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Data e Hora */}
                <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiCalendar size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Data e Hora
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateToBR(selectedAppointment.date)} às {selectedAppointment.time}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cliente */}
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Informações do Cliente
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-6 text-gray-400 dark:text-gray-500">
                        <FiUser size={16} />
                      </div>
                      <div className="ml-2 text-sm text-gray-900 dark:text-white">
                        {selectedAppointment.clientName}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-6 text-gray-400 dark:text-gray-500">
                        <FiPhone size={16} />
                      </div>
                      <div className="ml-2 text-sm text-gray-900 dark:text-white">
                        {selectedAppointment.clientPhone}
                      </div>
                    </div>
                    
                    {selectedAppointment.clientEmail && (
                      <div className="flex items-center">
                        <div className="w-6 text-gray-400 dark:text-gray-500">
                          <FiMail size={16} />
                        </div>
                        <div className="ml-2 text-sm text-gray-900 dark:text-white">
                          {selectedAppointment.clientEmail}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Serviço */}
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Serviço
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-750 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-3 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FiScissors size={16} />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedAppointment.serviceName || getServiceNameById(selectedAppointment.serviceId)}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(selectedAppointment.servicePrice || 0)}
                    </div>
                  </div>
                </div>
                
                {/* Observações */}
                {selectedAppointment.notes && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Observações
                    </div>
                    
                    <div className="flex items-start bg-gray-50 dark:bg-gray-750 p-3 rounded-lg">
                      <div className="mr-3 flex-shrink-0 mt-0.5">
                        <FiMessageSquare size={16} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedAppointment.notes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => closeModal('appointmentDetails')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmação de exclusão */}
      {modals.deleteConfirmation.isOpen && appointmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                  <FiAlertTriangle size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Confirmar exclusão
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tem certeza que deseja excluir o agendamento de <span className="font-semibold text-gray-700 dark:text-gray-300">{appointmentToDelete.clientName}</span> para <span className="font-semibold text-gray-700 dark:text-gray-300">{formatDateToBR(appointmentToDelete.date)}</span> às <span className="font-semibold text-gray-700 dark:text-gray-300">{appointmentToDelete.time}</span>? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => closeModal('deleteConfirmation')}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;