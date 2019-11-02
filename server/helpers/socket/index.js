const socketIO = require('socket.io');

let io;

const socketSendMessage = (socketId, channel, user) => io.to(socketId).emit(channel, user);

const initSocket = server => {
  const io = socketIO(server);

  io.on('connection', socket => {
    console.log('user connected');
  });
};

const channels = {
  VEHICLE_LISTENING: 'VEHICLE_LISTENING',
  USER_LISTENING: 'USER_LISTENING'
};

module.exports = {
  initSocket,
  socketSendMessage,
  channels
};
