const debug = require('debug')('chat');

const ChatMessage = require('./ChatMessage');
const SocketMessage = require('./SocketMessage');
const User = require('./User');
const UserRegistry = require('./UserRegistry');


/**
 * Register new user
 */
const newUser = (req, res) => {
  if (!req.body.name) {
    return res.status(412).send('Missing user name');
  }

  let user = new User(req.body.name);

  if (UserRegistry.getByName(user.name)) {
    return res.status(409).send('Username already registered');
  }

  UserRegistry.register(user);

  res.json(user);
};

/**
 * Unregister user (leave chat)
 */
const removeUser = (req, res) => {
  UserRegistry.remove(req.user);
  res.sendStatus(200);
}

/**
 * Get list of active connections
 */
const usersList = (req, res) => {
  res.json(UserRegistry.getUsers());
};

/**
 * Send new message to a user
 */
const newMessage = (req, res) => {
  if (!req.body.to) {
    return res.status(412).send('Missing recipient');
  }
  if (!req.body.text) {
    return res.status(412).send('Missing text');
  }

  let sender = req.user;

  let recipient = UserRegistry.getByName(req.body.to);
  if (!recipient) {
    return res.status(404).send(`User ${req.body.to} not registered`);
  }

  let msg = new ChatMessage(
    sender.name,
    recipient.name,
    req.body.text
  );

  if (!recipient.ws) {
    debug(`Socket connection not established. Message will be lost.`);
    msg.offline = true;
  } else {
    recipient.ws.sendMsg(new SocketMessage.ChatMessage(msg));
  }

  res.json(msg);
}

/**
 * Middleware to check authentication
 * Requires presence of the `req.body.authToken` token
 *
 * sets req.user with the authenticated user
 */
const checkAuth = (req, res, next) => {
  if (!req.body.authToken) {
    return res.status(412).send('Missing authToken');
  }

  let user = UserRegistry.getByToken(req.body.authToken);
  if (!user) {
    return res.status(403).send('Auth required');
  }
  req.user = user;

  next();
}

module.exports.checkAuth = checkAuth;
module.exports.newUser = newUser;
module.exports.removeUser = removeUser;
module.exports.usersList = usersList;
module.exports.newMessage = newMessage;