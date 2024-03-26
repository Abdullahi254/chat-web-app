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

  async getChat(req, res) {
    try {
      const { chatId } = req.params;
      const chats = await dbClient.getCollection("chatDB", "chats");
      const chat = await chats.findOne({ chatId });
      return res.status(200).send(chat);
    } catch (err) {
      return res.status(404).send("Chat not found!");
    }
  },

  async storeChat(req, res) {
    try {
      const { chatDocument } = req.body;
      const chats = await dbClient.getCollection("chatDB", "chats");
      await chats.insertOne(chatDocument);
      return res.status(200).send("Stored the chat successully");
    } catch (err) {
      return res.status(500).send("Error storing the chat");
    }
  },

  /**
   * @param {string} sender Message Sender
   * @param {string} recepient Message Receiver
   * @param {string} content Message Content
   * @param {string} chatId Chat Id of conversation
   */
  async storeMessage(sender, recepient, content, chatId) {
    try {
      const messages = await dbClient.getCollection("chatDB", "messages");
      const document = {
        sender,
        recepient,
        content,
        chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await messages.insertOne(document);
      console.log(`Inserted message with ID: ${result.insertedId}`);
      return "Sent!";
    } catch (error) {
      console.error("Error storing message:", error);
      return err;
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
    },

    async deleteGroup(req, res) {
        try {
            const { chatId, ownerId } = req.body;
            const chats = await dbClient.getCollection("chatDB", "chats");
            // find the particular chatgroup in database
            const actualChatId = ObjectId.createFromHexString(chatId)
            const actualOwnerId = ObjectId.createFromHexString(ownerId);
            const chat = await chats.findOne({ chatId: actualChatId });
            if (!chat) {
                return res.status(404).json({"Error": "Not found"});
            }
            // check if the user is the owner of or one created the group
            if (!chat.ownerId === actualOwnerId) {
                return res.status(401).json({"Error": "unauthorized"});
            }
            chats.deleteOne({ chatId: actualChatId, ownerId: actualOwnerId });
        } catch(err) {
            res.status(401).json({"Error": "Unauthorized"});
        }
    },

    async addFriend(req, res) {
        try {
            const {userId, friendId } = req.body;
            const chats = await dbClient.getCollection("chatDB", "chats");
            // check first if both users might have a chatRoom and return it
            const actualFriendId = ObjectId.createFromHexString(friendId);
            const existingChat = await chats.findOne({users: {$in: [friendId, userId]}, isRoomChat: false});
            if (existingChat) {
                return res.status(200).send(existingChat);
            }
            // gets the friend username
            const usersCollection = await dbClient.getCollection('chatDB', 'users')
            const friend = await usersCollection.findOne({_id: actualFriendId});

            const chat = {
                chatName: friend.username,
                isRoomChat: false,
                users: [userId, friendId],
                createdBy: "",
                createdAt: new Date()
     //           latestMessage: ""
            }
            // creates the chat for them
            const newChat = chats.insertOne(chat);
            return res.status(201).send(newChat);
        } catch(err) {
            return res.status(400).send("Cannot add user");
        }

    },

    async addUserToRoom(req, res) {
        try {
            const { userId, chatId } = req.body;
            const chats = await dbClient.getCollection("chatDB", "chats");
            // check first if the user is already a member of group
            const actualChatId = ObjectId.createFromHexString(chatId);
            const existingChat = await chats.findOne({users: {$in: [userId]}, isRoomChat: true, _id: actualChatId});
            if (existingChat) {
                return res.status(403).send("User already a member of the group");
            }
            
            await chats.updateMany({_id: actualChatId}, {$addToSet: {users: userId}});
            return res.status(200).send("User successully added to the group");
        } catch(err) {
            return res.status(403).send("Unable to add user to group");
        }
    },

    async isFriend(userId, friendId) {
        try {
            // this is when you are trying to add yourself as a friend
            if (userId === friendId) {
                return true
            }
            const chats = await dbClient.getCollection("chatDB", "chats");
            // check first if the user is already a friend
            const existingChat = await chats.findOne({users: {$in: [userId, friendId]}, isRoomChat: false});
            if (existingChat) {
                return true
            } else {
                return false
            }
        } catch(err) {
            return false
        }
    },
    async getUserBio(req, res) {
        try {
            const { userId, friendId } = req.body;
            const usersCollection = await dbClient.getCollection('chatDB', 'users')
            const user = await usersCollection.findOne({_id: ObjectId.createFromHexString(userId)});
            const chats = await dbClient.getCollection("chatDB", "chats");
    
            // gets all groups chats the user is member of
            const chatGroups = chats.find({users: {$in: ObjectId.createFromHexString(userId)}, isRoomChat: true});
            // check for friendship
            const isFriend = await this.isFriend(userId, friendId);
            const bio = {
                username: user.username,
                email: user.email,
                groups: chatGroups,
                isFriend: isFriend // if it is true, the button should disappear in frontend
            }
            return res.status(200).send(bio);
        } catch(err) {
            return res.status(404).json({"Error": "User bio not found!"});
        }
    }
};

module.exports = SocketController;

