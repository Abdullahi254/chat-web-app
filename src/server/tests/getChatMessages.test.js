require("dotenv").config();
const sinon = require('sinon');
const { getChatMessages } = require('../controllers/socketController');
const dbClient = require('../utils/db');
const { ObjectId } = require("mongodb");

describe('getChatMessages', () => {
  
  afterEach(() => {
    sinon.restore(); // Restore any mocked functions after each test
  });

  it('should return chat messages if retrieval is successful', async () => {
    const msg1 = {
      "_id": "6605d72e5ca5c153fc86bdfa",
      "senderId":"65f8a8be5556748f07697982",
      "content":"Hi",
      "chatId":"6605d7cce363ac012ab5948e",
      "createdAt":"1711658798522.0"
    };
    
    const msg2 = {
      "_id":"6605d809e363ac012ab5948f",
      "senderId":"65f8ad9bfc2632255e54f840",
      "content":"hi",
      "chatId":"6605d7cce363ac012ab5948e",
      "createdAt":"1711659017927.0"
    };
    const messages = [msg1, msg2];
    const expectedResults = [
      {...msg1, username: "Olivier"}, {...msg2, username: "Rukundo"}
    ];

    const userId1 = ObjectId.createFromHexString(msg1.senderId);
    const userId2 = ObjectId.createFromHexString(msg2.senderId);

    // Stub for dbClient.getCollection('chatDB', 'messages')
    const messagesCollection = {
      find: sinon.stub().returnsThis(), // stubbing for find() method
      sort: sinon.stub().returnsThis(), // stubbing for sort() method
      toArray: sinon.stub().resolves(messages), // stubbing for toArray() method
    };

    const usersCollection = {
      findOne: sinon.stub(), // stubbing for findOne() method
    };

    usersCollection.findOne.withArgs({_id: userId1}).resolves({username: "Olivier"});
    usersCollection.findOne.withArgs({_id: userId2}).resolves({username: "Rukundo"});

    sinon.stub(dbClient, 'getCollection').callsFake((dbName, collectionName) => {
      if (dbName === 'chatDB' && collectionName === 'messages') {
        return messagesCollection;
      } else if (dbName === 'chatDB' && collectionName === 'users') {
        return usersCollection;
      } else {
        // Return any default behavior or throw an error if needed
        return dbClient.getCollection(dbName, collectionName);
      }
    });

    const req = { params: { chatId: '6605d7cce363ac012ab5948e' }};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await getChatMessages(req, res);

    sinon.assert.calledWith(messagesCollection.find, { chatId: '6605d7cce363ac012ab5948e' });
    sinon.assert.calledWith(messagesCollection.sort, { createdAt: 1 });
    sinon.assert.calledOnce(messagesCollection.toArray);

    sinon.assert.calledTwice(dbClient.getCollection);
    sinon.assert.calledWith(dbClient.getCollection.firstCall, 'chatDB', 'messages');
    sinon.assert.calledWith(dbClient.getCollection.secondCall, 'chatDB', 'users');

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, expectedResults);
  });

  it('should return 500 if retrieval fails', async () => {
    const chatId = '6605d7cce363ac012ab5948e';

    const messagesCollection = {
      find: sinon.stub().returnsThis(), // stubbing for find() method
      sort: sinon.stub().returnsThis(), // stubbing for sort() method
      toArray: sinon.stub().rejects(new Error('Database error')), // Simulating an error during retrieval
    };

    sinon.stub(dbClient, 'getCollection').withArgs('chatDB', 'messages').resolves(messagesCollection);

    const req = { params: { chatId: '6605d7cce363ac012ab5948e' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await getChatMessages(req, res);

    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(res.json, { Error: "Error retrieving the chat messages" });
  });


  it('should return 400 if chatId is not provided', async () => {
    const req = { params: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await getChatMessages(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { Error: 'chatId required' });
  });

  it('should return 500 if user find is not successful', async () => {
    const msg1 = {
      "_id": "6605d72e5ca5c153fc86bdfa",
      "senderId":"65f8a8be5556748f07697982",
      "content":"Hi",
      "chatId":"6605d7cce363ac012ab5948e",
      "createdAt":"1711658798522.0"
    };

    // Stub for dbClient.getCollection('chatDB', 'messages')
    const messagesCollection = {
      find: sinon.stub().returnsThis(), // stubbing for find() method
      sort: sinon.stub().returnsThis(), // stubbing for sort() method
      toArray: sinon.stub().resolves([msg1]), // stubbing for toArray() method
    };

    const usersCollection = {
      findOne: sinon.stub(), // stubbing for findOne() method
    };

    // Simulate user find failure
    usersCollection.findOne.rejects(new Error('User find error'));

    sinon.stub(dbClient, 'getCollection').callsFake((dbName, collectionName) => {
      if (dbName === 'chatDB' && collectionName === 'messages') {
        return messagesCollection;
      } else if (dbName === 'chatDB' && collectionName === 'users') {
        return usersCollection;
      } else {
        // Return any default behavior or throw an error if needed
        return dbClient.getCollection(dbName, collectionName);
      }
    });

    const req = { params: { chatId: '6605d7cce363ac012ab5948e' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await getChatMessages(req, res);

    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(res.json, { Error: "Error retrieving the chat messages" });
  });
});