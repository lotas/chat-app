Vue.component('chat-users', {
    props: ['users', 'cnts'],
    template: '#chat-users-template',
    methods: {
        selectUser: function(user) {
            this.$parent.selectUser(user);
        }
    }
});
Vue.component('chat-message', {
    props: ['msg'],
    template: '#chat-message-template',
    computed: {
        date: function() {
            return new Date(this.msg.sentAt).toLocaleString();
        },
        status: function() {
            switch(this.msg.status) {
                case 0: return 'sent';
                case 1: return 'delivered';
                case 2: return 'offline';
                default: return '';
            }
        }
    }
});

Vue.component('debug', {
    props: ['log'],
    template: '#debug-template'
});

const STORAGE_USER = 'auth.user';
const STORAGE_MESSAGE_TO = 'chat.msgto';

var ChatApp = new Vue({
    el: '#chatApp',
    data: {
        user: getFromStorage(STORAGE_USER),
        users: [],
        log: [],
        msgInput: '',
        regUserName: '',
        messageTo: getFromStorage(STORAGE_MESSAGE_TO),
        messages: {},
        counts: {}
    },
    computed: {
        isGuest: function() {
            return !this.user;
        },
        logMessages: function() {
            return this.log.reverse().join("\n");
        },
        usersFiltered: {
            cache: false,
            get() {
                let users = this.user ? this.users.filter(a => a !== this.user.name) : this.users;
                return users.map(user => ({
                    name: user,
                    cnt: this.counts[user] || 0
                }));
            }
        }
    },
    created: function() {
        if (this.user) {
            connectWs(this.user.authToken, onSocketMsg);
        }
    },
    methods: {
        appendMessage: function(to, msg) {
            if (!this.messages[to]) {
                this.messages[to] = [];
            }

            this.messages[to].push(msg);
            this.counts[to] = this.messages[to].length;

            let msgList = this.$refs.msgList;
            if (msgList) {
                setTimeout(() => {
                    msgList.scrollTop = msgList.scrollHeight;
                }, 10);
            }
        },
        updateMessageStatus: function(to, msgId, newStatus) {
            let msgs = this.messages[to]
            if (msgs) {
                let idx = msgs.findIndex(msg => msg.id === msgId);
                if (idx !== -1) {
                    msgs[idx] = Object.assign({}, msgs[idx], {status: newStatus});
                }
            }
        },
        selectUser: function(user) {
            this.messageTo = user;
            setToStorage(STORAGE_MESSAGE_TO, user);
        },
        leaveChat: function() {
            unregisterUser(this.user.authToken)
                .then(res => {
                    if (res.ok) {
                        authUser = null;
                    } else {
                        res.text().then(data => {
                            debug('Unregister not ok: ' + data);
                        })
                    }
                });

            setToStorage(STORAGE_USER, null);
            ChatApp.user = null;
        },
        sendMessage: function() {
            sendMessageTo(this.messageTo, this.msgInput, this.user.authToken)
                .then(res => {
                    if (res.ok) {
                        res.json().then(data => {
                            debug(data);
                            this.appendMessage(data.to, data);
                            this.msgInput = '';
                        });
                    } else {
                        res.text().then(data => {
                            debug('Send message failed:', data);
                        })
                    }
                });
        },
        register: function() {
            registerUser(this.regUserName)
                .then(res => {
                    if (res.ok) {
                        res.json().then(data => {
                            authUser = data;
                            ChatApp.user = authUser;
                            setToStorage(STORAGE_USER, authUser);

                            debug(data);
                            connectWs(authUser.authToken, onSocketMsg);
                            fetchUsersList().then(renderUsers);
                        });
                    } else {
                        res.text().then(data => {
                            debug('Register not ok: ' + data);
                        })
                    }
                });
        }
    }
});

var authUser;
const MESSAGE_STATUS_DELIVERED = 1;

function onSocketMsg(msg, ws) {
    debug(msg);
    switch(msg.type) {
        case 'Registered':
            break;

        case 'ChatMessage':
            let message = msg.payload.msg;
            message.status = MESSAGE_STATUS_DELIVERED;

            ChatApp.appendMessage(message.from, message);

            // Acknowledge recieving message
            ws.sendMsg({
                type: 'MessageAck',
                messageId: message.id,
                from: message.from,
                to: message.to
            });
            break;

        case 'MessageDelivered':
            ChatApp.updateMessageStatus(msg.payload.to, msg.payload.messageId, MESSAGE_STATUS_DELIVERED);
            break;

        case 'UserListChange':
            renderUsers(msg.payload.users);
            break;
    }
}

function renderUsers(users) {
    ChatApp.users = users;
}
fetchUsersList().then(renderUsers);

function debug() {
    let str = [].map.call(arguments, arg => {
        return typeof arg === 'String' ? arg : JSON.stringify(arg)
    }).join(', ');

    ChatApp.log.push(str);
}

function getFromStorage(key) {
    return sessionStorage[key] ? JSON.parse(sessionStorage[key]) : null;
}
function setToStorage(key, value) {
    sessionStorage[key] = JSON.stringify(value);
}