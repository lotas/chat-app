const API = getApiUrl();

function getApiUrl() {
    let baseUrl = `${window.location.origin}`
    if (window.env && window.env.API_URL) {
        baseUrl += window.env.API_URL
    }
    return baseUrl
}

/**
 * @param {Object} options  passed to `fetch()`
 * @return {Promise}
 */
export function makeApiCall(url, options) {
    const returnValue = (data, status) => ({
        data: data,
        status: status
    })

    return window.fetch(url, options).then(res => {
        return new Promise((resolve, reject) => {
            if (res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json().then(data => resolve(returnValue(data, res.status)));
                }
                return res.text().then(data => resolve(returnValue(data, res.status)))
            }
            return res.text().then(data => reject(returnValue(data, res.status)));
        });
    });
}

/**
 * Send register user request
 *
 * @param {String} name
 * @return {Promise}
 */
export function registerUser(name) {
    return makeApiCall(`${API}/user`, {
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
    return makeApiCall(`${API}/user`, {
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
    return makeApiCall(`${API}/users`);
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
    return makeApiCall(`${API}/message`, {
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


export function getStorage() {
    return window && window.sessionStorage
        ? window.sessionStorage
        : {};
}

export function getFromStorage(key, defaultValue = null) {
    const sessionStorage = getStorage();

    return sessionStorage[key]
                ? JSON.parse(sessionStorage[key])
                : defaultValue;
}
export function setToStorage(key, value) {
    const sessionStorage = getStorage();

    sessionStorage[key] = JSON.stringify(value);
}