// src/store/uiStore.js
import { create } from 'zustand';
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from '../utils/theme';

const useUiStore = create((set, get) => ({
  // Tema
  isDarkMode: getCurrentTheme() === 'dark',
  toggleTheme: () => {
    const newTheme = toggleThemeUtil();
    set({ isDarkMode: newTheme === 'dark' });
  },
  
  // Alertas e notificações
  alerts: [],
  showAlert: (message, type = 'info', timeout = 3000) => {
    const id = Date.now();
    const newAlert = { id, message, type };
    
    set(state => ({
      alerts: [...state.alerts, newAlert]
    }));
    
    // Configura um timeout para remover o alerta automaticamente
    if (timeout > 0) {
      setTimeout(() => {
        set(state => ({
          alerts: state.alerts.filter(alert => alert.id !== id)
        }));
      }, timeout);
    }
    
    return id;
  },
  
  removeAlert: (id) => {
    set(state => ({
      alerts: state.alerts.filter(alert => alert.id !== id)
    }));
  },
  
  clearAlerts: () => {
    set({ alerts: [] });
  },
  
  // Controle de modais
  modals: {
    deleteConfirmation: { isOpen: false, data: null },
    serviceForm: { isOpen: false, data: null },
    appointmentDetails: { isOpen: false, data: null },
  },
  
  openModal: (modalName, data = null) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modalName]: { isOpen: true, data }
      }
    }));
  },
  
  closeModal: (modalName) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modalName]: { isOpen: false, data: null }
      }
    }));
  },
  
  // Estado do booking
  bookingStep: 1,
  setBookingStep: (step) => set({ bookingStep: step }),
  
  // Estado da barra lateral (mobile)
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // Filtros para a página de agendamentos (admin)
  appointmentsFilters: {
    startDate: null,
    endDate: null,
    status: null,
    serviceId: null,
    searchTerm: ''
  },
  
  setAppointmentsFilter: (filterName, value) => {
    set(state => ({
      appointmentsFilters: {
        ...state.appointmentsFilters,
        [filterName]: value
      }
    }));
  },
  
  resetAppointmentsFilters: () => {
    set({
      appointmentsFilters: {
        startDate: null,
        endDate: null,
        status: null,
        serviceId: null,
        searchTerm: ''
      }
    });
  }
}));

export default useUiStore;