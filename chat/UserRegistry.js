const EventEmitter = require('events');
const debug = require('debug')('chat:userRegistry');

const EVENT_USER_ADD = 'userAdd';
const EVENT_USER_REMOVE = 'userRemove';
const EVENT_LIST_CHANGE = 'listChange';

/**
 * Registry of all registered users
 * Is an EventEmitter with following events:
 *
 * 'userAdd' - emitted when new user has joined
 * 'userRemove' - emitted when user was removed
 * 'listChange' - emitted whenever list changes
 */
class UserRegistry extends EventEmitter {
  constructor() {
    super();

    this.usersById = {};
    this.usersByName = {};
    this.usersByToken = {};
  }

  /**
   * @param {User} user
   */
  register(user) {
    this.usersById[user.id] = user;
    this.usersByName[user.name] = user;
    this.usersByToken[user.authToken] = user;

    this.emit(EVENT_USER_ADD, user);
    this.emit(EVENT_LIST_CHANGE);
    debug(`New user registered: ${user.name} #${user.id}`);
  }

  getUsers() {
    return Object.keys(this.usersByName);
  }

  getById(id) {
    return this.usersById[id];
  }

  getByName(name) {
    return this.usersByName[name];
  }

  getByToken(token) {
    return this.usersByToken[token];
  }

  remove(user) {
    delete this.usersById[user.id];
    delete this.usersByName[user.name];
    delete this.usersByToken[user.authToken];

    this.emit(EVENT_USER_REMOVE, user);
    this.emit(EVENT_LIST_CHANGE);
    debug(`Removed user ${user.name} #${user.id}`);
  }
}

let userRegistry = new UserRegistry();

module.exports = userRegistry;
module.exports.EVENT_USER_ADD = EVENT_USER_ADD;
module.exports.EVENT_USER_REMOVE = EVENT_USER_REMOVE;
module.exports.EVENT_LIST_CHANGE = EVENT_LIST_CHANGE;

