const API = window.location.origin;

function registerUser(name) {
    return fetch(`${API}/user`, {
        headers: new Headers({
		    'Content-Type': 'application/json'
	    }),
        method: 'POST',
        body: JSON.stringify({name: name})
    });
}

function unregisterUser(authToken) {
    return fetch(`${API}/user`, {
        headers: new Headers({
		    'Content-Type': 'application/json'
	    }),
        method: 'DELETE',
        body: JSON.stringify({authToken: authToken})
    });
}

function fetchUsersList() {
    return fetch(`${API}/users`).then(res => res.json());
}

function sendMessageTo(to, text, authToken) {
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

function connectWs(authToken, onMessage) {
    var ws = new WebSocket(`ws://${window.location.host}?authToken=${authToken}`);
    ws.onopen = ev => {
        ws.sendMsg = msg => ws.send(JSON.stringify(msg));
        ws.onmessage = msg => {
            try {
                let decoded = JSON.parse(msg.data);
                onMessage(decoded, ws);
            } catch (e) {
                console.error(e);
            }
        };
    }
}