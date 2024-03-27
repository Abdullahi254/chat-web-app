require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server, Socket } = require("socket.io");
const cors = require("cors");
const socketController = require("./controllers/socketController");

const indexRoutes = require("./routes/index");
const app = express();

const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(indexRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;
/** Send message to user
 * @param {string} userId User Id from database
 * @param {string} msg to send
 * @param {Socket} conn Socket connection
 */
async function sendMessage(userId, msg, conn) {
  //NOTE: Possibly configure user id from database

  let result = await socketController.storeMessage(
    msg.sender,
    msg.chatId,
    msg.content,
    msg.chatId,
  );
  //NOTE: Only emit once message is saved to database.
  if (result === "Sent!") {
    //NOTE: Send message to other client on the socket.
    conn.broadcast.emit(`${msg.chatId}:message:sent`, {
      message: msg.content,
      //status: msg.status,
      userName: msg.sender,
      chatId: msg.chatId,
    });
    //NOTE: Send message to this client
    conn.emit(`${msg.chatId}:message:sent`, {
      message: msg.content,
      userName: msg.sender,
      chatId: msg.chatId,
    });
  } else {
    console.log("Failed to send message");
  }
}

/** Function accepts type Socket */
io.on("connection", (soc) => {
  console.log("Connected");
  //NOTE: Using socket Id as placeholder for user ID
  soc.on("message:send", (msg) => {
    sendMessage(soc.id, msg.msg, soc);
  });
});
httpServer.listen(PORT, () => console.log("Sever running on port " + PORT));
