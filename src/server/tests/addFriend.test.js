const sinon = require('sinon');
const { addFriend } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { ObjectId } = require("mongodb");

describe('addFriend', () => {
  let userId, friendId, actualFriendId, actualUserId;

  beforeEach(() => {
    userId = '6604764e239eb2715c038a85';
    friendId = '65f8a8be5556748f07697982';
    actualFriendId = ObjectId.createFromHexString(friendId);
    actualUserId = ObjectId.createFromHexString(userId);
  });
    
  afterEach(() => {
    sinon.restore(); // Restore any mocked functions after each test
  });
    
  it('should return 400 if userId or friendId is missing', async () => {
    const req = { params: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await addFriend(req, res);
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { Error: "Missing either user Id or friend ID" });
  });

  it('should return 401 if friend already exists', async () => {
    const chats = [
      {
        "_id": "66067358dea41976237d3091",
        "isRoomChat": false,
        "users": ["6604764e239eb2715c038a85", "65f8a8be5556748f07697982"],
        "info":[
          {
            "id": "6604764e239eb2715c038a85",
            "name":"vierukundo2009"
          },
          {
            "id": "65f8a8be5556748f07697982",
            "name":"olivier"
          }
        ],
        "createdBy": "6604764e239eb2715c038a85",
        "createdAt": "1711698776323"
      }
    ];

    const req = { params: { userId, friendId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const chatsCollection = {
      findOne: sinon.stub(),
    };

    chatsCollection.findOne.withArgs({ users: { $all: [friendId, userId] }, isRoomChat: false }).resolves(chats[0]);
    sinon.stub(dbClient, 'getCollection').withArgs('chatDB', 'chats').resolves(chatsCollection);

    await addFriend(req, res);

    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, { Error: "User Already Exists!" });
  });

  it('should return 403 if friend does not exist', async () => {
    const req = { params: { userId, friendId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const chatsCollection = {
      findOne: sinon.stub().resolves(null),
    };

    const usersCollection = {
      findOne: sinon.stub().resolves(null),
    };

    sinon.stub(dbClient, 'getCollection').callsFake((dbName, collectionName) => {
      if (dbName === 'chatDB' && collectionName === 'chats') {
        return chatsCollection;
      } else if (dbName === 'chatDB' && collectionName === 'users') {
        return usersCollection;
      } else {
        // Return any default behavior or throw an error if needed
        return dbClient.getCollection(dbName, collectionName);
      }
    });

    await addFriend(req, res);

    sinon.assert.calledWith(res.status, 403);
    sinon.assert.calledWith(res.json, { Error: "This user doesn't exist yet!" });
  });

  it('should create a chat and return 201 if friend is added successfully', async () => {
    const req = { params: { userId, friendId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const friend = {
      "_id": "65f8a8be5556748f07697982",
      "username": "Olivier",
      "email": "vie@gmail.com",
      "password": "Vie@0789++"
    };

    const chatsCollection = {
      findOne: sinon.stub().resolves(null),
      insertOne: sinon.stub().resolves({ insertedId: 'newChatId' }),
    };

    const usersCollection = {
      findOne: sinon.stub().resolves(friend),
    };

    sinon.stub(dbClient, 'getCollection').callsFake((dbName, collectionName) => {
      if (dbName === 'chatDB' && collectionName === 'chats') {
        return chatsCollection;
      } else if (dbName === 'chatDB' && collectionName === 'users') {
        return usersCollection;
      } else {
        // Return any default behavior or throw an error if needed
        return dbClient.getCollection(dbName, collectionName);
      }
    });

    await addFriend(req, res);

    sinon.assert.calledOnce(chatsCollection.insertOne);

    sinon.assert.calledWith(res.status, 201);
    sinon.assert.calledWith(res.json, { message: "User Added as Friend!" });
  });

  it('should return 400 if an error occurs during the process', async () => {
    const userId = 'user123';
    const friendId = 'friend456';

    const req = { params: { userId, friendId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const error = new Error('Database error');

    sinon.stub(dbClient, 'getCollection').rejects(error);

    await addFriend(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { Error: "Cannot add user" });
  });
});