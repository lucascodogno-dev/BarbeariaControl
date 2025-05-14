import { io } from "socket.io-client";

let socket;

try {
  const socketServerUrl =
    import.meta.env.VITE_SOCKET_SERVER_URL || 'https://barbershop-backend-ai73.onrender.com';

  socket = io(socketServerUrl, {
    transports: ['websocket'], // 🚨 força uso de WebSocket e evita fallback polling
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true
  });

  socket.on("connect", () => {
    console.log("✅ Socket conectado:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket desconectado:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Erro de conexão:", error);
  });

  console.log("🟢 Socket.io inicializado");
} catch (error) {
  console.error("❌ Erro ao inicializar Socket.io:", error);
  socket = {
    on: () => {},
    off: () => {},
    emit: () => {},
    id: null,
    connected: false
  };
}

export default socket;
