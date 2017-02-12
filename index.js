/* eslint no-console: "off" */

const express = require('express');
const path = require('path');
const parser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 1337;

const routes = require('./chat/routes');
const socketRoutes = require('./chat/socketRoutes');

const app = express();
app.use(parser.urlencoded({extended: false}))
app.use(parser.json())

app.get('/users', routes.usersList);
app.post('/user', routes.newUser);
app.delete('/user', routes.checkAuth, routes.removeUser);
app.post('/message', routes.checkAuth, routes.newMessage);

app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server with both Express app and Socket server
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
wss.on('connection', socketRoutes.onConnect);

server.listen(PORT, () => {
  console.log(`Server is running at:\nhttp://${HOST}:${PORT}/`);
});

module.exports = app;