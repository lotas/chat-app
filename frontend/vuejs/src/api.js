const API = window.location.origin;

/**
 * Send register user request
 *
 * @param {String} name
 * @return {Promise}
 */
export function registerUser(name) {
    return fetch(`${API}/user`, {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'POST',
        body: JSON.stringify({name: name})
    });
}

/**
 * Unregister user
 *
 * @param {String} authToken
 * @return {Promise}
 */
export function unregisterUser(authToken) {
    return fetch(`${API}/user`, {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'DELETE',
        body: JSON.stringify({authToken: authToken})
    });
}

/**
 * Get list of users
 *
 * @return {Promise}
 */
export function fetchUsersList() {
    return fetch(`${API}/users`).then(res => res.json());
}

/**
 * Send message via API
 *
 * @param {String} to
 * @param {String} text
 * @param {String} authToken
 * @return {Promise}
 */
export function sendMessageTo(to, text, authToken) {
    return fetch(`${API}/message`, {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'POST',
        body: JSON.stringify({
            to: to,
            text: text,
            authToken: authToken
        })
    });
}

/**
 * Send register user request
 *
 * @param {String} authToken
 * @param {Function} onMessage will be called with (msg, socket)
 * @return {Promise}
 */
export function connectWs(authToken, onMessage) {
    let ws = new WebSocket(`ws://${window.location.host}?authToken=${authToken}`);
    ws.onopen = () => {
        ws.sendMsg = msg => ws.send(JSON.stringify(msg));
        ws.onmessage = msg => {
            let decoded = JSON.parse(msg.data);
            onMessage(decoded, ws);
        };
    }
}

