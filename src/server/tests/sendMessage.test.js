const dbClient = require("../utils/db");

// SocketJS
const { createServer } = require("node:http");
const { io } = require("socket.io-client");
const ioc = io;
const { Server } = require("socket.io");
const { assert, expect } = require("chai");

// SocketIO docs for testing https://socket.io/docs/v4/testing/
describe("sendMessage", () => {
  let io, serverSocket, clientSocket;
  let socketPass = false;
  let dbPass = false;

  const msg = {
    userId: "6605ad3db73ba5a4fc5d2781",
    message: "Check me out man!",
    chatId: "660646c057be8b0ee343ce92",
    createdAt: "1711658798522.0",
  };

  require("dotenv").config();
  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("send message via socket event (client -> server)", async () => {
    serverSocket.on("message:send", (cb) => {
      cb(msg);
    });
    let result = await clientSocket.emitWithAck("message:send");
    expect(result).to.deep.equal(msg);
  });

  it("send message via socket event (server -> client)", (done) => {
    //NOTE: Just passing hard coded values for the socket.
    clientSocket.on(`${msg.chatId}:message:sent`, (arg) => {
      expect(arg).to.deep.equal(msg);
      done();
    });
    serverSocket.emit(`${msg.chatId}:message:sent`, msg);
  });

  it("should send message after click", async () => {
    //NOTE: The userId & chatId are from a local instance of mongodb.
    // Do change them when testing on your own instance.
    //NOTE: Might be better to use an in-memory db for testing.
    //NOTE: Function `this.storeMessage` is not public so hard to test...
    if (socketPass) {
      const msgs = await dbClient.getCollection("chatDB", "messages");
      const doc = {
        senderId: msg.userId,
        content: msg.message,
        chatId: msg.chatId,
        createdAt: msg.createdAt,
      };
      let result = await msgs.insertOne(doc);
      expect(result).to.include({ acknowledged: true });
      dbPass = true;
      return;
    }
  });
});
