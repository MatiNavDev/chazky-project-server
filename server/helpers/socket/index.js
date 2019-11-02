const socketIO = require('socket.io');

const channels = {
  VEHICLE_LISTENING_FOR_TRAVEL: 'VEHICLE_LISTENING_FOR_TRAVEL',
  USER_LISTENING_FOR_TRAVEL: 'USER_LISTENING_FOR_TRAVEL',
  USER_DISCONNECT: 'USER_DISCONNECT'
};

let io;

/**
 * Envia data al socket especificado por el canal enviado.
 * @param {string} socketId
 * @param {string} channel
 * @param {*} data
 */
const socketSendMessage = (socketId, channel, data) => io.to(socketId).emit(channel, data);

/**
 * Desconecta un usuario especifico
 * @param {string} socketId
 */
const socketDisconnectSpecificUser = socketId =>
  socketSendMessage(socketId, channels.USER_DISCONNECT);

/**
 * Inicializa el socket
 * @param {*} server
 */
const initSocket = server => {
  const io = socketIO(server);

  io.on('connection', socket => {
    console.log('user connected');
  });
};

module.exports = {
  socketDisconnectSpecificUser,
  initSocket,
  socketSendMessage,
  channels
};
