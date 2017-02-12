const uniqueId = require('./uniqueId');
const ChatMessageStatus = require('./ChatMessageStatus');

class ChatMessage {
  /**
   * @param {User|String} from
   * @param {User|String} to
   * @param {String} text
   */
  constructor(from, to, text) {
    this.from = from;
    this.to = to;
    this.text = text;

    this.id = uniqueId();
    this.sentAt = new Date();
    this.status = ChatMessageStatus.sent;
  }

  set offline(val) {
    if (val === true) {
      this.status = ChatMessageStatus.offline;
    }
  }
}

module.exports = ChatMessage;
