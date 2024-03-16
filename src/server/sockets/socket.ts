import express, { Response, Request } from "express";
import { io } from "socket.io-client";
import http from "http";
import { Server } from "socket.io";
const PORT = 4000;

const app = express();
const server = http.createServer(app);
const socket = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socket.on("connection", async (soc: any) => {
  console.log("Connected");
  soc.on("msg", (msg: any) => {
    console.log(msg);
  });
});

socket.listen(PORT);

export default app;
