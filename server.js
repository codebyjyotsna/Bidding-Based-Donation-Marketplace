const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const setupSocket = require('./socket');
const setupScheduler = require('./scheduler');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(routes);

// Setup MongoDB connection
mongoose.connect('mongodb://localhost:27017/donation-marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Setup HTTP & Socket.IO server
const server = http.createServer(app);
const io = new Server(server);
setupSocket(io);

// Start scheduler
setupScheduler();

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
