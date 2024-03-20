// entry to server
require("dotenv").config();
const express = require('express');
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors');


const routes = require('./routes');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const server = http.createServer(app)
const io = new Server(server, { cors: {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
},})

const CHAT_BOT = 'ChatBot';
io.on('connection', (socket) => {
  socket.emit('send_message', 'Hi', {username: CHAT_BOT})
  socket.on("recieve_messagge", (data) => {
    console.log(data)
  })

  socket.on('create_room', ({roomname}) => {

    

  })

  socket.on('join_room', ({roomname}) => {
    
  })
})

const PORT = process.env.PORT || 5000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});