
import { io } from "socket.io-client";

// Variável para armazenar a instância do socket
let socket;

try {
  // Obtém a URL do servidor Socket.io das variáveis de ambiente
  const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL || 'https://barbershop-backend.netlify.app/';
  
  // Cria a instância do socket com configurações de reconexão
  socket = io(socketServerUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });
  
  // Eventos de conexão
  socket.on("connect", () => {
    console.log("Socket conectado:", socket.id);
  });
  
  socket.on("disconnect", (reason) => {
    console.log("Socket desconectado:", reason);
  });
  
  socket.on("connect_error", (error) => {
    console.error("Erro de conexão:", error);
  });
  
  console.log("Socket.io inicializado");
} catch (error) {
  console.error("Erro ao inicializar Socket.io:", error);
  
  // Cria um objeto mock para evitar erros quando socket.on é chamado
  socket = {
    on: () => {},
    off: () => {},
    emit: () => {},
    id: null,
    connected: false
  };
}

// Exporta a instância do socket
export default socket;