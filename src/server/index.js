const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketIO = require("socket.io");
const { Socket } = require("socket.io");
const socket = new socketIO.Server({
  cors: {
    origin: "http://localhost:3000",
  },
});
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
socket.on("connection", async (soc) => {
  console.log("Connected");
  //NOTE: Using socket Id as placeholder for user ID
  soc.on("message:send", (msg) => sendMessage(soc.id, msg.msg, soc));
});

socket.listen(PORT);

