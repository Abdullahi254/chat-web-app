require('dotenv').config()
const express = require("express");
const http = require("http")
const { Server } = require("socket.io");
const cors = require('cors');

const SocketController = require('./controllers/socketController')
const indexRoutes = require('./routes/index')

const app = express();

const httpServer = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(indexRoutes)


const io = new Server(httpServer, { cors: {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
},})


/** Function accepts type Socket */
io.on("connection", async (socket) => {
  console.log("Connected");
  const authHeader = socket.handshake.headers.authorization;

  console.log('------->', authHeader)

  socket.on("message:sent", (msg) => SocketController.sendMessage(soc.id, msg, socket));
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log('Sever running on port ' + PORT));
