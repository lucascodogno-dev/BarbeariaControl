// // src/store/serviceStore.js
// import { create } from 'zustand';
// import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
// import { db } from '../services/firebase';
// import socket from '../services/socket';

// const useServiceStore = create((set, get) => ({
//   services: [],
//   loading: false,
//   error: null,
  
//   // Carrega todos os serviços
//   fetchServices: async () => {
//     set({ loading: true, error: null });
//     try {
//       const servicesRef = collection(db, "services");
//       const querySnapshot = await getDocs(servicesRef);
      
//       const services = [];
//       querySnapshot.forEach((doc) => {
//         services.push({ id: doc.id, ...doc.data() });
//       });
      
//       set({ services, loading: false });
//     } catch (error) {
//       console.error("Erro ao buscar serviços:", error);
//       set({ error: error.message, loading: false });
//     }
//   },
  
//   // Cria um novo serviço
//   createService: async (serviceData) => {
//     set({ loading: true, error: null });
//     try {
//       const servicesRef = collection(db, "services");
//       const docRef = await addDoc(servicesRef, {
//         ...serviceData,
//         createdAt: new Date().toISOString()
//       });
      
//       const newService = { 
//         id: docRef.id, 
//         ...serviceData, 
//         createdAt: new Date().toISOString() 
//       };
      
//       // Emite evento de serviço criado via Socket.io
//       socket.emit("service-created", newService);
      
//       set(state => ({ 
//         services: [...state.services, newService],
//         loading: false 
//       }));
      
//       return newService;
//     } catch (error) {
//       console.error("Erro ao criar serviço:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },
  
//   // Atualiza um serviço existente
//   updateService: async (id, data) => {
//     set({ loading: true, error: null });
//     try {
//       const serviceRef = doc(db, "services", id);
//       await updateDoc(serviceRef, {
//         ...data,
//         updatedAt: new Date().toISOString()
//       });
      
//       const updatedService = { 
//         id, 
//         ...data, 
//         updatedAt: new Date().toISOString() 
//       };
      
//       // Emite evento de serviço atualizado via Socket.io
//       socket.emit("service-updated", updatedService);
      
//       set(state => ({
//         services: state.services.map(service => 
//           service.id === id ? { ...service, ...updatedService } : service
//         ),
//         loading: false
//       }));
      
//       return updatedService;
//     } catch (error) {
//       console.error("Erro ao atualizar serviço:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },
  
//   // Remove um serviço
//   deleteService: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       const serviceRef = doc(db, "services", id);
//       await deleteDoc(serviceRef);
      
//       // Emite evento de serviço deletado via Socket.io
//       socket.emit("service-deleted", id);
      
//       set(state => ({
//         services: state.services.filter(service => service.id !== id),
//         loading: false
//       }));
//     } catch (error) {
//       console.error("Erro ao deletar serviço:", error);
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },
  
//   // Responde aos eventos Socket.io
//   setupSocketListeners: () => {
//     socket.on("service-created", (service) => {
//       set(state => ({
//         services: [...state.services, service]
//       }));
//     });
    
//     socket.on("service-updated", (updatedService) => {
//       set(state => ({
//         services: state.services.map(service => 
//           service.id === updatedService.id 
//             ? { ...service, ...updatedService } 
//             : service
//         )
//       }));
//     });
    
//     socket.on("service-deleted", (id) => {
//       set(state => ({
//         services: state.services.filter(service => service.id !== id)
//       }));
//     });
//   },
  
//   // Remove os listeners do Socket.io
//   cleanupSocketListeners: () => {
//     socket.off("service-created");
//     socket.off("service-updated");
//     socket.off("service-deleted");
//   }
// }));

// export default useServiceStore;
// src/store/serviceStore.js
import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore';
import { db } from '../services/firebase';
import socket from '../services/socket';

const useServiceStore = create((set, get) => ({
  services: [],
  loading: false,
  error: null,

  // 🔄 Carrega todos os serviços
  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const servicesRef = collection(db, 'services');
      const querySnapshot = await getDocs(servicesRef);

      const services = [];
      querySnapshot.forEach(doc => {
        services.push({ id: doc.id, ...doc.data() });
      });

      set({ services, loading: false });
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      set({ error: error.message, loading: false });
    }
  },

  // ➕ Cria um novo serviço
  createService: async serviceData => {
    set({ loading: true, error: null });
    try {
      const timestamp = new Date().toISOString();
      const servicesRef = collection(db, 'services');

      const docRef = await addDoc(servicesRef, {
        ...serviceData,
        createdAt: timestamp
      });

      const newService = {
        id: docRef.id,
        ...serviceData,
        createdAt: timestamp
      };

      // 🔊 Emite via socket
      socket.emit('service-created', newService);

      set(state => ({
        services: [...state.services, newService],
        loading: false
      }));

      return newService;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // ✏️ Atualiza um serviço existente
  updateService: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedAt = new Date().toISOString();
      const serviceRef = doc(db, 'services', id);

      await updateDoc(serviceRef, {
        ...data,
        updatedAt
      });

      const updatedService = {
        id,
        ...data,
        updatedAt
      };

      // 🔊 Emite via socket
      socket.emit('service-updated', updatedService);

      set(state => ({
        services: state.services.map(service =>
          service.id === id ? updatedService : service
        ),
        loading: false
      }));

      return updatedService;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // ❌ Remove um serviço
  deleteService: async id => {
    set({ loading: true, error: null });
    try {
      const serviceRef = doc(db, 'services', id);
      await deleteDoc(serviceRef);

      socket.emit('service-deleted', id);

      set(state => ({
        services: state.services.filter(service => service.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // 🔁 Sincroniza via WebSocket
  setupSocketListeners: () => {
    socket.on('service-created', service => {
      set(state => ({
        services: state.services.some(s => s.id === service.id)
          ? state.services
          : [...state.services, service]
      }));
    });

    socket.on('service-updated', updatedService => {
      set(state => ({
        services: state.services.map(service =>
          service.id === updatedService.id
            ? { ...service, ...updatedService }
            : service
        )
      }));
    });

    socket.on('service-deleted', id => {
      set(state => ({
        services: state.services.filter(service => service.id !== id)
      }));
    });
  },

  // 🧹 Remove listeners
  cleanupSocketListeners: () => {
    socket.off('service-created');
    socket.off('service-updated');
    socket.off('service-deleted');
  }
}));

export default useServiceStore;
