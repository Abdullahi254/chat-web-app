const dbClient = require("../utils/db");

// SocketJS
const chai = require("chai");
const chaiHttp = require("chai-http");
const { assert, expect, should } = require("chai");
const server = require("../index");

chai.use(chaiHttp);
// SocketIO docs for testing https://socket.io/docs/v4/testing/
describe("registerUser", () => {
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
  it("post correct credentials to api", (done) => {
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

  it("post wrong credentials to api", (done) => {
    chai
      .request(server)
      .post("/register")
      .send("")
      .end((err, res) => {
        expect(res).status(400);
        expect(res.body).to.include("All fields are required!");
        done();
      });
  });

  it("post already saved credentials to api", (done) => {
    chai
      .request(server)
      .post("/register")
      .send({ email: dummyUser.email, password: dummyUser.password })
      .end((err, res) => {
        expect(res).status(400);
        expect(res.body).to.include("User already exists!");
        done();
      });
  });
});
