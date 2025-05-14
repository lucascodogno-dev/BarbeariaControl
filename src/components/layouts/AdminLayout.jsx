// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   FiGrid, 
//   FiCalendar, 
//   FiScissors, 
//   FiSettings, 
//   FiLogOut, 
//   FiMenu, 
//   FiX,
//   FiBell,
//   FiUser
// } from 'react-icons/fi';
// import ThemeToggle from '../common/ThemeToggle';
// import useAuthStore from '../../store/authStore';
// import useUiStore from '../../store/uiStore';
// import socket from '../../services/socket';

// const AdminLayout = ({ children }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { signOut, userProfile } = useAuthStore();
//   const { showAlert, toggleSidebar, isSidebarOpen } = useUiStore();
  
//   const [notifications, setNotifications] = useState([]);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [notificationOpen, setNotificationOpen] = useState(false);
  
//   // Configura os listeners de socket para notificações
//   useEffect(() => {
//     // Evento de novo agendamento
//     socket.on('appointment-created', (appointment) => {
//       const notification = {
//         id: Date.now(),
//         type: 'appointment-created',
//         title: 'Novo agendamento',
//         message: `${appointment.clientName} agendou um ${appointment.serviceName} para ${new Date(appointment.date).toLocaleDateString('pt-BR')} às ${appointment.time}.`,
//         time: new Date().toISOString(),
//         read: false
//       };
      
//       setNotifications(prev => [notification, ...prev]);
//       setNotificationCount(prev => prev + 1);
      
//       // Exibe alerta
//       showAlert(`Novo agendamento de ${appointment.clientName}`, 'info');
//     });
    
//     // Evento de atualização de agendamento
//     socket.on('appointment-updated', (appointment) => {
//       const notification = {
//         id: Date.now(),
//         type: 'appointment-updated',
//         title: 'Agendamento atualizado',
//         message: `O agendamento de ${appointment.clientName} foi atualizado.`,
//         time: new Date().toISOString(),
//         read: false
//       };
      
//       setNotifications(prev => [notification, ...prev]);
//       setNotificationCount(prev => prev + 1);
//     });
    
//     return () => {
//       socket.off('appointment-created');
//       socket.off('appointment-updated');
//     };
//   }, [showAlert]);
  
//   // Verifica se o link está ativo
//   const isActive = (path) => {
//     return location.pathname === path;
//   };
  
//   // Manipula logout
//   const handleLogout = async () => {
//     try {
//       await signOut();
//       navigate('/admin/login');
//       showAlert('Logout realizado com sucesso!', 'success');
//     } catch (error) {
//       console.error('Erro ao fazer logout:', error);
//       showAlert('Erro ao fazer logout. Tente novamente.', 'error');
//     }
//   };
  
//   // Marca todas as notificações como lidas
//   const markAllAsRead = () => {
//     setNotifications(prev => 
//       prev.map(notification => ({ ...notification, read: true }))
//     );
//     setNotificationCount(0);
//   };
  
//   // Fecha o menu de notificações quando clica fora
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const notificationElement = document.getElementById('notification-dropdown');
//       if (notificationElement && !notificationElement.contains(event.target) && !event.target.closest('#notification-button')) {
//         setNotificationOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
  
//   return (
//     <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
//       {/* Sidebar para desktop */}
//       <div className="hidden md:flex md:flex-shrink-0">
//         <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//           {/* Sidebar header */}
//           <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
//             <Link to="/admin/dashboard" className="flex items-center">
//               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
//                 ✂️
//               </div>
//               <span className="font-bold text-gray-900 dark:text-white">
//                 Admin Panel
//               </span>
//             </Link>
//           </div>
          
//           {/* Sidebar content */}
//           <div className="flex-1 flex flex-col py-4 overflow-y-auto">
//             <nav className="flex-1 px-2 space-y-1">
//               <Link
//                 to="/admin/dashboard"
//                 className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   isActive('/admin/dashboard')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 <FiGrid className="mr-3 h-5 w-5" />
//                 Dashboard
//               </Link>
              
//               <Link
//                 to="/admin/appointments"
//                 className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   isActive('/admin/appointments')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 <FiCalendar className="mr-3 h-5 w-5" />
//                 Agendamentos
//               </Link>
              
//               <Link
//                 to="/admin/services"
//                 className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   isActive('/admin/services')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 <FiScissors className="mr-3 h-5 w-5" />
//                 Serviços
//               </Link>
              
//               <Link
//                 to="/admin/settings"
//                 className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   isActive('/admin/settings')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 <FiSettings className="mr-3 h-5 w-5" />
//                 Configurações
//               </Link>
//             </nav>
//           </div>
          
//           {/* User info */}
//           <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
//                   {userProfile?.name?.charAt(0)?.toUpperCase() || 'A'}
//                 </div>
//               </div>
//               <div className="ml-3 min-w-0 flex-1">
//                 <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                   {userProfile?.name || 'Admin'}
//                 </div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                   {userProfile?.email || 'admin@example.com'}
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="ml-auto flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
//                 title="Sair"
//               >
//                 <FiLogOut size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Mobile sidebar */}
//       <div
//         className={`md:hidden fixed inset-0 z-40 flex ${
//           isSidebarOpen ? 'visible' : 'invisible'
//         }`}
//       >
//         {/* Backdrop */}
//         <div
//           className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
//             isSidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'
//           }`}
//           onClick={toggleSidebar}
//         ></div>
        
//         {/* Sidebar */}
//         <div
//           className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transform transition ease-in-out duration-300 ${
//             isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}
//         >
//           <div className="absolute top-0 right-0 -mr-12 pt-2">
//             <button
//               className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//               onClick={toggleSidebar}
//             >
//               <span className="sr-only">Fechar sidebar</span>
//               <FiX className="h-6 w-6 text-white" />
//             </button>
//           </div>
          
//           <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
//             <div className="flex items-center">
//               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
//                 ✂️
//               </div>
//               <span className="font-bold text-gray-900 dark:text-white">
//                 Admin Panel
//               </span>
//             </div>
//           </div>
          
//           <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
//             <nav className="mt-5 px-2 space-y-1">
//               <Link
//                 to="/admin/dashboard"
//                 className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
//                   isActive('/admin/dashboard')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//                 onClick={toggleSidebar}
//               >
//                 <FiGrid className="mr-3 h-5 w-5" />
//                 Dashboard
//               </Link>
              
//               <Link
//                 to="/admin/appointments"
//                 className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
//                   isActive('/admin/appointments')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//                 onClick={toggleSidebar}
//               >
//                 <FiCalendar className="mr-3 h-5 w-5" />
//                 Agendamentos
//               </Link>
              
//               <Link
//                 to="/admin/services"
//                 className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
//                   isActive('/admin/services')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//                 onClick={toggleSidebar}
//               >
//                 <FiScissors className="mr-3 h-5 w-5" />
//                 Serviços
//               </Link>
              
//               <Link
//                 to="/admin/settings"
//                 className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
//                   isActive('/admin/settings')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//                 onClick={toggleSidebar}
//               >
//                 <FiSettings className="mr-3 h-5 w-5" />
//                 Configurações
//               </Link>
              
//               <button
//                 onClick={handleLogout}
//                 className="flex w-full items-center px-3 py-2 text-base font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
//               >
//                 <FiLogOut className="mr-3 h-5 w-5" />
//                 Sair
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>
      
//       {/* Main content */}
//       <div className="flex flex-col w-0 flex-1 overflow-hidden">
//         {/* Top navbar */}
//         <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
//           <button
//             className="md:hidden px-4 text-gray-500 dark:text-gray-400 focus:outline-none"
//             onClick={toggleSidebar}
//           >
//             <span className="sr-only">Abrir sidebar</span>
//             <FiMenu className="h-6 w-6" />
//           </button>
          
//           <div className="flex-1 px-4 flex justify-between">
//             <div className="flex-1 flex items-center">
//               <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
//                 {location.pathname === '/admin/dashboard' && 'Dashboard'}
//                 {location.pathname === '/admin/appointments' && 'Agendamentos'}
//                 {location.pathname === '/admin/services' && 'Serviços'}
//                 {location.pathname === '/admin/settings' && 'Configurações'}
//               </h1>
//             </div>
//             <div className="ml-4 flex items-center md:ml-6">
//               {/* Notification dropdown */}
//               <div className="relative">
//                 <button
//                   id="notification-button"
//                   className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
//                   onClick={() => setNotificationOpen(!notificationOpen)}
//                 >
//                   <span className="sr-only">Ver notificações</span>
//                   <FiBell className="h-6 w-6" />
//                   {notificationCount > 0 && (
//                     <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1 -translate-y-1">
//                       {notificationCount}
//                     </span>
//                   )}
//                 </button>
                
//                 {notificationOpen && (
//                   <div
//                     id="notification-dropdown"
//                     className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
//                   >
//                     <div className="py-1">
//                       <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                         <h3 className="text-sm font-medium text-gray-900 dark:text-white">
//                           Notificações
//                         </h3>
//                         {notificationCount > 0 && (
//                           <button
//                             className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
//                             onClick={markAllAsRead}
//                           >
//                             Marcar todas como lidas
//                           </button>
//                         )}
//                       </div>
                      
//                       {notifications.length === 0 ? (
//                         <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
//                           <p className="text-sm">
//                             Nenhuma notificação.
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="max-h-60 overflow-y-auto">
//                           {notifications.map((notification) => (
//                             <div
//                               key={notification.id}
//                               className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 ${
//                                 !notification.read
//                                   ? 'bg-indigo-50 dark:bg-indigo-900/10'
//                                   : ''
//                               }`}
//                             >
//                               <div className="flex">
//                                 <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
//                                   notification.type === 'appointment-created'
//                                     ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
//                                     : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//                                 }`}>
//                                   {notification.type === 'appointment-created' ? (
//                                     <FiCalendar size={14} />
//                                   ) : (
//                                     <FiUser size={14} />
//                                   )}
//                                 </div>
//                                 <div className="ml-3 flex-1">
//                                   <p className="text-sm font-medium text-gray-900 dark:text-white">
//                                     {notification.title}
//                                   </p>
//                                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                     {notification.message}
//                                   </p>
//                                   <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
//                                     {new Date(notification.time).toLocaleTimeString('pt-BR', {
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Theme toggle */}
//               <div className="ml-3">
//                 <ThemeToggle />
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto focus:outline-none">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiCalendar, 
  FiScissors, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiBell,
  FiUser
} from 'react-icons/fi';
import ThemeToggle from '../common/ThemeToggle';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';
import socket from '../../services/socket';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, userProfile } = useAuthStore();
  const { showAlert, toggleSidebar, isSidebarOpen } = useUiStore();
  
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Configura os listeners de socket para notificações
  useEffect(() => {
    // Evento de novo agendamento
    socket.on('appointment-created', (appointment) => {
      const notification = {
        id: Date.now(),
        type: 'appointment-created',
        title: 'Novo agendamento',
        message: `${appointment.clientName} agendou um ${appointment.serviceName} para ${new Date(appointment.date).toLocaleDateString('pt-BR')} às ${appointment.time}.`,
        time: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      setNotificationCount(prev => prev + 1);
      
      // Exibe alerta
      showAlert(`Novo agendamento de ${appointment.clientName}`, 'info');
    });
    
    // Evento de atualização de agendamento
    socket.on('appointment-updated', (appointment) => {
      const notification = {
        id: Date.now(),
        type: 'appointment-updated',
        title: 'Agendamento atualizado',
        message: `O agendamento de ${appointment.clientName} foi atualizado.`,
        time: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      setNotificationCount(prev => prev + 1);
    });
    
    // Evento de atualização de configurações
    socket.on('settings-updated', (data) => {
      if (data.type === 'homepage') {
        const notification = {
          id: Date.now(),
          type: 'settings-updated',
          title: 'Configurações atualizadas',
          message: 'As configurações da página inicial foram atualizadas.',
          time: new Date().toISOString(),
          read: false
        };
        
        setNotifications(prev => [notification, ...prev]);
        setNotificationCount(prev => prev + 1);
      }
    });
    
    return () => {
      socket.off('appointment-created');
      socket.off('appointment-updated');
      socket.off('settings-updated');
    };
  }, [showAlert]);
  
  // Verifica se o link está ativo
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Manipula logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
      showAlert('Logout realizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showAlert('Erro ao fazer logout. Tente novamente.', 'error');
    }
  };
  
  // Marca todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setNotificationCount(0);
  };
  
  // Fecha o menu de notificações quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationElement = document.getElementById('notification-dropdown');
      if (notificationElement && !notificationElement.contains(event.target) && !event.target.closest('#notification-button')) {
        setNotificationOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Sidebar header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/admin/dashboard" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
                ✂️
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </Link>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/dashboard')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiGrid className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              
              <Link
                to="/admin/appointments"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/appointments')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiCalendar className="mr-3 h-5 w-5" />
                Agendamentos
              </Link>
              
              <Link
                to="/admin/services"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/services')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiScissors className="mr-3 h-5 w-5" />
                Serviços
              </Link>
              
              <Link
                to="/admin/settings"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/settings')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Configurações
              </Link>
            </nav>
          </div>
          
          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userProfile?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userProfile?.email || 'admin@example.com'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Sair"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-40 flex ${
          isSidebarOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            isSidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'
          }`}
          onClick={toggleSidebar}
        ></div>
        
        {/* Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transform transition ease-in-out duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Fechar sidebar</span>
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
                ✂️
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/dashboard')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={toggleSidebar}
              >
                <FiGrid className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              
              <Link
                to="/admin/appointments"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/appointments')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={toggleSidebar}
              >
                <FiCalendar className="mr-3 h-5 w-5" />
                Agendamentos
              </Link>
              
              <Link
                to="/admin/services"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/services')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={toggleSidebar}
              >
                <FiScissors className="mr-3 h-5 w-5" />
                Serviços
              </Link>
              
              <Link
                to="/admin/settings"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/admin/settings')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={toggleSidebar}
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Configurações
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 text-base font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <button
            className="md:hidden px-4 text-gray-500 dark:text-gray-400 focus:outline-none"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Abrir sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {location.pathname === '/admin/dashboard' && 'Dashboard'}
                {location.pathname === '/admin/appointments' && 'Agendamentos'}
                {location.pathname === '/admin/services' && 'Serviços'}
                {location.pathname === '/admin/settings' && 'Configurações'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification dropdown */}
              <div className="relative">
                <button
                  id="notification-button"
                  className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                >
                  <span className="sr-only">Ver notificações</span>
                  <FiBell className="h-6 w-6" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {notificationCount}
                    </span>
                  )}
                </button>
                
                {notificationOpen && (
                  <div
                    id="notification-dropdown"
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Notificações
                        </h3>
                        {notificationCount > 0 && (
                          <button
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                            onClick={markAllAsRead}
                          >
                            Marcar todas como lidas
                          </button>
                        )}
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                          <p className="text-sm">
                            Nenhuma notificação.
                          </p>
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                                !notification.read
                                  ? 'bg-indigo-50 dark:bg-indigo-900/10'
                                  : ''
                              }`}
                            >
                              <div className="flex">
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                  notification.type === 'appointment-created'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : notification.type === 'appointment-updated'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                  {notification.type === 'appointment-created' ? (
                                    <FiCalendar size={14} />
                                  ) : notification.type === 'appointment-updated' ? (
                                    <FiUser size={14} />
                                  ) : (
                                    <FiSettings size={14} />
                                  )}
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(notification.time).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme toggle */}
              <div className="ml-3">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;