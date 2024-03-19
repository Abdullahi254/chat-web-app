const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketIO = require("socket.io");
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
 * @param {UserId} userId User Id from database
 * @param {msg} Message to send
 */
function sendMessage(userId, msg) {
  //NOTE: Possibly configure user id from database
  console.log(userId);
  console.log(msg);
  //NOTE: Save the message to database
}

/** Function accepts type Socket */
socket.on("connection", async (soc) => {
  console.log("Connected");
  //NOTE: Using socket Id as placeholder for user ID
  soc.on("user", (msg) => sendMessage(soc.id, msg.msg));
});

socket.listen(PORT);

