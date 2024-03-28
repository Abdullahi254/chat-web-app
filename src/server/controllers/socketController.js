const dbClient = require("../utils/db");
const { ObjectId } = require("mongodb");

const SocketController = {
  async createChat(req, res) {
    try {
      const { userId, name, isRoomChat } = req.body;

      const createdAt = new Date();
      const newChat = {
        name,
        isRoomChat: isRoomChat,
        users: [userId],
        createdBy: userId,
        createdAt,
      };
      const chats = await dbClient.getCollection("chatDB", "chats");
      const chat = await chats.insertOne(newChat);
      const createdChat = await chats.findOne({ _id: chat.insertedId });

      return res.status(200).send(createdChat);
    } catch (error) {
      return res.status(500).send("Error occured when creating chat!");
    }
  },

  async getUserChats(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "user id required" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      const userChats = await chats
        .find({ users: { $elemMatch: { $eq: userId } } })
        .toArray();

      return res.status(200).json(userChats);
    } catch (err) {
      console.log(err);
      return res.status(500).send("an error occured");
    }
  },

  async getChat(req, res) {
    try {
      const { chatId } = req.params;
      const chats = await dbClient.getCollection("chatDB", "chats");
      const chat = await chats.findOne({
        _id: ObjectId.createFromHexString(chatId),
      });
      return res.status(200).send(chat);
    } catch (err) {
      return res.status(404).send("Chat not found!");
    }
  },

  async storeChat(chatDocument) {
    try {
      // const { chatDocument } = req.body;
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
  async storeMessage(sender, content, chatId, timeStamp) {
    try {
      const messages = await dbClient.getCollection("chatDB", "messages");
      const document = {
        sender,
        content,
        chatId,
        createdAt: timeStamp,
      };
      const result = await messages.insertOne(document);
      console.log(`Inserted message with ID: ${result.insertedId}`);
      return true;
    } catch (error) {
      console.error("Error storing message:", error);
      return false;
    }
  },

  async getChatMessages(req, res) {
    try {
      const { chatId } = req.params;
      const messages = await dbClient.getCollection("chatDB", "messages");
      // const actualChatId = ObjectId.createFromHexString(chatId);
      // gets the sorted messages based createdAt attribute
      const chats = await messages
        .find({ chatId: chatId })
        .sort({ createdAt: 1 })
        .toArray();
      return res.status(200).send(chats);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error retrieving the chat messages");
    }
  },

  async deleteGroup(req, res) {
    try {
      const { chatId, userId } = req.body;
      const chats = await dbClient.getCollection("chatDB", "chats");
      // find the particular chatgroup in database
      const actualChatId = ObjectId.createFromHexString(chatId);

      const chat = await chats.findOne({ _id: actualChatId });
      if (!chat) {
        return res.status(404).json({ Error: "Not found" });
      }
      // check if the user is the owner of or one created the group
      if (!chat.createdBy === userId) {
        return res.status(401).json({ Error: "unauthorized" });
      }
      await chats.deleteOne({ _id: actualChatId, createdBy: userId });
      res.status(200).send("Deteted the group successfully!");
    } catch (err) {
      res.status(401).json({ Error: "Unauthorized" });
    }
  },

  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.body;
      const chats = await dbClient.getCollection("chatDB", "chats");
      // check first if both users might have a chatRoom and return it
      const actualFriendId = ObjectId.createFromHexString(friendId);
      const existingChat = await chats.findOne({
        users: { $all: [friendId, userId] },
        isRoomChat: false,
      });
      if (existingChat) {
        console.log("User is already a friend!", existingChat.users);
        return res.status(200).send(existingChat);
      }
      // gets the friend username
      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const friend = await usersCollection.findOne({ _id: actualFriendId });

      if (!friend) {
        return res.status(403).send("This user doesn't exist yet!");
      }

      const chat = {
        chatName: friend.username,
        isRoomChat: false,
        users: [userId, friendId],
        createdBy: "",
        createdAt: new Date(),
        //           latestMessage: ""
      };
      // creates the chat for them
      const newChat = await chats.insertOne(chat);
      const createdChat = await chats.findOne({ _id: newChat.insertedId });
      return res.status(201).send(createdChat);
    } catch (err) {
      return res.status(400).send("Cannot add user");
    }
  },

  async addUserToRoom(req, res) {
    try {
      const { userId, chatId } = req.body;
      const chats = await dbClient.getCollection("chatDB", "chats");
      // check first if the user is already a member of group
      const actualChatId = ObjectId.createFromHexString(chatId);
      const existingChat = await chats.findOne({
        users: { $elemMatch: { $eq: userId } },
        isRoomChat: true,
        _id: actualChatId,
      });
      if (existingChat) {
        return res.status(403).send("User already a member of the group");
      }

      await chats.updateMany(
        { _id: actualChatId },
        { $addToSet: { users: userId } },
      );
      return res.status(200).send("User successully added to the group");
    } catch (err) {
      console.log(err);
      return res.status(403).send("Unable to add user to group");
    }
  },

  async isFriend(userId, friendId) {
    try {
      // this is when you are trying to add yourself as a friend
      if (userId === friendId) {
        return true;
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      // check first if the user is already a friend
      const existingChat = await chats.findOne({
        users: { $all: [userId, friendId] },
        isRoomChat: false,
      });
      if (existingChat) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },

  async getUserBio(req, res) {
    try {
      const { userId, friendId } = req.params;
      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const user = await usersCollection.findOne({
        _id: ObjectId.createFromHexString(friendId),
      });

            if(!user) {
                return res.status(403).send("user doesn't exist");
            }
            const chats = await dbClient.getCollection("chatDB", "chats");
    
            // gets all groups chats the user is member of
            const userChatGroups = await chats.find({ users: { $elemMatch: { $eq: friendId } }, createdBy: friendId }).toArray();
            // check for friendship
            const isFriend = await SocketController.isFriend(userId, friendId);
            const bio = {
                username: user.username,
                email: user.email,
                groups: userChatGroups,
                isFriend: isFriend // if it is true, the button should disappear in frontend
            }
            return res.status(200).send(bio);
        } catch(err) {
            // console.log(err);
            return res.status(404).json({"Error": "User bio not found!"});
        }
    },
    
	/** Send message to user
	 * @param {string} userId User Id from database
	 * @param {string} msg to send
	 * @param {Socket} conn Socket connection
	 */
	async sendMessage(msg, conn) {
		const { userId, message, chatId, timeStamp } = msg;
		let result = await this.storeMessage( userId, message, chatId, timeStamp);
		const usersCollection = await dbClient.getCollection('chatDB', 'users')
		const user = await usersCollection.findOne({_id: ObjectId.createFromHexString(msg.userId)})
		//NOTE: Only emit once message is saved to database.
		if (result === true) {
		//NOTE: Send message to other client on the socket.
		conn.broadcast.emit(`${msg.chatId}:message:sent`, {
			message: msg.message,
			status: msg.status,
			userName: user.name,
			chatId: msg.chatId,
			timeStamp: msg.timeStamp
		});
		//NOTE: Send message to this client
		conn.emit(`${msg.chatId}:message:sent`, {
			message: msg.message,
			status: msg.status,
			userName: user.name,
			chatId: msg.chatId,
			timeStamp: msg.timeStamp
		})
		} else {
		console.log("Failed to send message");
		}
  },

  /** Send message to user
   * @param {string} userId User Id from database
   * @param {string} msg to send
   * @param {Socket} conn Socket connection
   */
  async sendMessage(msg, conn) {
    const { userId, message, chatId, timeStamp } = msg;
    let result = await this.storeMessage(userId, message, chatId, timeStamp);
    const usersCollection = await dbClient.getCollection("chatDB", "users");
    const user = await usersCollection.findOne({
      _id: ObjectId.createFromHexString(msg.userId),
    });
    //NOTE: Only emit once message is saved to database.
    if (result === true) {
      //NOTE: Send message to other client on the socket.
      conn.broadcast.emit(`${msg.chatId}:message:sent`, {
        message: msg.message,
        status: msg.status,
        userName: user.name,
        chatId: msg.chatId,
        timeStamp: msg.timeStamp,
      });
      //NOTE: Send message to this client
      conn.emit(`${msg.chatId}:message:sent`, {
        message: msg.message,
        status: msg.status,
        userName: user.name,
        chatId: msg.chatId,
        timeStamp: msg.timeStamp,
      });
    } else {
      console.log("Failed to send message");
    }
  },

  /** Send message to user
   * @param {string} userId User Id from database
   * @param {string} msg to send
   * @param {Socket} conn Socket connection
   */
  async sendMessage(msg, conn) {
    const { userId, message, chatId, timeStamp } = msg;
    let result = await this.storeMessage(userId, message, chatId, timeStamp);
    const usersCollection = await dbClient.getCollection("chatDB", "users");
    const user = await usersCollection.findOne({
      _id: ObjectId.createFromHexString(msg.userId),
    });
    //NOTE: Only emit once message is saved to database.
    if (result === true) {
      //NOTE: Send message to other client on the socket.
      conn.broadcast.emit(`${msg.chatId}:message:sent`, {
        message: msg.message,
        status: msg.status,
        userName: user.name,
        chatId: msg.chatId,
        timeStamp: msg.timeStamp,
      });
      //NOTE: Send message to this client
      conn.emit(`${msg.chatId}:message:sent`, {
        message: msg.message,
        status: msg.status,
        userName: user.name,
        chatId: msg.chatId,
        timeStamp: msg.timeStamp,
      });
    } else {
      console.log("Failed to send message");
    }
  },
};

module.exports = SocketController;
