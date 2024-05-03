require("dotenv").config();
const sinon = require('sinon');
const { storeMessage } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { expect } = require('chai');

describe("storeMessage", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should return true if message is stored successfully", async () => {
        const senderId = "senderId123";
        const content = "Test message";
        const chatId = "chatId123";
        const timeStamp = new Date();

        const document = {
            senderId,
            content,
            chatId,
            createdAt: timeStamp,
        };

        const messagesCollection = {
            insertOne: sinon.stub().resolves({ "insertedId": "messageId123" }),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "messages").resolves(messagesCollection);

        const result = await storeMessage(senderId, content, chatId, timeStamp);

        sinon.assert.calledWith(messagesCollection.insertOne, document);
        expect(result).to.be.true;
    });

    it("should return false if an error occurs during message storage", async () => {
        const senderId = "senderId123";
        const content = "Test message";
        const chatId = "chatId123";
        const timeStamp = new Date();

        const error = new Error("Failed to insert");
        const messagesCollection = {
            insertOne: sinon.stub().rejects(error),
        };

        sinon.stub(dbClient, "getCollection").withArgs("chatDB", "messages").resolves(messagesCollection);

        const result = await storeMessage(senderId, content, chatId, timeStamp);

        sinon.assert.calledWith(messagesCollection.insertOne, sinon.match.any);
        expect(result).to.be.false;
    });

    it("should return false if senderId is missing", async () => {
        const content = "Test message";
        const chatId = "chatId123";
        const timeStamp = new Date();

        const result = await storeMessage(undefined, content, chatId, timeStamp);

        expect(result).to.be.false;
    });

    it("should return false if content is missing", async () => {
        const senderId = "senderId123";
        const chatId = "chatId123";
        const timeStamp = new Date();

        const result = await storeMessage(senderId, undefined, chatId, timeStamp);

        expect(result).to.be.false;
    });

    it("should return false if chatId is missing", async () => {
        const senderId = "senderId123";
        const content = "Test message";
        const timeStamp = new Date();

        const result = await storeMessage(senderId, content, undefined, timeStamp);

        expect(result).to.be.false;
    });

    it("should return false if timeStamp is missing", async () => {
        const senderId = "senderId123";
        const content = "Test message";
        const chatId = "chatId123";

        const result = await storeMessage(senderId, content, chatId, undefined);

        expect(result).to.be.false;
    });

    it("should return false if senderId and content are missing", async () => {
        const result = await storeMessage(undefined, undefined, "chatId123", new Date());
        expect(result).to.be.false;
    });

    it("should return false if senderId and chatId are missing", async () => {
        const result = await storeMessage(undefined, "Test message", undefined, new Date());
        expect(result).to.be.false;
    });

    it("should return false if senderId and timeStamp are missing", async () => {
        const result = await storeMessage(undefined, "Test message", "chatId123", undefined);
        expect(result).to.be.false;
    });

    it("should return false if content and chatId are missing", async () => {
        const result = await storeMessage("senderId123", undefined, undefined, new Date());
        expect(result).to.be.false;
    });

    it("should return false if content and timeStamp are missing", async () => {
        const result = await storeMessage("senderId123", undefined, "chatId123", undefined);
        expect(result).to.be.false;
    });

    it("should return false if chatId and timeStamp are missing", async () => {
        const result = await storeMessage("senderId123", "Test message", undefined, undefined);
        expect(result).to.be.false;
    });
});