require('dotenv').config()
const express = require("express");
const http = require("http")
const { Server } = require("socket.io");
const { Socket } = require("socket.io");
const cors = require('cors');

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


/** Send message to user
 * @param {string} userId User Id from database
 * @param {string} msg to send
 * @param {Socket} conn Socket connection
 */
function sendMessage(userId, msg, conn) {
  //NOTE: Possibly configure user id from database
  console.log(userId);
  console.log(msg);
  const message = {
    from: "cyber monday",
    to: "random",
    //BUG: Message isnt passing through
    messageContent: msg,
  };
  //NOTE: Save the message to database
  //conn.broadcast.to(userRoom).emit('message:sent', {msg: message})
  conn.emit("message:sent", { msg: message });
}

/** Function accepts type Socket */
io.on("connection", async (soc) => {
  console.log("Connected");
  //NOTE: Using socket Id as placeholder for user ID
  soc.on("message:send", (msg) => sendMessage(soc.id, msg.msg, soc));
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log('Sever running on port ' + PORT));
