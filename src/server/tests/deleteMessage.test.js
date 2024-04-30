const dbClient = require("../utils/db");

// SocketJS
const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert, expect, should } = require("chai");
const server = require("../routes/index");

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
  it("should send message after click", async () => {
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
      .send(msgId)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
      });

    done();
  });

  it("post wrong msg id to api", (done) => {
    chai
      .request(server)
      .post("/delete_message")
      .send("")
      .end((err, res) => {
        err.should.have.status(400);
        err.body.should.have.property("Error");
      });

    done();
  });
});
