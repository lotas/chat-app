const uniqueId = require('./uniqueId');

class User {
  /**
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
    this.id = uniqueId();

    // for simplicity it would reference the socket connection
    this.ws = null;

    // for simplicity we'll generate really dumb auth token,
    // that we could use later to authenticate him
    this.authToken = `${uniqueId()}:${uniqueId()}`;
  }
}

module.exports = User;
