const { isDynamicMetadataRoute } = require('next/dist/build/analysis/get-page-static-info');
const dbClient = require('../utils/db');


const SocketController = {
    async createChat(req, res) {
        const { chatName, isRoomChat, users, latestMessage } = req.body;
        const chats = await dbClient.getCollection("chatDB", "chats");
        const chat = await chats.findOne({ chatName, isRoomChat, users, latestMessage });
        if (chat) {
            res.status(200).send(chat);
        }
        chat = await chats.insertOne({ chatName, isRoomChat, users, latestMessage })
        return res.status(200).send(chat);
    },

    async getChat(req, res) {
        try {
            const { chatId } = req.params;
            const chats = await dbClient.getCollection("chatDB", "chats");
            const chat = await chats.findOne({ chatId });
            return res.status(200).send(chat);
        } catch(err) {
            return res.status(404).send("Chat not found!");
        }

    },

    async storeChat(req, res) {
        try {
            const { chatDocument } = req.body;
            const chats = await dbClient.getCollection("chatDB", "chats");
            await chats.insertOne(chatDocument);
            return res.status(200).send("Stored the chat successully");
        } catch(err) {
            return res.status(500).send("Error storing the chat");
        }

    },

    async storeMessage(req, res) {
        try {
            const messages = await dbClient.getCollection("chatDB", "messages");
            const { sender, recepient, content, chatId } = req.body;
            const document = {
                sender,
                recepient,
                content,
                chatId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const result = await messages.insertOne(document);
            console.log(`Inserted message with ID: ${result.insertedId}`);
            res.status(200).send("Message stored successfully.");
        } catch (error) {
            console.error("Error storing message:", error);
            res.status(500).send("Error storing message.");
        }
    },

    async getChatMessages(req, res) {
        try {
            const { chatId } = req.params;
            const messages = await dbClient.getCollection("chatDB", "messages");
            const chats = messages.find({ chatId });
            return res.status(200).send(chats);
        } catch(err) {
            return res.status(500).send("Error retrieving the chat messages");
        }
    
    }
    
} 


module.exports = SocketController;