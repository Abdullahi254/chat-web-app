import dotenv from "dotenv"
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import indexRoutes from "./routes/index";
import socketController from "./controllers/socketController";
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

/** Function accepts type Socket */
io.on("connection", (soc) => {
  console.log("Connected");
  //NOTE: Using socket Id as placeholder for user ID
  soc.on("message:send", async (msg) => {
    await socketController.sendMessage(msg, soc);
  });
});
httpServer.listen(PORT, () => console.log("Sever running on port " + PORT));
