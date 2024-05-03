require("dotenv").config();
const sinon = require('sinon');
const { fetchUserName } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { expect } = require('chai');

describe("fetchUserName", () => {
 
    afterEach(() => {
        sinon.restore();
    });

    it("should return username if user exists", (done) => {
        const userId = "65f8a8be5556748f07697982";
        const username = "testUser";

        const usersCollection = {
            findOne: sinon.stub().resolves({ _id: userId, username }),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "users").resolves(usersCollection);

        fetchUserName(userId)
            .then((result) => {
                expect(result).to.equal(username);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("should return null if user does not exist", (done) => {
        const userId = "65f8a8be5556748f07697982";

        const usersCollection = {
            findOne: sinon.stub().resolves(null),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "users").resolves(usersCollection);

        fetchUserName(userId)
            .then((result) => {
                expect(result).to.be.null;
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("should return null if userId is missing or invalid", (done) => {
        const invalidUserId = null;

        fetchUserName(invalidUserId)
            .then((result) => {
                expect(result).to.be.null;
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it("should return null if an error occurs during database operation", (done) => {
        const userId = "65f8a8be5556748f07697982";

        const error = new Error("Database error");
        const usersCollection = {
            findOne: sinon.stub().rejects(error),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "users").resolves(usersCollection);

        fetchUserName(userId)
            .then((result) => {
                expect(result).to.be.null;
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});