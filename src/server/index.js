require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server, Socket } = require("socket.io");
const cors = require("cors");

const indexRoutes = require("./routes/index");
const socketController = require("./controllers/socketController");
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

//NOTE: This is middleware I guess?
io.use((socket, next) => {
  const uuid = socket.handshake.auth.uuid;
  if (!uuid) {
    return next(new Error("invalid uuid"));
  }
  socket.uuid = uuid;
  next();
});

/** Function accepts type Socket */
io.on("connection", (soc) => {
  let onlineUsers = [];
  console.log("Connected");
  console.log(soc.uuid);
  onlineUsers.push(soc.handshake.auth);
  soc.broadcast.emit("user:connect", soc.handshake.auth);
  soc.emit("user:connected", onlineUsers);
  //NOTE: Using socket Id as placeholder for user ID
  soc.on("message:send", async (msg) => {
    await socketController.sendMessage(msg, soc);
  });
});

httpServer.listen(PORT, () => console.log("Sever running on port " + PORT));
