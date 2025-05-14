
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Layouts
// import ClientLayout from './components/layouts/ClientLayout';
// import AdminLayout from './components/layouts/AdminLayout';

// // Páginas do Cliente
// import HomePage from './pages/client/HomePage';
// import BookingPage from './pages/client/BookingPage';
// import ProfilePage from './pages/client/ProfilePage';

// // Páginas do Admin
// import LoginPage from './pages/admin/LoginPage';
// import DashboardPage from './pages/admin/DashboardPage';
// import AppointmentsPage from './pages/admin/AppointmentsPage';
// import ServicesPage from './pages/admin/ServicesPage';
// import SettingsPage from './pages/admin/Settings';

// // Stores
// import useAuthStore from './store/authStore';
// import useUiStore from './store/uiStore';

// // Utilitários
// import { initializeTheme } from './utils/theme';
// import { cleanExpiredBookings } from './utils/localStorage';

// // Componente de proteção de rota para o Admin
// const AdminRoute = ({ children }) => {
//   const { isAdmin, loading } = useAuthStore();
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }
  
//   return isAdmin ? children : <Navigate to="/admin/login" />;
// };

// function App() {
//   const { initAuth } = useAuthStore();
//   const { isDarkMode, alerts, removeAlert } = useUiStore();
  
//   // Inicializa o tema e o estado da autenticação
//   useEffect(() => {
//     // Inicializa o tema
//     initializeTheme();
    
//     // Inicializa o estado da autenticação
//     const unsubscribe = initAuth();
    
//     // Limpa agendamentos expirados no localStorage
//     cleanExpiredBookings();
    
//     return () => {
//       if (typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, [initAuth]);
  
//   return (
//     <Router>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme={isDarkMode ? 'dark' : 'light'}
//       />
      
//       <Routes>
//         {/* Rotas do cliente */}
//         <Route
//           path="/"
//           element={
//             <ClientLayout>
//               <HomePage />
//             </ClientLayout>
//           }
//         />
//         <Route
//           path="/booking"
//           element={
//             <ClientLayout>
//               <BookingPage />
//             </ClientLayout>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ClientLayout>
//               <ProfilePage />
//             </ClientLayout>
//           }
//         />
        
//         {/* Rotas do admin */}
//         <Route path="/admin/login" element={<LoginPage />} />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <DashboardPage />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/appointments"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <AppointmentsPage />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/services"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <ServicesPage />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/settings"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <SettingsPage />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
        
//         {/* Redirecionamento para página inicial */}
//         <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
      
//       {/* Alert System */}
//       <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
//         {alerts.map((alert) => (
//           <div
//             key={alert.id}
//             className={`px-4 py-3 rounded-lg shadow-md flex items-start ${
//               alert.type === 'success'
//                 ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
//                 : alert.type === 'error'
//                 ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
//                 : alert.type === 'warning'
//                 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
//                 : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
//             }`}
//           >
//             <div className="flex-1">{alert.message}</div>
//             <button
//               onClick={() => removeAlert(alert.id)}
//               className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import ClientLayout from './components/layouts/ClientLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Páginas do Cliente
import HomePage from './pages/client/HomePage';
import BookingPage from './pages/client/BookingPage';
import ProfilePage from './pages/client/ProfilePage';

// Páginas do Admin
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import ServicesPage from './pages/admin/ServicesPage';
import SettingsPage from './pages/admin/Settings';

// Stores
import useAuthStore from './store/authStore';
import useUiStore from './store/uiStore';

// Utilitários
import { initializeTheme } from './utils/theme';
import { cleanExpiredBookings, removeBooking } from './utils/localStorage';

// Socket.io
import socket from './services/socket';

// Componente de proteção de rota para o Admin
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

function App() {
  const { initAuth } = useAuthStore();
  const { isDarkMode, alerts, removeAlert, showAlert } = useUiStore();
  
  // Inicializa o tema e o estado da autenticação
  useEffect(() => {
    // Inicializa o tema
    initializeTheme();
    
    // Inicializa o estado da autenticação
    const unsubscribe = initAuth();
    
    // Limpa agendamentos expirados no localStorage
    cleanExpiredBookings();
    
    // Configurar listener para o evento 'appointment-deleted'
    socket.on('appointment-deleted', (appointmentId) => {
      console.log('Recebido evento de exclusão de agendamento:', appointmentId);
      
      // Remove o agendamento do localStorage do cliente
      const removed = removeBooking(appointmentId);
      
      if (removed) {
        console.log(`Agendamento ${appointmentId} removido com sucesso do localStorage`);
        showAlert('Seu agendamento foi cancelado pelo estabelecimento.', 'info');
      }
    });
    
    // Retorna função de limpeza
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      
      // Remove o listener do socket ao desmontar
      socket.off('appointment-deleted');
    };
  }, [initAuth, showAlert]);
  
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />
      
      <Routes>
        {/* Rotas do cliente */}
        <Route
          path="/"
          element={
            <ClientLayout>
              <HomePage />
            </ClientLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <ClientLayout>
              <BookingPage />
            </ClientLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ClientLayout>
              <ProfilePage />
            </ClientLayout>
          }
        />
        
        {/* Rotas do admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <AdminRoute>
              <AdminLayout>
                <AppointmentsPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <AdminRoute>
              <AdminLayout>
                <ServicesPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminLayout>
                <SettingsPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        
        {/* Redirecionamento para página inicial */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Alert System */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`px-4 py-3 rounded-lg shadow-md flex items-start ${
              alert.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                : alert.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                : alert.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}
          >
            <div className="flex-1">{alert.message}</div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </Router>
  );
}

export default App;