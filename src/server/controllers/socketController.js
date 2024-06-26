const dbClient = require("../utils/db");
const { ObjectId } = require("mongodb");

const SocketController = {
  async createChat(req, res) {
    try {
      const { userId, name, isRoomChat } = req.body;

      if (!userId || !name || !isRoomChat) {
        return res.status(400).json({ Error: "Missing some parameters!" });
      }

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

      return res.status(200).json(createdChat);
    } catch (error) {
      return res.status(500).json({ Error: "Failed to create a chat!" });
    }
  },

  async getUserChats(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ Error: "user id required" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      const userChats = await chats
        .find({ users: { $elemMatch: { $eq: userId } } })
        .toArray();

      return res.status(200).json(userChats);
    } catch (err) {
      return res.status(500).json({ Error: "Failed to get user chats" });
    }
  },

  async getChat(req, res) {
    try {
      const { chatId } = req.params;
      // console.log("ChatId is: ", chatId);
      if (!chatId) {
        return res.status(400).json({ Error: "Missing parameter!" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      const chat = await chats.findOne({
        _id: ObjectId.createFromHexString(chatId),
      });
      // res.send(chat);
      const usersCollection = await dbClient.getCollection("chatDB", "users");

      if (!chat) {
        return res.status(200).json([]);
      }

      const users = [];
      for (let userId of chat.users) {
        // console.log("User id is: ", userId);
        const user = await usersCollection.findOne({
          _id: ObjectId.createFromHexString(userId),
        });
        if (!user) {
          throw new Error("not really expected");
        }
        users.push({
          id: user._id,
          username: user.username,
          email: user.email,
        });
      }

      return res.status(200).json({
        ...chat,
        users,
      });
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ Error: "Failed to retrieve the chat!" });
    }
  },

  async storeChat(chatDocument) {
    try {
      // const { chatDocument } = req.body;
      const chats = await dbClient.getCollection("chatDB", "chats");
      const storedChat = await chats.insertOne(chatDocument);
      return res.status(200).json(storedChat);
    } catch (err) {
      return res.status(500).json({ Error: "Error storing the chat" });
    }
  },

  /**
   * @param {string} sender Message Sender
   * @param {string} recepient Message Receiver
   * @param {string} content Message Content
   * @param {string} chatId Chat Id of conversation
   */
  async storeMessage(senderId, content, chatId, timeStamp) {
    try {
      if (!senderId || !content || !chatId || !timeStamp) {
        return false;
      }
      const messages = await dbClient.getCollection("chatDB", "messages");
      const document = {
        senderId,
        content,
        chatId,
        createdAt: timeStamp,
      };
      const result = await messages.insertOne(document);
      // console.log(`Inserted message with ID: ${result.insertedId}`);
      return true;
    } catch (error) {
      // console.error("Error storing message:", error);
      return false;
    }
  },

  async getChatMessages(req, res) {
    try {
      const { chatId } = req.params;
      if (!chatId) {
        return res.status(400).json({ Error: "chatId required" });
      }
      const messages = await dbClient.getCollection("chatDB", "messages");
      // const actualChatId = ObjectId.createFromHexString(chatId);
      // gets the sorted messages based createdAt attribute
      const chats = await messages
        .find({ chatId: chatId })
        .sort({ createdAt: 1 })
        .toArray();

      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const chatsMessages = chats.map(async (msg) => {
        const user = await usersCollection.findOne({
          _id: ObjectId.createFromHexString(msg.senderId),
        });
        return { ...msg, username: user.username };
      });

      const results = await Promise.all(chatsMessages);

      return res.status(200).json(results);
    } catch (err) {
      return res
        .status(500)
        .json({ Error: "Error retrieving the chat messages" });
    }
  },

  async deleteGroup(req, res) {
    try {
      const { chatId, userId } = req.body;
      if (!chatId || !userId) {
        return res.status(400).json({ Error: "Missing parameter!" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      // find the particular chatgroup in database
      const actualChatId = ObjectId.createFromHexString(chatId);

      const chat = await chats.findOne({ _id: actualChatId });
      if (!chat) {
        return res.status(404).json({ Error: "Not found" });
      }
      // check if the user is the owner of or one created the group
      if (!chat.createdBy === userId) {
        return res.status(401).json({ Error: "Unauthorized" });
      }
      await chats.deleteOne({ _id: actualChatId, createdBy: userId });
      res.status(200).json({});
    } catch (err) {
      res.status(401).json({ Error: "Unauthorized" });
    }
  },

  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
      if (!userId || !friendId) {
        return res
          .status(400)
          .json({ Error: "Missing either user Id or friend ID" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      // check first if both users might have a chatRoom and return it
      const actualFriendId = ObjectId.createFromHexString(friendId);
      const actualUserId = ObjectId.createFromHexString(userId);
      const existingChat = await chats.findOne({
        users: { $all: [friendId, userId] },
        isRoomChat: false,
      });
      if (existingChat) {
        // console.log("User is already a friend!", existingChat.users);
        return res.status(401).json({ Error: "User Already Exists!" });
      }
      // gets the friend username
      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const friend = await usersCollection.findOne({ _id: actualFriendId });
      const user = await usersCollection.findOne({ _id: actualUserId });

      if (!friend) {
        return res.status(403).json({ Error: "This user doesn't exist yet!" });
      }

      const chat = {
        isRoomChat: false,
        users: [userId, friendId],
        info: [
          {
            id: user._id.toString(),
            name: user.username,
          },
          {
            id: friend._id.toString(),
            name: friend.username,
          },
        ],
        createdBy: userId,
        createdAt: new Date(),
        //           latestMessage: ""
      };
      // creates the chat for them
      const newChat = await chats.insertOne(chat);
      if (!newChat.insertedId) {
        return res.status(400).json({ Error: "Cannot add user" });
      }
      // const createdChat = await chats.findOne({ _id: newChat.insertedId });
      return res.status(201).json({ message: "User Added as Friend!" });
    } catch (err) {
      // console.log(err)
      return res.status(400).json({ Error: "Cannot add user" });
    }
  },

  async addUserToRoom(req, res) {
    try {
      const { userId, chatId } = req.body;
      if (!userId || !chatId) {
        return res
          .status(400)
          .json({ Error: "Missing either user ID or chat ID!" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");
      // check first if the user is already a member of group
      const actualChatId = ObjectId.createFromHexString(chatId);
      const existingChat = await chats.findOne({
        users: { $elemMatch: { $eq: userId } },
        isRoomChat: true,
        _id: actualChatId,
      });
      if (existingChat) {
        return res
          .status(403)
          .json({ Error: "User already a member of the group" });
      }

      await chats.updateMany(
        { _id: actualChatId },
        { $addToSet: { users: userId } },
      );
      return res.status(200).json({});
    } catch (err) {
      // console.log(err);
      return res.status(403).json({ Error: "Unable to add user to group" });
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

  // NOTE: missing isgroup parameter and bio(i.e Can't Talk What's up?),
  async getUserBio(req, res) {
    try {
      const { userId, friendId } = req.params;
      if (!userId || !friendId) {
        return res
          .status(400)
          .json({ Error: "Missing either user ID or friend ID!" });
      }
      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const user = await usersCollection.findOne({
        _id: ObjectId.createFromHexString(friendId),
      });

      if (!user) {
        return res.status(403).json({ Error: "user doesn't exist" });
      }
      const chats = await dbClient.getCollection("chatDB", "chats");

      // gets all groups chats the user is member of
      const userChatGroups = await chats
        .find({ users: { $elemMatch: { $eq: friendId } }, createdBy: friendId })
        .toArray();
      // check for friendship
      const isFriend = await SocketController.isFriend(userId, friendId);
      const bio = {
        username: user.username,
        email: user.email,
        groups: userChatGroups,
        isFriend: isFriend, // if it is true, the button should disappear in frontend
      };
      return res.status(200).json(bio);
    } catch (err) {
      // console.log(err);
      return res.status(404).json({ Error: "User bio not found!" });
    }
  },

  async searchChat(req, res) {
    try {
      const { name, userId } = req.params;
      if (!userId) {
        return res.status(400).json({ Error: "Missing a parameter" });
      }

      const chatsCollection = await dbClient.getCollection("chatDB", "chats");
      const chats = await chatsCollection
        .find({ name: { $regex: `${name}`, $options: "i" } })
        .toArray();

      const chatNames = await Promise.all(
        chats.map(async (chat) => {
          const checkFriendShip = await Promise.all(
            chat.users.map(async (id) => {
              const isFriend = await SocketController.isFriend(userId, id);
              return isFriend;
            }),
          );

          return {
            name: chat.name,
            _id: chat._id,
            isRoomChat: chat.isRoomChat,
            isFriend: checkFriendShip.includes(true),
          };
        }),
      );

      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const users = await usersCollection
        .find({ username: { $regex: `${name}`, $options: "i" } })
        .toArray();
      const userNames = await Promise.all(
        users.map(async (user) => {
          const stringId = user._id.toString();

          let isfriend = await SocketController.isFriend(userId, stringId);
          return {
            name: user.username,
            _id: user._id,
            isRoomChat: false,
            isFriend: isfriend,
          };
        }),
      );

      const results = [...chatNames, ...userNames];
      return res.status(200).json(results);
    } catch (err) {
      // console.error("Error searching:", err);
      return res.status(500).json({ Error: "Internal server error" });
    }
  },

  async fetchUserName(userId) {
    try {
      if (!userId) {
        return null;
      }
      const usersCollection = await dbClient.getCollection("chatDB", "users");
      const user = await usersCollection.findOne({
        _id: ObjectId.createFromHexString(userId),
      });
      return user.username;
    } catch (e) {
      // console.log(e);
      return null;
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
    if (result) {
      //NOTE: Send message to other client on the socket.
      conn.broadcast.emit(`${msg.chatId}:message:sent`, {
        message: msg.message,
        status: msg.status,
        userName: user.username,
        chatId: msg.chatId,
        timeStamp: msg.timeStamp,
      });
      //NOTE: Send message to this client
      conn.emit(`${msg.chatId}:message:sent`, {
        message: msg.message,
        status: msg.status,
        userName: "",
        chatId: msg.chatId,
        timeStamp: msg.timeStamp,
      });
    } else {
      console.log("Failed to send message");
    }
  },
  async deleteMessage(req, res) {
    try {
      const { msgId } = req.body;
      if (!msgId) {
        return res.status(400).json({ Error: "Bad request!" });
      }
      const actualMsgId = ObjectId.createFromHexString(msgId);
      const messages = await dbClient.getCollection("chatDB", "messages");
      await messages.deleteOne({ _id: actualMsgId });
      return res.status(200).json({ message: "You deleted this message" });
    } catch (err) {
      return res.status(200).json({ Error: "Failed to delete this message" });
    }
  },

  async deleteUserFromGroup(req, res) {
    try {
      const { userId, AdminId, chatId } = req.body;

      // Parameter validation
      if (!userId || !AdminId || !chatId || !ObjectId.isValid(chatId)) {
        return res
          .status(400)
          .json({ Error: "Invalid or missing parameter(s)" });
      }

      const actualChatId = ObjectId.createFromHexString(chatId);
      // const actualAdminId = ObjectId.createFromHexString(AdminId);

      const chatsCollection = await dbClient.getCollection("chatDB", "chats");

      const chat = await chatsCollection.findOne({ _id: actualChatId });
      if (!chat) {
        return res.status(404).json({ Error: "Group not found!" });
      }
      if (chat.createdBy.toString() !== AdminId) {
        return res
          .status(403)
          .json({ Error: "Only Admin allowed to remove user" });
      }

      const updatedGroup = await chatsCollection.findOneAndUpdate(
        { _id: actualChatId },
        { $pull: { users: userId } },
        { upsert: true, returnDocument: "after" },
      );

      // Check if the update was successful
      if (!updatedGroup) {
        return res
          .status(500)
          .json({ Error: "Failed to remove user from group" });
      }

      return res.status(200).json(updatedGroup);
    } catch (err) {
      return res
        .status(500)
        .json({ Error: "Failed to remove user from group" });
    }
  },
};

module.exports = SocketController;
