const { isDynamicMetadataRoute } = require('next/dist/build/analysis/get-page-static-info');
const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');


const SocketController = {
	async createChat(req, res) {
		try {
			const {userId, name, isRoomChat} = req.body

			const createdAt = new Date()
			const newChat = {
				name,
				isRoomChat: isRoomChat,
				users: [userId],
				createdBy: userId,
				createdAt
			}
			const chats = await dbClient.getCollection("chatDB", "chats");
			const chat = await chats.insertOne(newChat);

			return res.status(200).send(chat);
		} catch(error) {
            return res.status(500).send("an error occured");
		}
    },

	async getUserChats(req, res) {
        try {
            const { id } = req.params;
			if (!id) {
				return res.status(400).json({'error': 'user id required'});
			}
            const chats = await dbClient.getCollection("chatDB", "chats");
			const userChats = await chats.find({ users: { $elemMatch: { $eq: id } } }).toArray();

            return res.status(200).json(userChats);
        } catch(err) {
			console.log(err)
            return res.status(500).send("an error occured");
        }
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