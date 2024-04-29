const sinon = require('sinon');
const { searchChat } = require('../controllers/socketController');
const dbClient = require('../utils/db');

describe('searchChat', () => {
  afterEach(() => {
    sinon.restore(); // Restore any mocked functions after each test
  });

  it('should return 400 if userId is missing', async () => {
    const req = { params: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await searchChat(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { Error: "Missing a parameter" });
  });

  it('should return 200 with search results', async () => {
    const name = 'chatName';
    const userId = 'user1';

    const req = { params: { name, userId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const userChats = [
      {
        _id: 1,
        name: "chatName1",
        isRoomChat: true,
        users: ['user1', 'user2'],
        createdBy: 'user1',
        createdAt: '20.01.2024',
      },
      {
        _id: 2,
        name: "chatName2",
        isRoomChat: false,
        users: ['user1', 'user2'],
        createdBy: 'user1',
        createdAt: '20.04.2023',
      }
    ];

    const users = [
      {
        "_id": "65f9aeb5d51f8e16b494828d",
        "username": "Test",
        "email": "test@gmail.com",
        "password": "$2b$10$tvuSl5tp99XmacH8BPqU/uYxX2I86pvIjWlR9Gf51.audN33vam3."
      },
      {
        "_id": "65f9b87101ca68409b7d4c23",
        "username": "Test2",
        "email": "test1@gmail.com",
        "password": "$2b$10$uNNG8BGjxruWwZzK/n2w7eY1/LF7FWbydFk.WyLjVetGGO2TrfCWG"
      }
    ];

    const chatResults = userChats.map(chat => ({
      name: chat.name,
      _id: chat._id,
      isRoomChat: chat.isRoomChat,
      isFriend: true, // Assuming user1 is a friend in all userChats
    }));

    const userResults = users.map(user => ({
      name: user.username,
      _id: user._id,
      isRoomChat: false,
      isFriend: false, // Assuming user1 is a friend with all users
    }));

    sinon.stub(dbClient, 'getCollection').callsFake((dbName, collectionName) => {
      if (dbName === 'chatDB' && collectionName === 'chats') {
        return {
          find: sinon.stub().returnsThis(),
          toArray: sinon.stub().resolves(userChats),
        };
      } else if (dbName === 'chatDB' && collectionName === 'users') {
        return {
          find: sinon.stub().returnsThis(),
          toArray: sinon.stub().resolves(users),
        };
      } else {
        // Return any default behavior or throw an error if needed
        return dbClient.getCollection(dbName, collectionName);
      }
    });

    await searchChat(req, res);

    const expectedResults = [...chatResults, ...userResults];

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, expectedResults);
  });

  it('should return 500 if an error occurs during the process', async () => {
    const name = 'example';
    const userId = '6604764e239eb2715c038a85';

    const req = { params: { name, userId } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const error = new Error('Database error');

    sinon.stub(dbClient, 'getCollection').rejects(error);

    await searchChat(req, res);

    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(res.json, { Error: "Internal server error" });
  });
});