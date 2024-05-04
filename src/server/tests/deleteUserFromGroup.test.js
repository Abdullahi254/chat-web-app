require("dotenv").config();
const sinon = require('sinon');
const { deleteUserFromGroup } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { expect } = require('chai');

describe("deleteUserFromGroup", () => {
    
    afterEach(() => {
        sinon.restore();
    });

    it("should delete user from group if valid parameters provided and user is authorized", async () => {
        const userId = "563237a41a4d68582c2509da";
        const adminId = "5063114bd386d8fadbd6b004";
        const chatId = "51e0373c6f35bd826f47e9a0";
        const createdBy = adminId;

        const chat = { _id: chatId, createdBy, users: [userId] };

        const chatsCollection = {
            findOne: sinon.stub().resolves(chat),
            findOneAndUpdate: sinon.stub().resolves(chat),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        const req = { body: { userId, AdminId: adminId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returns({}),
        };

        await deleteUserFromGroup(req, res);

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(res.json);
    });

    it("should return 400 if missing parameters", async () => {
        const req = { body: { userId: "563237a41a4d68582c2509da", AdminId: "5063114bd386d8fadbd6b004" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteUserFromGroup(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Invalid or missing parameter(s)" });
    });

    it("should return 400 if chatId is not a valid ObjectId", async () => {
        const userId = "563237a41a4d68582c2509da";
        const adminId = "5063114bd386d8fadbd6b004";
        const chatId = "chatId123";
    
        const req = { body: { userId, AdminId: adminId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    
        await deleteUserFromGroup(req, res);
    
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Invalid or missing parameter(s)" });
    });    

    it("should return 404 if group not found", async () => {
        const userId = "563237a41a4d68582c2509da";
        const adminId = "5063114bd386d8fadbd6b004";
        const chatId = "51e0373c6f35bd826f47e9a0";

        const chatsCollection = {
            findOne: sinon.stub().resolves(null),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        const req = { body: { userId, AdminId: adminId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteUserFromGroup(req, res);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, { Error: "Group not found!" });
    });

    it("should return 403 if user is not the admin of the group", async () => {
        const userId = "563237a41a4d68582c2509da";
        const adminId = "5063114bd386d8fadbd6b004";
        const chatId = "51e0373c6f35bd826f47e9a0";
        const createdBy = "51e0373c6f35bd826f47e9a1";

        const chat = { _id: chatId, createdBy, users: [userId] };

        const chatsCollection = {
            findOne: sinon.stub().resolves(chat),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        const req = { body: { userId, AdminId: adminId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteUserFromGroup(req, res);

        sinon.assert.calledWith(res.status, 403);
        sinon.assert.calledWith(res.json, { Error: "Only Admin allowed to remove user" });
    });

    it("should return 500 if error occurs during database operation", async () => {
        const userId = "563237a41a4d68582c2509da";
        const adminId = "5063114bd386d8fadbd6b004";
        const chatId = "51e0373c6f35bd826f47e9a0";

        const error = new Error("Database error");

        sinon.stub(dbClient, "getCollection").throws(error);

        const req = { body: { userId, AdminId: adminId, chatId } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteUserFromGroup(req, res);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, { Error: "Failed to remove user from group" });
    });
});