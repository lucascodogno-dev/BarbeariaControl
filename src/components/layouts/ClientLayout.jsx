// // import React from 'react';
// // import { Link, useLocation } from 'react-router-dom';
// // import { FiCalendar, FiUser, FiHome, FiClock, FiMenu, FiX } from 'react-icons/fi';
// // import ThemeToggle from '../common/ThemeToggle';
// // import { cleanExpiredBookings, getUserInfo } from '../../utils/localStorage';
// // import { useState, useEffect } from 'react';

// // const ClientLayout = ({ children }) => {
// //   const location = useLocation();
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [clientInfo, setClientInfo] = useState(null);
  
// //   // Carrega as informações do cliente e limpa agendamentos expirados
// //   useEffect(() => {
// //     const userInfo = getUserInfo();
// //     setClientInfo(userInfo);
    
// //     // Limpa agendamentos expirados no localStorage
// //     cleanExpiredBookings();
// //   }, []);
  
// //   // Verifica se o link está ativo
// //   const isActive = (path) => {
// //     if (path === '/' && location.pathname !== '/') {
// //       return false;
// //     }
// //     return location.pathname.startsWith(path);
// //   };
  
// //   // Fecha o menu mobile quando a rota muda
// //   useEffect(() => {
// //     setMobileMenuOpen(false);
// //   }, [location.pathname]);
  
// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
// //       {/* Header */}
// //       <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             {/* Logo */}
// //             <div className="flex items-center">
// //               <Link to="/" className="flex items-center">
// //                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl mr-3">
// //                   ✂️
// //                 </div>
// //                 <span className="font-bold text-xl text-gray-900 dark:text-white">
// //                   Barber
// //                   <span className="text-indigo-600 dark:text-indigo-400">Shop</span>
// //                 </span>
// //               </Link>
// //             </div>
            
// //             {/* Navigation - Desktop */}
// //             <nav className="hidden md:flex items-center space-x-4">
// //               <Link
// //                 to="/"
// //                 className={`px-3 py-2 rounded-md text-sm font-medium ${
// //                   isActive('/')
// //                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
// //                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
// //                 }`}
// //               >
// //                 <FiHome className="inline mr-1" size={16} />
// //                 Início
// //               </Link>
// //               <Link
// //                 to="/booking"
// //                 className={`px-3 py-2 rounded-md text-sm font-medium ${
// //                   isActive('/booking')
// //                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
// //                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
// //                 }`}
// //               >
// //                 <FiCalendar className="inline mr-1" size={16} />
// //                 Agendar
// //               </Link>
// //               <Link
// //                 to="/profile"
// //                 className={`px-3 py-2 rounded-md text-sm font-medium ${
// //                   isActive('/profile')
// //                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
// //                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
// //                 }`}
// //               >
// //                 <FiUser className="inline mr-1" size={16} />
// //                 Perfil
// //               </Link>
// //             </nav>
            
// //             {/* Right Section */}
// //             <div className="flex items-center">
// //               {/* Theme Toggle */}
// //               <ThemeToggle />
              
// //               {/* Mobile Menu Button */}
// //               <button
// //                 className="ml-4 md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
// //                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //               >
// //                 {mobileMenuOpen ? (
// //                   <FiX size={24} />
// //                 ) : (
// //                   <FiMenu size={24} />
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Mobile Menu */}
// //         <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
// //           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
// //             <Link
// //               to="/"
// //               className={`block px-3 py-2 rounded-md text-base font-medium ${
// //                 isActive('/')
// //                   ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
// //                   : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
// //               }`}
// //             >
// //               <FiHome className="inline mr-2" size={16} />
// //               Início
// //             </Link>
// //             <Link
// //               to="/booking"
// //               className={`block px-3 py-2 rounded-md text-base font-medium ${
// //                 isActive('/booking')
// //                   ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
// //                   : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
// //               }`}
// //             >
// //               <FiCalendar className="inline mr-2" size={16} />
// //               Agendar
// //             </Link>
// //             <Link
// //               to="/profile"
// //               className={`block px-3 py-2 rounded-md text-base font-medium ${
// //                 isActive('/profile')
// //                   ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
// //                   : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
// //               }`}
// //             >
// //               <FiUser className="inline mr-2" size={16} />
// //               Perfil
// //             </Link>
// //           </div>
          
// //           {/* Cliente info mobile */}
// //           {clientInfo && (
// //             <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
// //               <div className="flex items-center">
// //                 <div className="flex-shrink-0">
// //                   <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
// //                     {clientInfo.name.charAt(0).toUpperCase()}
// //                   </div>
// //                 </div>
// //                 <div className="ml-3">
// //                   <div className="text-base font-medium text-gray-800 dark:text-white">
// //                     {clientInfo.name}
// //                   </div>
// //                   <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
// //                     {clientInfo.phone}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </header>
      
// //       {/* Main Content */}
// //       <main className="flex-1 transition-colors">
// //         {children}
// //       </main>
      
// //       {/* Footer */}
// //       <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //           <div className="flex flex-col md:flex-row justify-between items-center">
// //             <div className="flex items-center mb-4 md:mb-0">
// //               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
// //                 ✂️
// //               </div>
// //               <span className="font-bold text-gray-900 dark:text-white">
// //                 BarberShop
// //               </span>
// //             </div>
            
// //             <div className="flex flex-col md:flex-row items-center md:space-x-6 text-sm text-gray-500 dark:text-gray-400">
// //               <a
// //                 href="#"
// //                 className="mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100"
// //               >
// //                 <FiHome className="inline mr-1" size={14} />
// //                 Rua da Barbearia, 123
// //               </a>
// //               <a
// //                 href="#"
// //                 className="mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100"
// //               >
// //                 <FiClock className="inline mr-1" size={14} />
// //                 Seg-Sáb: 8h às 20h
// //               </a>
// //               <a
// //                 href="#"
// //                 className="hover:text-gray-900 dark:hover:text-gray-100"
// //               >
// //                 Política de Privacidade
// //               </a>
// //             </div>
// //           </div>
          
// //           <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 dark:text-gray-500">
// //             &copy; {new Date().getFullYear()} BarberShop. Todos os direitos reservados.
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default ClientLayout;
// // src/layouts/ClientLayout.js
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { FiCalendar, FiUser, FiHome, FiClock, FiMenu, FiX, FiAlertCircle } from 'react-icons/fi';
// import ThemeToggle from '../common/ThemeToggle';
// import { cleanExpiredBookings, getUserInfo } from '../../utils/localStorage';
// import { useSettings } from '../../hooks/useSettings';


// const ClientLayout = ({ children }) => {
//   const location = useLocation();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [clientInfo, setClientInfo] = useState(null);
//   const { settings, loading, error } = useSettings();

//   // Carrega as informações do cliente e limpa agendamentos expirados
//   useEffect(() => {
//     const userInfo = getUserInfo();
//     setClientInfo(userInfo);
//     cleanExpiredBookings();
//   }, []);

//   // Verifica se o link está ativo
//   const isActive = (path) => {
//     if (path === '/' && location.pathname !== '/') {
//       return false;
//     }
//     return location.pathname.startsWith(path);
//   };

//   // Fecha o menu mobile quando a rota muda
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [location.pathname]);

//   // Tratamento de estados de carregamento e erro
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="text-center p-6 max-w-md">
//           <div className="text-red-500 mb-4">
//             <FiAlertCircle size={48} className="mx-auto" />
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//             Erro ao carregar as configurações
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             Não foi possível carregar as informações da barbearia. Algumas funcionalidades podem estar limitadas.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//           >
//             Recarregar
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
//       {/* Header */}
//       <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center">
//               <Link to="/" className="flex items-center">
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl mr-3">
//                   {settings?.logo || "✂️"}
//                 </div>
//                 <span className="font-bold text-xl text-gray-900 dark:text-white">
//                   {settings?.shopName || "BarberShop"}
//                 </span>
//               </Link>
//             </div>
            
//             {/* Navigation - Desktop */}
//             <nav className="hidden md:flex items-center space-x-4">
//               <Link
//                 to="/"
//                 className={`px-3 py-2 rounded-md text-sm font-medium ${
//                   isActive('/')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
//                 }`}
//               >
//                 <FiHome className="inline mr-1" size={16} />
//                 Início
//               </Link>
//               <Link
//                 to="/booking"
//                 className={`px-3 py-2 rounded-md text-sm font-medium ${
//                   isActive('/booking')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
//                 }`}
//               >
//                 <FiCalendar className="inline mr-1" size={16} />
//                 Agendar
//               </Link>
//               <Link
//                 to="/profile"
//                 className={`px-3 py-2 rounded-md text-sm font-medium ${
//                   isActive('/profile')
//                     ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
//                 }`}
//               >
//                 <FiUser className="inline mr-1" size={16} />
//                 Perfil
//               </Link>
//             </nav>
            
//             {/* Right Section */}
//             <div className="flex items-center">
//               {/* Theme Toggle */}
//               <ThemeToggle />
              
//               {/* Mobile Menu Button */}
//               <button
//                 className="ml-4 md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 {mobileMenuOpen ? (
//                   <FiX size={24} />
//                 ) : (
//                   <FiMenu size={24} />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile Menu */}
//         <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
//             <Link
//               to="/"
//               className={`block px-3 py-2 rounded-md text-base font-medium ${
//                 isActive('/')
//                   ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                   : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
//               }`}
//             >
//               <FiHome className="inline mr-2" size={16} />
//               Início
//             </Link>
//             <Link
//               to="/booking"
//               className={`block px-3 py-2 rounded-md text-base font-medium ${
//                 isActive('/booking')
//                   ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                   : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
//               }`}
//             >
//               <FiCalendar className="inline mr-2" size={16} />
//               Agendar
//             </Link>
//             <Link
//               to="/profile"
//               className={`block px-3 py-2 rounded-md text-base font-medium ${
//                 isActive('/profile')
//                   ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
//                   : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
//               }`}
//             >
//               <FiUser className="inline mr-2" size={16} />
//               Perfil
//             </Link>
//           </div>
          
//           {/* Cliente info mobile */}
//           {clientInfo && (
//             <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
//                     {clientInfo.name.charAt(0).toUpperCase()}
//                   </div>
//                 </div>
//                 <div className="ml-3">
//                   <div className="text-base font-medium text-gray-800 dark:text-white">
//                     {clientInfo.name}
//                   </div>
//                   <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                     {clientInfo.phone}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>
      
//       {/* Main Content */}
//       <main className="flex-1 transition-colors">
//         {children}
//       </main>
      
//       {/* Footer */}
//       <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center mb-4 md:mb-0">
//               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
//                 {settings?.logo || "✂️"}
//               </div>
//               <span className="font-bold text-gray-900 dark:text-white">
//                 {settings?.shopName || "BarberShop"}
//               </span>
//             </div>
            
//             <div className="flex flex-col md:flex-row items-center md:space-x-6 text-sm text-gray-500 dark:text-gray-400">
//               <div className="mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100">
//                 <FiHome className="inline mr-1" size={14} />
//                 {settings?.address || "Endereço não disponível"}
//               </div>
//               <div className="mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100">
//                 <FiClock className="inline mr-1" size={14} />
//                 {settings?.hours || "Horário não disponível"}
//               </div>
//               <a
//                 href={`tel:${settings?.phone?.replace(/\D/g, '')}`}
//                 className="mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100"
//               >
//                 {settings?.phone || "(00) 00000-0000"}
//               </a>
//             </div>
//           </div>
          
//           <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 dark:text-gray-500">
//             &copy; {new Date().getFullYear()} {settings?.shopName || "BarberShop"}. Todos os direitos reservados.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ClientLayout;
// src/layouts/ClientLayout.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUser, 
  FiHome, 
  FiClock, 
  FiMenu, 
  FiX, 
  FiAlertCircle, 
  FiPhone, 
  FiMapPin 
} from 'react-icons/fi';
 import ThemeToggle from '../common/ThemeToggle';
 import { cleanExpiredBookings, getUserInfo } from '../../utils/localStorage';
 import { useSettings } from '../../hooks/useSettings';

const ClientLayout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const { settings, loading, error } = useSettings();

  // Carrega as informações do cliente e limpa agendamentos expirados
  useEffect(() => {
    const userInfo = getUserInfo();
    setClientInfo(userInfo);
    cleanExpiredBookings();
  }, []);

  // Verifica se o link está ativo
  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Função para formatar telefone
  const formatPhone = (phone) => {
    if (!phone) return '(00) 00000-0000';
    
    // Remove tudo que não é dígito
    const cleaned = phone.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      let formatted = '';
      if (match[1]) formatted += `(${match[1]}`;
      if (match[2]) formatted += `) ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      return formatted;
    }
    
    return phone; // Retorna o original se não puder formatar
  };

  // Função para redirecionar para o WhatsApp
  const handlePhoneClick = () => {
    if (!settings?.phone) return;
    
    // Remove tudo que não é dígito
    const cleaned = settings.phone.replace(/\D/g, '');
    
    // Verifica se tem DDI (Brasil +55)
    const fullNumber = cleaned.length === 11 ? `55${cleaned}` : cleaned;
    
    // Abre o link do WhatsApp
    window.open(`https://wa.me/${fullNumber}`, '_blank');
  };

  // Função para redirecionar para o Google Maps
  const handleAddressClick = () => {
    if (!settings?.address) return;
    
    // Codifica o endereço para URL
    const encodedAddress = encodeURIComponent(settings.address);
    
    // Abre o Google Maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Tratamento de estados de carregamento e erro
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 mb-4">
            <FiAlertCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Erro ao carregar as configurações
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Não foi possível carregar as informações da barbearia. Algumas funcionalidades podem estar limitadas.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl mr-3">
                  {settings?.logo || "✂️"}
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  {settings?.shopName || "BarberShop"}
                </span>
              </Link>
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <FiHome className="inline mr-1" size={16} />
                Início
              </Link>
              <Link
                to="/booking"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/booking')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <FiCalendar className="inline mr-1" size={16} />
                Agendar
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/profile')
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <FiUser className="inline mr-1" size={16} />
                Perfil
              </Link>
            </nav>
            
            {/* Right Section */}
            <div className="flex items-center">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <button
                className="ml-4 md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <FiX size={24} />
                ) : (
                  <FiMenu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/')
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <FiHome className="inline mr-2" size={16} />
              Início
            </Link>
            <Link
              to="/booking"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/booking')
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <FiCalendar className="inline mr-2" size={16} />
              Agendar
            </Link>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/profile')
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <FiUser className="inline mr-2" size={16} />
              Perfil
            </Link>
          </div>
          
          {/* Cliente info mobile */}
          {clientInfo && (
            <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    {clientInfo.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {clientInfo.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {clientInfo.phone}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 transition-colors">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm mr-2">
                {settings?.logo || "✂️"}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {settings?.shopName || "BarberShop"}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-6 text-sm text-gray-500 dark:text-gray-400">
              {/* Endereço com link para Google Maps */}
              <button
                onClick={handleAddressClick}
                className="flex items-center mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FiMapPin className="mr-1" size={14} />
                {settings?.address || "Endereço não disponível"}
              </button>
              
              {/* Horário de funcionamento */}
              <div className="flex items-center mb-2 md:mb-0">
                <FiClock className="mr-1" size={14} />
                {settings?.hours || "Horário não disponível"}
              </div>
              
              {/* Telefone com link para WhatsApp */}
              <button
                onClick={handlePhoneClick}
                className="flex items-center mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FiPhone className="mr-1" size={14} />
                {formatPhone(settings?.phone) || "(00) 00000-0000"}
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {settings?.shopName || "BarberShop"}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;