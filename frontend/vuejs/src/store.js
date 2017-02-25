import { getFromStorage, setToStorage } from './api'

export const MESSAGE_STATUS_DELIVERED = 1;

const sharedStore = {
  state: {
    user: getFromStorage('auth.user', null),
    users: [],
    messages: {},
    counts: {}
  },
  setUser(user) {
    this.state.user = user
    setToStorage('auth.user', user)
  },
  appendMessage(to, msg) {
    if (!this.state.messages[to]) {
      this.state.messages[to] = [];
    }

    this.state.messages[to].push(msg);
    this.state.counts[to] = this.state.messages[to].length;
  },
  updateMessageStatus(to, msgId, newStatus) {
    let msgs = this.state.messages[to]
    if (msgs) {
      for (let i = msgs.length-1; i >= 0; i--) {
        if (msgs[i].id === msgId) {
          msgs[i] = Object.assign({}, msgs[i], { status: newStatus });
          break;
        }
      }
    }
  },
  dispatchApiMsg(msg, ws) {
    switch (msg.type) {
      case 'Registered':
        break;

      case 'ChatMessage':
        let message = msg.payload.msg;
        message.status = MESSAGE_STATUS_DELIVERED;

        this.appendMessage(message.from, message);

        // Acknowledge recieving message
        ws.sendMsg({
          type: 'MessageAck',
          messageId: message.id,
          from: message.from,
          to: message.to
        });
        break;

      case 'MessageDelivered':
        this.updateMessageStatus(msg.payload.to, msg.payload.messageId, MESSAGE_STATUS_DELIVERED);
        break;

      case 'UserListChange':
        this.state.users = msg.payload.users;
        break;
    }
  }
}

export default sharedStore
