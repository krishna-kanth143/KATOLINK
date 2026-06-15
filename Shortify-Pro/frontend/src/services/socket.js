import { io } from 'socket.io-client';

let socket;

export const connectSocket = (token) => {
  if (socket) return socket;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  socket = io(backendUrl, {
    auth: { token },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Telemetry link established');
  });

  socket.on('connect_error', (err) => {
    console.error('Telemetry link failure:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
