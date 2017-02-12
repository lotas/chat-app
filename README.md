# Chat App: Backend and Web-Client

![Demo](http://g.recordit.co/Ei4aSxodcQ.gif "Demo interaction")


Pure javascript multi-user chat application.

Users are peristed in processes memory, messages are not.

## Backend:
Node.js + express + websockets handle users and messages.
Messages are not being persisted, and are delivered directly to the socket of the recepient.
If recipient socket is not available, *RecipientOffline* message is being sent back to sender.

List of registered users is being displayed and updated automatically. See [UserRegistry.js](chat/UserRegistry.js)

## Frontend

Frontend is written in Vue.js + bootstrap.

API interaction is being handled by [chat.js](public/chat.js) and uses `fetch`, `WebSocket`.

Application and components are defined in [app.js](public/app.js).

Some of the app state is persisted in `SessionStorage` (registered user info and chat info)


## Authentication

Upon registering new user, API will return `User` object with semi-random `user.authToken` that should be used later for authentication purposes.

Sending messages requires this `authToken` to be provided.

Unregistering user requires `authToken` also.


## Installation

```bash
$ yarn

# or
$ npm i
```

## Running

Start the server: and then open `http://localhost:1337` in browser.

```bash
$ node index.js

# or under custom port
$ PORT=34567 node index.js

# or with debug information visible in console
$ DEBUG=chat* node index.js
```

## Docker

Alternatively can be built using `docker`

```bash
# build container
$ docker build -t lotas/chat-app .

# run container
$ docker run -it -p 12345:1337  lotas/chat-app
npm info it worked if it ends with ok
npm info using npm@3.9.5
npm info using node@v6.2.2
npm info lifecycle chat-app@1.0.0~prestart: chat-app@1.0.0
npm info lifecycle chat-app@1.0.0~start: chat-app@1.0.0

> chat-app@1.0.0 start /opt/app
> node index.js

Server is running at:
http://localhost:1337/

```

Browser should be opened using mapped port `12345`: `http://localhost:12345` (or docker-machine host instead of localhost)

# API

## Chat Message format

[ChatMessage.js](chat/ChatMessage.js)

|field|type|description|
|---|---|---|---|---|
|id|String|Unique id of the message|
|sentAt|Date|Date sent|
|status|Enum|0 - sent|
| | |1 - delivered|
| | |2 - offline|
|from|String|Sender id|
|to|String|Recipient id|
|text|String|Message text|


## Socket Message format

[SocketMessage.js](chat/SocketMessage.js)

|field|type|description|
|---|---|---|---|---|
|type|String|Socket message type:|
|||*Registered* - registration successful|
|||*ChatMessage* - new message|
|||*UserListChange* - users list changed|
|||*RecipientOffline* - user is offline|
|||*MessageDelivered* - acknowledge of the receival|
|payload|Object|message type dependent information|