const dbClient = require("../utils/db");

// SocketJS
const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert, expect, should } = require("chai");
const server = require("../index");

chai.use(chaiHttp);
// SocketIO docs for testing https://socket.io/docs/v4/testing/
describe("Change username", () => {
  require("dotenv").config();
  let userId;

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

  it("fetch id of existing user", (done) => {
    let users = dbClient.getCollection("chatDB", "users");
    let r;

    let username = dummyUser.email.split("@")[0];
    console.log(username);
    r = users.then((a) =>
      a.findOne({
        email: dummyUser.email,
        username: username,
      }),
    );

    r.then((x) => {
      userId = x._id.toHexString();

      done();
    });
  });

  it("provide userId and new username", (done) => {
    chai
      .request(server)
      .post("/edit_username")
      .set("Content-Type", "application/json")
      .send({ userId: userId, newName: "Big_Boss!" })
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });

  it("provide no userId and new username", (done) => {
    chai
      .request(server)
      .post("/edit_username")
      .set("Content-Type", "application/json")
      .send({ newName: "Big_Boss!" })
      .end((err, res) => {
        console.log(res.body);
        expect(res).status(500);
        expect(res.body).to.be.a("object");
        done();
      });
  });

  it("provide userId and no username", (done) => {
    chai
      .request(server)
      .post("/edit_username")
      .set("Content-Type", "application/json")
      .send({ userId: userId })
      .end((err, res) => {
        expect(res).status(400);
        expect(res.body).to.be.a("object");
        done();
      });
  });
});
