require("dotenv").config();
console.log(process.env);
const express = require("express");
const http = require("http");
const { Server, Socket } = require("socket.io");
const cors = require("cors");

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

app.get((req, res) => {
  console.log(res);
  console.log(req);
});

const PORT = process.env.PORT || 4000;
/** Send message to user
 * @param {string} userId User Id from database
 * @param {string} msg to send
 * @param {Socket} conn Socket connection
 */
function sendMessage(userId, msg, conn) {
  //NOTE: Possibly configure user id from database
  //NOTE: Save the message to database
  //conn.broadcast.to(userRoom).emit('message:sent', {msg: message})
  conn.broadcast.emit("message:sent", {
    message: msg.message,
    status: msg.status,
    timeStamp: msg.timeStamp,
    userName: msg.userName,
  });
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
