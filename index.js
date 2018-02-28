const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const redisClient = require('./lib/redis');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const io = socket.listen(server);

redisClient().then(connector => {

  io.on('connection', socket => {
    // Send 10 most recent messages to connecting client
    connector.lrangeAsync('messages', -10, -1).then(messages => {
      socket.emit('initMessages', messages)
    });

    // the sending client has already added their message directly to the DOM.
    // Broadcast this event to everyone except for the sending client.
    socket.on('sendMessage', (message) => {
      connector.rpushAsync('messages', JSON.stringify(message)).then(response => {
        socket.broadcast.emit('newMessage', JSON.stringify(message));
      });
    })
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Express server running on port', PORT);
});
