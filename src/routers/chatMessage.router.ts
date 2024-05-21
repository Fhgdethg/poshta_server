import { Server } from 'socket.io';

import chatMessageRepository from '../repositories/chatMessage.repository.js';

import { wsRoutes } from '../constants/wsRoutes.js';

const chatMessageRouter = (io: Server) => {
  io.on(wsRoutes.connection, async (socket) => {
    console.log('WebSocket chat started successfully');

    const messages = await chatMessageRepository.findAll();
    io.emit(wsRoutes.getAllMessages, messages || []);

    socket.on(wsRoutes.chatMsg, async (msg) => {
      await chatMessageRepository.create(msg);
      io.emit(wsRoutes.chatMsg, msg);
    });

    socket.on(wsRoutes.disconnect, () => {
      console.log('WebSocket chat disconnected');
    });
  });

  return io;
};

export default chatMessageRouter;
