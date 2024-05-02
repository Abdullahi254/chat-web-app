const sinon = require('sinon');
const { deleteGroup } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { ObjectId } = require("mongodb");

describe("deleteGroup", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should delete the group if user is authorized and group exists", async () => {
        const req = { body: { chatId: "563237a41a4d68582c2509da", userId: "65f8ad9bfc2632255e54f840" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const chat = {
            _id: "563237a41a4d68582c2509da",
            createdBy: "65f8ad9bfc2632255e54f840",
        };

        const chatsCollection = {
            findOne: sinon.stub().resolves(chat),
            deleteOne: sinon.stub().resolves({ acknowledged: true, deletedCount: 1 }),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        await deleteGroup(req, res);
        const actualChatId = ObjectId.createFromHexString("563237a41a4d68582c2509da");
        const userId = "65f8ad9bfc2632255e54f840";

        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(chatsCollection.deleteOne);
        sinon.assert.calledWith(chatsCollection.deleteOne, { _id: actualChatId, createdBy: userId });
        sinon.assert.calledOnce(res.json);
    });

    it("should return 404 if group does not exist", async () => {
        const req = { body: { chatId: "563237a41a4d68582c2509da", userId: "65f8ad9bfc2632255e54f840" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const chatsCollection = {
            findOne: sinon.stub().resolves(null),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        await deleteGroup(req, res);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, { Error: "Not found" });
    });

    it("should return 401 if user is not authorized", async () => {
        const req = { body: { chatId: "563237a41a4d68582c2509da", userId: "65f8ad9bfc2632255e54f840" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const chat = {
            _id: "563237a41a4d68582c2509da",
            createdBy: "65f8aed788d79b35c8cfff3a",
        };

        const chatsCollection = {
            findOne: sinon.stub().resolves(chat),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        await deleteGroup(req, res);

        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { Error: "Unauthorized" });
    });

    it("should return 400 if chatId or userId is missing", async () => {
        const req = { body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await deleteGroup(req, res);

        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledWith(res.json, { Error: "Missing parameter!" });
    });

    it("should return 401 if an error occurs during database operation", async () => {
        const req = { body: { chatId: "563237a41a4d68582c2509da", userId: "65f8ad9bfc2632255e54f840" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const error = new Error("Database error");
        const chatsCollection = {
            findOne: sinon.stub().rejects(error),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "chats").resolves(chatsCollection);

        await deleteGroup(req, res);

        sinon.assert.calledWith(res.status, 401);
        sinon.assert.calledWith(res.json, { Error: "Unauthorized" });
    });
});