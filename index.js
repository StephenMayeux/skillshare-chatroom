const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const io = socket.listen(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Express server running on port', PORT);
});
