import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication Middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Telemetry client synchronized: ${socket.id} (User: ${socket.userId})`);
    
    // Join a private room for user-specific telemetry
    socket.join(socket.userId);
    
    // Global telemetry update
    socket.emit('active_visitors', { count: Math.max(1, io.engine.clientsCount) });
    
    socket.on('disconnect', () => {
      console.log('Telemetry client desynchronized');
    });
  });

  return io;
};


export const getIO = () => {
  if (!io) {
    // console.warn('Socket.io not initialized');
  }
  return io;
};
