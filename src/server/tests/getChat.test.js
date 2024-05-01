const sinon = require('sinon');
const { getChat } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { expect } = require('chai');

describe("getChat", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should return chat data if chat is found", async () => {
        const req = { params: { chatId: "56fc40f9d735c28df206d078" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const chatData = {
            _id: "56fc40f9d735c28df206d078",
            name: "Test Chat",
            users: ["65f8a8be5556748f07697982", "65f8ad9bfc2632255e54f840"],
        };

        const usersData = [
            { _id: "65f8a8be5556748f07697982", username: "user1", email: "user1@example.com" },
            { _id: "65f8ad9bfc2632255e54f840", username: "user2", email: "user2@example.com" },
        ];

        sinon.stub(dbClient, 'getCollection').callsFake((dbName, collectionName) => {
            if (dbName === 'chatDB' && collectionName === 'chats') {
                return {
                    findOne: sinon.stub().resolves(chatData),
                };
            } else if (dbName === 'chatDB' && collectionName === 'users') {
                return {
                    findOne: sinon.stub()
                        .onFirstCall().resolves(usersData[0])
                        .onSecondCall().resolves(usersData[1]),
                };
            } else {
                // Return any default behavior or throw an Error if needed
                return dbClient.getCollection(dbName, collectionName);
            }
        });

        await getChat(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWith(res.json, {
            ...chatData,
            users: [
                { id: "65f8a8be5556748f07697982", username: "user1", email: "user1@example.com" },
                { id: "65f8ad9bfc2632255e54f840", username: "user2", email: "user2@example.com" },
            ],
        });
    });
    
    it("should return 400 if chatId parameter is missing", async () => {
        const req = { params: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await getChat(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Missing parameter!" });
    });

    it("should return 500 if an Error occurs during database operation", async () => {
        const req = { params: { chatId: "56fc40f9d735c28df206d078" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(dbClient, "getCollection").throws();

        await getChat(req, res);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { Error: "Failed to retrieve the chat!" });
    });

    it("should return 500 if users associated with the chat cannot be found", async () => {
        const req = { params: { chatId: "56fc40f9d735c28df206d078" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const chatData = {
            _id: "56fc40f9d735c28df206d078",
            name: "Test Chat",
            users: ["65f8a8be5556748f07697982", "65f8ad9bfc2632255e54f840"],
        };

        const chatsCollection = {
            findOne: sinon.stub().resolves(chatData),
        };

        const usersCollection = {
            findOne: sinon.stub().resolves(null), // Simulate user not found
        };

        sinon.stub(dbClient, "getCollection")
            .withArgs("chatDB", "chats").resolves(chatsCollection)
            .withArgs("chatDB", "users").resolves(usersCollection);

        await getChat(req, res);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { Error: "Failed to retrieve the chat!" });
    });

    it("should return 200 with empty array if chat is not found", async () => {
        const req = { params: { chatId: "56fc40f9d735c28df206d078" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const chatsCollection = {
            findOne: sinon.stub().resolves(null), // Simulate chat not found
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        await getChat(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWith(res.json, []);
    });
});