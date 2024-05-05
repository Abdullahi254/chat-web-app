const dbClient = require("../utils/db");

// SocketJS
const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert, expect, should } = require("chai");
const server = require("../index");

chai.use(chaiHttp);
// SocketIO docs for testing https://socket.io/docs/v4/testing/
describe("deleteMessage", () => {
  const msg = {
    userId: "6605ad3db73ba5a4fc5d2781",
    message: "Check me out man!",
    chatId: "660646c057be8b0ee343ce92",
    createdAt: "1711658798522.0",
  };

  require("dotenv").config();
  let msgId;
  it("Insert message into database", async () => {
    //NOTE: The userId & chatId are from a local instance of mongodb.
    // Do change them when testing on your own instance.
    //NOTE: Might be better to use an in-memory db for testing.
    //NOTE: Function `this.storeMessage` is not public so hard to test...
    const msgs = await dbClient.getCollection("chatDB", "messages");
    const doc = {
      senderId: msg.userId,
      content: msg.message,
      chatId: msg.chatId,
      createdAt: msg.createdAt,
    };
    let result = await msgs.insertOne(doc);
    msgId = result.insertedId;
    expect(result).to.include({ acknowledged: true });
  });

  it("post correct msg id to api", (done) => {
    chai
      .request(server)
      .post("/delete_message")
      .send({ msgId: msgId })
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body).to.include({ message: "You deleted this message" });
        done();
      });
  });

  it("post wrong msg id to api", (done) => {
    chai
      .request(server)
      .post("/delete_message")
      .send("")
      .end((err, res) => {
        expect(res).status(400);
        expect(res.body).to.include({ Error: "Bad request!" });
        done();
      });
  });
});
