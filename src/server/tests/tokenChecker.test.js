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
  let token;

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
        token = res.body.token;
        expect(res).status(200);
        done();
      });
  });

  it("send correct login token", (done) => {
    chai
      .request(server)
      .get(`/verify_token?token=${token}`)
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });

  it("send wrong login token", (done) => {
    chai
      .request(server)
      .get(`/verify_token?token=${token + "random string"}`)
      .end((err, res) => {
        expect(res).status(403);
        expect(res.body).to.be.a("object");
        done();
      });
  });
});
