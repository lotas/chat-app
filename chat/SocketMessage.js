
class SocketMessage {
  /**
   * @param {mixed} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = this.constructor.name;
  }

  toString() {
    return JSON.stringify({
      type: this.type,
      payload: this.payload
    });
  }
}

class Registered extends SocketMessage {
  constructor(name) {
    super({name: name});
  }
}

class ChatMessage extends SocketMessage {
  /**
   * @param {User} from
   * @param {ChatMessage} message
   */
  constructor(message) {
    super({
      msg: message
    });
  }
}

class RecipientOffline extends SocketMessage {
  constructor(name) {
    super({
      recipient: name,
    });
  }
}

class MessageDelivered extends SocketMessage {
  constructor(from, to, messageId) {
    super({
      from: from,
      to: to,
      messageId: messageId
    });
  }
}

class UserListChange extends SocketMessage {
  /**
   * @param {Array} listOfUsers
   */
  constructor(listOfUsers) {
    super({
      users: listOfUsers
    });
  }
}


module.exports.SocketMessage = SocketMessage;
module.exports.Registered = Registered;
module.exports.ChatMessage = ChatMessage;
module.exports.UserListChange = UserListChange;
module.exports.RecipientOffline = RecipientOffline;
module.exports.MessageDelivered = MessageDelivered;
