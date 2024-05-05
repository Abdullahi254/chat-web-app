const dbClient = require("../utils/db");

// SocketJS
const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert, expect, should } = require("chai");
const server = require("../index");

chai.use(chaiHttp);
// SocketIO docs for testing https://socket.io/docs/v4/testing/
describe("loginUser", () => {
  require("dotenv").config();

  let dummyUser = {
    email: "random420@gmail.com",
    password: "Big Banger Racket 249",
  };
  before((done) => {
    let users = dbClient.getCollection("chatDB", "users");
    let searchedUsers = users.then((d) => d.find(dummyUser));
    searchedUsers.then((d) => {
      let found = d.toArray();
      users.then((x) => x.deleteMany(found));
    });
    done();
  });
  //BUG: Does not work
  //function says can not destructure
  it("create new user", (done) => {
    chai
      .request(server)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ email: dummyUser.email, password: dummyUser.password })
      .end((err, res) => {
        expect(res).status(201);
        done();
      });
  });

  it("login with correct credentials", (done) => {
    chai
      .request(server)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: dummyUser.email, password: dummyUser.password })
      .end((err, res) => {
        expect(res).status(200);
        done();
      });
  });

  it("login with wrong details", (done) => {
    chai
      .request(server)
      .post("/login")
      .send({ email: dummyUser.email, password: "Only God knows" })
      .end((err, res) => {
        expect(res).status(400);
        expect(res.body).to.include("Invalid email or password");
        done();
      });
  });

  it("login using non-existing user", (done) => {
    chai
      .request(server)
      .post("/login")
      .send({ email: "applebanana@gmail.com", password: "I like fruits!" })
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).to.include("user not found");
        done();
      });
  });
});
