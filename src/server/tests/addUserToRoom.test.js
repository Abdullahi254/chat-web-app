require("dotenv").config();
const sinon = require('sinon');
const { addUserToRoom } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { expect } = require('chai');

describe("addUserToRoom", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should add user to room if valid user ID and chat ID provided and user is not already a member", async () => {
        const userId = "56310c3c0c5cbb6031cafaea";
        const chatId = "56fc5dcb39ee682bdc609b02";

        const chatsCollection = {
            findOne: sinon.stub().resolves(null),
            updateMany: sinon.stub().resolves({}),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        const req = { body: { userId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returns({}),
        };

        await addUserToRoom(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(res.json);
    });

    it("should return 403 if user is already a member of the group", async () => {
        const userId = "56310c3c0c5cbb6031cafaea";
        const chatId = "56fc5dcb39ee682bdc609b02";

        const existingChat = { _id: "56fc5dcb39ee682bdc609b02", users: [userId], isRoomChat: true };

        const chatsCollection = {
            findOne: sinon.stub().resolves(existingChat),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        const req = { body: { userId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returns({}),
        };

        await addUserToRoom(req, res);

        sinon.assert.calledWith(res.status, 403);
        sinon.assert.calledWith(res.json, { Error: "User already a member of the group" });
    });

    it("should return 400 if either user ID or chat ID is missing", async () => {
        const req = { body: { userId: "56310c3c0c5cbb6031cafaea" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returns({}),
        };

        await addUserToRoom(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Missing either user ID or chat ID!" });
    });

    it("should return 403 if error occurs during database operation", async () => {
        const userId = "56310c3c0c5cbb6031cafaea";
        const chatId = "56fc5dcb39ee682bdc609b02";

        const error = new Error("Database error");

        sinon.stub(dbClient, "getCollection").throws(error);

        const req = { body: { userId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returns({}),
        };

        await addUserToRoom(req, res);

        sinon.assert.calledWith(res.status, 403);
        sinon.assert.calledWith(res.json, { Error: "Unable to add user to group" });
    });
});