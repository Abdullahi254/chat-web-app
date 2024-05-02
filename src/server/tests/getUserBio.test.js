const sinon = require('sinon');
const { getUserBio } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const socketController = require('../controllers/socketController');
const { expect } = require('chai');

describe("getUserBio", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should return user bio if user and friend exist and are friends", async () => {
        const userId = "563237a41a4d68582c2509da";
        const friendId = "56fc40f9d735c28df206d078";
        const user = { _id: friendId, username: "friendUsername", email: "friend@example.com" };
        const userChatGroups = [
            { _id: "51e0373c6f35bd826f47e9a0", name: "Group 1" },
            { _id: "51e0373c6f35bd826f47e9a1", name: "Group 2" }
        ];
        const isFriend = true;
        sinon.stub(socketController, "isFriend").withArgs(userId, friendId).resolves(isFriend);

        const usersCollection = {
            findOne: sinon.stub().resolves(user),
        };

        const chatsCollection = {
            find: sinon.stub().returnsThis(),
            toArray: sinon.stub().resolves(userChatGroups),
        };

        sinon.stub(dbClient, "getCollection")
            .withArgs("chatDB", "users").resolves(usersCollection)
            .withArgs("chatDB", "chats").resolves(chatsCollection);

        const req = { params: { userId, friendId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().callsFake(async (bio) => {
                expect(bio).to.deep.equal({
                    username: user.username,
                    email: user.email,
                    groups: userChatGroups,
                    isFriend: await socketController.isFriend(userId, friendId),
                });
            }),
        };

        await getUserBio(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(res.json);
    });

    it("should return 403 if friend does not exist", async () => {
        const userId = "563237a41a4d68582c2509da";
        const friendId = "56fc40f9d735c28df206d078";

        const usersCollection = {
            findOne: sinon.stub().resolves(null),
        };

        sinon.stub(dbClient, "getCollection")
            .withArgs("chatDB", "users").resolves(usersCollection);

        const req = { params: { userId, friendId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await getUserBio(req, res);

        sinon.assert.calledWith(res.status, 403);
        sinon.assert.calledWith(res.json, { Error: "user doesn't exist" });
    });

    it("should return 404 if user is not friends with the friend", async () => {
        const userId = "563237a41a4d68582c2509da";
        const friendId = "56fc40f9d735c28df206d078";
        const user = { _id: "userId456", username: "anotherUser", email: "another@example.com" };

        const usersCollection = {
            findOne: sinon.stub().resolves(user),
        };

        const isFriend = false;

        sinon.stub(dbClient, "getCollection")
            .withArgs("chatDB", "users").resolves(usersCollection);

        sinon.stub(socketController, "isFriend").resolves(isFriend);

        const req = { params: { userId, friendId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await getUserBio(req, res);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, { Error: "User bio not found!" });
    });

    it("should return 400 if either user ID or friend ID is missing", async () => {
        const req = { params: { userId: "563237a41a4d68582c2509da" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await getUserBio(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Missing either user ID or friend ID!" });
    });

    it("should return 400 if both user ID and friend ID are missing", async () => {
        const req = { params: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await getUserBio(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Missing either user ID or friend ID!" });
    });
});