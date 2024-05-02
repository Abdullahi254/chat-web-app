const sinon = require('sinon');
const { createChat } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { expect } = require('chai');

describe("createChat", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("Should return 400 if parameter is missing", async () => {
        const req = { body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        }

        await createChat(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Missing some parameters!" });
    });

    it("should return 200 if chat is created", async () => {
        const req = {
            body: {
                userId: "56fc40f9d735c28df206d078",
                name: "Alx-cohort 13",
                isRoomChat: true
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const createdAt = new Date();
        const newChat = {
          name: "Alx-cohort 13",
          isRoomChat: true,
          users: ["56fc40f9d735c28df206d078"],
          createdBy: "56fc40f9d735c28df206d078",
          createdAt,
        };

        const chatsCollection = {
            insertOne: sinon.stub().resolves({ "acknowledged" : true, "insertedId" : 10 }),
            findOne: sinon.stub().resolves(newChat),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);
        await createChat(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWithMatch(res.json, sinon.match.object);
        sinon.assert.calledWithMatch(chatsCollection.insertOne, sinon.match.object);
    });

    it("should return 500 if database operation fails", async () => {
        const req = {
            body: {
                userId: "56fc40f9d735c28df206d078",
                name: "Alx-cohort 13",
                isRoomChat: true
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(dbClient, "getCollection").throws(); // Simulate a database error

        await createChat(req, res);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { Error: "Failed to create a chat!" });
    });

    it("should return 500 if insertOne fails", async () => {
        const req = {
            body: {
                userId: "56fc40f9d735c28df206d078",
                name: "Alx-cohort 13",
                isRoomChat: true
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const error = new Error("Failed to insert");
        const chatsCollection = {
            insertOne: sinon.stub().rejects(error),
            findOne: sinon.stub().resolves(),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);
        await createChat(req, res);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { Error: "Failed to create a chat!" });
    });

    it("should return 500 if findOne fails", async () => {
        const req = {
            body: {
                userId: "56fc40f9d735c28df206d078",
                name: "Alx-cohort 13",
                isRoomChat: true
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const error = new Error("Failed to find");
        const chatsCollection = {
            insertOne: sinon.stub().resolves(),
            findOne: sinon.stub().rejects(error),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);
        await createChat(req, res);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { Error: "Failed to create a chat!" });
    });
});