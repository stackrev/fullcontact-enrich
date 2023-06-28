const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Event listener for receiving POST request data
  socket.on('postData', (data) => {
    console.log('Received POST data:', data);

    // Send data to the client
    io.emit('dataFromServer', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server listening on port 3001');
});
