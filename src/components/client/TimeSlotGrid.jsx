// import React, { useEffect } from 'react';
// import useAppointmentStore from '../../store/appointmentStore';
// import useUiStore from '../../store/uiStore';
// import socket from '../../services/socket';
// import { FiClock, FiCheck, FiLock, FiAlertCircle } from 'react-icons/fi';
// import { isPastTime } from '../../utils/date';

// const TimeSlotGrid = () => {
//   const { 
//     selectedDate, 
//     selectedTime, 
//     setSelectedTime, 
//     availableSlots, 
//     fetchAppointmentsByDate 
//   } = useAppointmentStore();
  
//   const { setBookingStep, showAlert } = useUiStore();
  
//   // Busca os agendamentos para a data selecionada
//   useEffect(() => {
//     if (selectedDate) {
//       fetchAppointmentsByDate(selectedDate);
//     }
//   }, [selectedDate, fetchAppointmentsByDate]);
  
//   // Configuração de sockets para atualização em tempo real
//   useEffect(() => {
//     const handleRealTimeUpdate = () => {
//       if (selectedDate) {
//         fetchAppointmentsByDate(selectedDate);
//       }
//     };
    
//     socket.on('appointment-created', handleRealTimeUpdate);
//     socket.on('appointment-updated', handleRealTimeUpdate);
//     socket.on('appointment-deleted', handleRealTimeUpdate);
    
//     return () => {
//       socket.off('appointment-created', handleRealTimeUpdate);
//       socket.off('appointment-updated', handleRealTimeUpdate);
//       socket.off('appointment-deleted', handleRealTimeUpdate);
//     };
//   }, [selectedDate, fetchAppointmentsByDate]);
  
//   // Seleciona um horário
//   const handleTimeSelect = (time, isBooked, isPast) => {
//     if (isBooked || isPast) return;
    
//     setSelectedTime(time);
//     showAlert(`Horário selecionado: ${time}`, 'success');
//   };
  
//   // Avança para o próximo passo
//   const handleContinue = () => {
//     if (!selectedTime) {
//       showAlert('Por favor, selecione um horário para continuar.', 'error');
//       return;
//     }
    
//     setBookingStep(4);
//   };
  
//   // Volta para o passo anterior
//   const handleBack = () => {
//     setBookingStep(2);
//   };
  
//   // Verifica se o horário já passou (para o dia de hoje)
//   const checkIfTimePast = (time) => {
//     if (!selectedDate) return false;
    
//     const dateStr = selectedDate.toISOString().split('T')[0];
//     return isPastTime(time, dateStr);
//   };
  
//   return (
//     <div className="py-6">
//       <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//         Escolha o horário
//       </h2>
      
//       {/* Status dos horários */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="flex items-center text-sm">
//           <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Selecionado</span>
//         </div>
//         <div className="flex items-center text-sm">
//           <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Disponível</span>
//         </div>
//         <div className="flex items-center text-sm">
//           <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Indisponível</span>
//         </div>
//         <div className="flex items-center text-sm">
//           <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></div>
//           <span className="text-gray-700 dark:text-gray-300">Horário passado</span>
//         </div>
//       </div>
      
//       {/* Grade de horários */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
//         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
//           {availableSlots.map((slot) => {
//             const isPast = checkIfTimePast(slot.time);
//             const isSelected = selectedTime === slot.time;
            
//             return (
//               <div
//                 key={slot.time}
//                 className={`
//                   relative rounded-lg p-4 text-center transition-all
//                   ${
//                     isPast
//                       ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                       : slot.isBooked
//                       ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 cursor-not-allowed'
//                       : isSelected
//                       ? 'bg-indigo-600 text-white shadow-md transform scale-105'
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-650 cursor-pointer'
//                   }
//                 `}
//                 onClick={() => handleTimeSelect(slot.time, slot.isBooked, isPast)}
//               >
//                 {/* Ícone de status */}
//                 <div className="absolute top-1 right-1">
//                   {isPast ? (
//                     <FiClock size={14} className="text-gray-500 dark:text-gray-400" />
//                   ) : slot.isBooked ? (
//                     <FiLock size={14} className="text-red-600 dark:text-red-400" />
//                   ) : isSelected ? (
//                     <FiCheck size={14} className="text-white" />
//                   ) : null}
//                 </div>
                
//                 {/* Horário */}
//                 <div className="font-semibold">
//                   {slot.time}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
        
//         {availableSlots.length === 0 && (
//           <div className="flex items-center justify-center py-12 text-center">
//             <div className="max-w-sm">
//               <div className="text-indigo-500 dark:text-indigo-400 mb-2">
//                 <FiAlertCircle size={32} className="mx-auto" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
//                 Nenhum horário disponível
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400">
//                 Não encontramos horários disponíveis para a data selecionada. Por favor, selecione outra data.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {selectedTime && (
//         <div className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-6">
//           <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
//             <FiClock size={20} />
//           </div>
//           <div className="ml-4">
//             <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">
//               Horário selecionado
//             </div>
//             <div className="text-lg text-gray-900 dark:text-white font-semibold">
//               {selectedTime}
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Botões de navegação */}
//       <div className="mt-8 flex justify-between">
//         <button
//           onClick={handleBack}
//           className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//         >
//           Voltar
//         </button>
        
//         <button
//           onClick={handleContinue}
//           disabled={!selectedTime}
//           className={`
//             px-6 py-2 rounded-lg font-medium text-white
//             ${
//               selectedTime
//                 ? 'bg-indigo-600 hover:bg-indigo-700'
//                 : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
//             }
//             transition-colors
//           `}
//         >
//           Continuar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimeSlotGrid;
import React, { useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import useUiStore from '../../store/uiStore';
import socket from '../../services/socket';
import { FiClock, FiCheck, FiLock, FiAlertCircle } from 'react-icons/fi';
import { isPastTime } from '../../utils/date';

const TimeSlotGrid = () => {
  const { 
    selectedDate, 
    selectedTime, 
    setSelectedTime, 
    availableSlots, 
    fetchAppointmentsByDate 
  } = useAppointmentStore();
  
  const { setBookingStep, showAlert } = useUiStore();
  
  // Busca os agendamentos para a data selecionada
  useEffect(() => {
  if (selectedDate) {
    fetchAppointmentsByDate(selectedDate);
  }
}, [selectedDate, fetchAppointmentsByDate]);

  
  // Configuração de sockets para atualização em tempo real
  useEffect(() => {
    const handleRealTimeUpdate = () => {
      if (selectedDate) {
        fetchAppointmentsByDate(selectedDate);
      }
    };
    
    socket.on('appointment-created', handleRealTimeUpdate);
    socket.on('appointment-updated', handleRealTimeUpdate);
    socket.on('appointment-deleted', handleRealTimeUpdate);
    
    return () => {
      socket.off('appointment-created', handleRealTimeUpdate);
      socket.off('appointment-updated', handleRealTimeUpdate);
      socket.off('appointment-deleted', handleRealTimeUpdate);
    };
  }, [selectedDate, fetchAppointmentsByDate]);
  
  // Seleciona um horário
  const handleTimeSelect = (time, isBooked, isPast) => {
    if (isBooked || isPast) return;
    
    setSelectedTime(time);
    showAlert(`Horário selecionado: ${time}`, 'success');
  };
  
  // Avança para o próximo passo
  const handleContinue = () => {
    if (!selectedTime) {
      showAlert('Por favor, selecione um horário para continuar.', 'error');
      return;
    }
    
    setBookingStep(4);
  };
  
  // Volta para o passo anterior
  const handleBack = () => {
    setBookingStep(2);
  };
  
  // Verifica se o horário já passou (para o dia de hoje)
 const checkIfTimePast = (time) => {
  if (!selectedDate) return false;

  const now = new Date();
  const slotDate = new Date(selectedDate);
const pad = (n) => String(n).padStart(2, '0');
const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const selectedStr = slotDate.toISOString().split('T')[0];

  const [hour, minute] = time.split(':').map(Number);
  slotDate.setHours(hour, minute, 0, 0);

  const isToday = todayStr === selectedStr;

  if (isToday) {
    // Passou das 20h → tudo bloqueado
    if (now.getHours() >= 20) return true;
    return slotDate <= now;
  }

  return false;
};

  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Escolha o horário
      </h2>
      
      {/* Status dos horários */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Selecionado</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Disponível</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Indisponível</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Horário passado</span>
        </div>
      </div>
      
      {/* Grade de horários */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {availableSlots.map((slot) => {
            const isPast = checkIfTimePast(slot.time);
            const isSelected = selectedTime === slot.time;
            
            return (
              <div
                key={slot.time}
                className={`
                  relative rounded-lg p-4 text-center transition-all
                  ${
                    isPast
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : slot.isBooked
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-650 cursor-pointer'
                  }
                `}
                onClick={() => handleTimeSelect(slot.time, slot.isBooked, isPast)}
              >
                {/* Ícone de status */}
                <div className="absolute top-1 right-1">
                  {isPast ? (
                    <FiClock size={14} className="text-gray-500 dark:text-gray-400" />
                  ) : slot.isBooked ? (
                    <FiLock size={14} className="text-red-600 dark:text-red-400" />
                  ) : isSelected ? (
                    <FiCheck size={14} className="text-white" />
                  ) : null}
                </div>
                
                {/* Horário */}
                <div className="font-semibold">
                  {slot.time}
                </div>
              </div>
            );
          })}
        </div>
        
        {availableSlots.length === 0 && (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="max-w-sm">
              <div className="text-indigo-500 dark:text-indigo-400 mb-2">
                <FiAlertCircle size={32} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Nenhum horário disponível
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não encontramos horários disponíveis para a data selecionada. Por favor, selecione outra data.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {selectedTime && (
        <div className="flex items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-6">
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
            <FiClock size={20} />
          </div>
          <div className="ml-4">
            <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">
              Horário selecionado
            </div>
            <div className="text-lg text-gray-900 dark:text-white font-semibold">
              {selectedTime}
            </div>
          </div>
        </div>
      )}
      
      {/* Botões de navegação */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Voltar
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className={`
            px-6 py-2 rounded-lg font-medium text-white
            ${
              selectedTime
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }
            transition-colors
          `}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default TimeSlotGrid;