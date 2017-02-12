const url = require('url');
const debug = require('debug')('chat:ws');

const UserRegistry = require('./UserRegistry');
const SocketMessage = require('./SocketMessage');


const closeSocketWithMsg = (ws, msg) => {
  ws.send(msg);
  return ws.close();
}

/**
 * Accept new socket connection and
 * authorize it by `?authToken=` value
 *
 * If authToken doesn't belong to any registered user - reject
 */
function onConnect(ws) {
  const location = url.parse(ws.upgradeReq.url, true);

  if (!location.query.authToken) {
    return closeSocketWithMsg(ws, 'No token');
  }

  let user = UserRegistry.getByToken(location.query.authToken);
  if (!user) {
    return closeSocketWithMsg(ws, 'Invalid token');
  }

  // set a custom send message function to handle SocketMessage classes
  const sendSocketMessage = msg => ws.send(msg.toString());
  ws.sendMsg = sendSocketMessage;

  const onListChange = () => ws.sendMsg(
    new SocketMessage.UserListChange(UserRegistry.getUsers())
  );

  // Attach to user his open websocket
  user.ws = ws;
  ws.sendMsg(new SocketMessage.Registered(user.name));

  UserRegistry.on(UserRegistry.EVENT_LIST_CHANGE, onListChange);

  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message);

    if (msg && msg.type) {
      switch(msg.type) {
        case 'MessageAck':
          // notify sender that message was delivered
          let sender = UserRegistry.getByName(msg.from);
          if (sender && sender.ws) {
            sender.ws.sendMsg(new SocketMessage.MessageDelivered(msg.from, msg.to, msg.messageId));
          } else {
            debug(`Cannot confirm MessageAck, user not found: ${msg.from}`);
          }
          break;
      }
      debug(`New message: ${msg.type}`, msg);
    }
  });


  ws.on('error', function error(msg) {
    debug(`Socket connection error: ${msg}`);
    UserRegistry.removeListener(UserRegistry.EVENT_LIST_CHANGE, onListChange);
  });

  ws.on('close', function close() {
    debug(`Closing connection with ${user.name}`);
    delete user.ws;
    UserRegistry.removeListener(UserRegistry.EVENT_LIST_CHANGE, onListChange);
  });

}


module.exports.onConnect = onConnect;