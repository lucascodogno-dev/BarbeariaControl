import React, { useState, useEffect, useRef } from 'react';
import useServiceStore from '../../store/serviceStore';
import useUiStore from '../../store/uiStore';
import socket from '../../services/socket';
import { FiScissors, FiEdit2, FiTrash2, FiPlus, FiDollarSign, FiClock, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';

const ServiceManager = () => {
  const { services, fetchServices, createService, updateService, deleteService, loading } = useServiceStore();
  const { showAlert, modals, openModal, closeModal } = useUiStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
    isActive: true
  });
  
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  
  // Busca os serviços quando o componente monta
  useEffect(() => {
    fetchServices();
    
    // Configura listeners de socket para atualizações em tempo real
    socket.on('service-created', fetchServices);
    socket.on('service-updated', fetchServices);
    socket.on('service-deleted', fetchServices);
    
    return () => {
      socket.off('service-created', fetchServices);
      socket.off('service-updated', fetchServices);
      socket.off('service-deleted', fetchServices);
    };
  }, [fetchServices]);
  
  // Limpa o formulário
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '30',
      isActive: true
    });
    setErrors({});
    setEditMode(false);
    setCurrentId(null);
  };
  
  // Manipula mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'price' && !/^\d*\.?\d{0,2}$/.test(value) && value !== '') {
      return; // Impede valores inválidos no campo de preço
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpa o erro quando o campo é modificado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Abre o formulário para adicionar um novo serviço
  const handleAddNew = () => {
    resetForm();
    openModal('serviceForm');
  };
  
  // Abre o formulário para editar um serviço existente
  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      price: String(service.price),
      duration: String(service.duration || 30),
      isActive: service.isActive !== false
    });
    setEditMode(true);
    setCurrentId(service.id);
    openModal('serviceForm');
  };
  
  // Confirma a exclusão de um serviço
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await deleteService(serviceToDelete.id);
      showAlert(`Serviço "${serviceToDelete.name}" excluído com sucesso!`, 'success');
      setServiceToDelete(null);
      closeModal('deleteConfirmation');
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      showAlert('Erro ao excluir serviço. Tente novamente.', 'error');
    }
  };
  
  // Abre o modal de confirmação de exclusão
  const handleDelete = (service) => {
    setServiceToDelete(service);
    openModal('deleteConfirmation');
  };
  
  // Valida o formulário antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.price) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um valor positivo';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Duração é obrigatória';
    } else if (isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duração deve ser um valor positivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Envia o formulário para criar ou atualizar um serviço
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        isActive: formData.isActive
      };
      
      if (editMode && currentId) {
        // Atualiza um serviço existente
        await updateService(currentId, serviceData);
        showAlert(`Serviço "${serviceData.name}" atualizado com sucesso!`, 'success');
      } else {
        // Cria um novo serviço
        await createService(serviceData);
        showAlert(`Serviço "${serviceData.name}" adicionado com sucesso!`, 'success');
      }
      
      // Limpa o formulário e fecha o modal
      resetForm();
      closeModal('serviceForm');
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      showAlert('Erro ao salvar serviço. Tente novamente.', 'error');
    }
  };
  
  // Formata o preço para exibição
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão de adicionar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerenciar Serviços
        </h2>
        
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Novo Serviço
        </button>
      </div>
      
      {/* Lista de serviços */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FiScissors size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Você ainda não possui serviços cadastrados. Adicione seu primeiro serviço para começar.
            </p>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg inline-flex items-center hover:bg-indigo-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Adicionar Serviço
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {services.map(service => (
                  <tr 
                    key={service.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <FiScissors size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">
                        {service.description || 'Sem descrição'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPrice(service.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {service.duration || 30} minutos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.isActive !== false
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {service.isActive !== false ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                        title="Editar"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="Excluir"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal de formulário de serviço */}
      {modals.serviceForm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editMode ? 'Editar Serviço' : 'Adicionar Serviço'}
              </h3>
              <button
                onClick={() => closeModal('serviceForm')}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} ref={formRef} className="p-6">
              <div className="space-y-4">
                {/* Nome do serviço */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nome do serviço *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
                    placeholder="Ex: Corte de cabelo masculino"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                {/* Descrição */}
                <div>
                  <label 
                    htmlFor="description" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Descrição <span className="text-gray-400 dark:text-gray-500">(opcional)</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Descreva o serviço..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preço */}
                  <div>
                    <label 
                      htmlFor="price" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Preço (R$) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`pl-10 w-full rounded-md border ${
                          errors.price 
                            ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        } py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                    )}
                  </div>
                  
                  {/* Duração */}
                  <div>
                    <label 
                      htmlFor="duration" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Duração (minutos) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="1"
                        step="5"
                        className={`pl-10 w-full rounded-md border ${
                          errors.duration 
                            ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        } py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
                        placeholder="30"
                      />
                    </div>
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
                    )}
                  </div>
                </div>
                
                {/* Status (ativo/inativo) */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label 
                    htmlFor="isActive" 
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Serviço ativo
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => closeModal('serviceForm')}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center"
                >
                  {editMode ? (
                    <>
                      <FiCheck className="mr-2" />
                      Atualizar
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      Adicionar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmação de exclusão */}
      {modals.deleteConfirmation.isOpen && serviceToDelete && (
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
                    Tem certeza que deseja excluir o serviço <span className="font-semibold text-gray-700 dark:text-gray-300">"{serviceToDelete.name}"</span>? Esta ação não pode ser desfeita.
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

export default ServiceManager;