require("dotenv").config();
const { expect } = require('chai');
const sinon = require('sinon');
const { isFriend } = require('../controllers/socketController');
const dbClient = require('../utils/db');

describe('isFriend function', () => {
 
  it('should return true if userId is equal to friendId', async () => {
    const result = await isFriend("user123", "user123");
    expect(result).to.be.true;
  });

  it('should return true if users are already friends', async () => {
    // Simulate existing chat document
    const chat = {
        _id: 1,
        name: "chatName2",
        isRoomChat: false,
        users: ['user123', 'friend456'],
        createdBy: 'user1',
        createdAt: '20.04.2023',
      }
    const chatsCollection = {
      findOne: sinon.stub().resolves(chat)
    };
    // Stub the database client method
    sinon.stub(dbClient, 'getCollection').resolves(chatsCollection);

    const result = await isFriend("user123", "friend456");
    expect(result).to.be.true;

    // Restore the stub
    sinon.restore();
  });

  it('should return false if users are not already friends', async () => {
    // Simulate no existing chat document
    const fakeChats = {
      findOne: sinon.stub().resolves(null)
    };
    sinon.stub(dbClient, 'getCollection').resolves(fakeChats);

    const result = await isFriend("user123", "friend456");
    expect(result).to.be.false;

    sinon.restore();
  });

  it('should return false if there is a database query failure', async () => {
    // Stub the database client method to simulate failure
    sinon.stub(dbClient, 'getCollection').rejects(new Error('Database query failed'));

    const result = await isFriend("user123", "friend456");
    expect(result).to.be.false;

    sinon.restore();
  });

  it('should return false if an unexpected error occurs', async () => {
    // Stub the function to throw an error
    sinon.stub(dbClient, 'getCollection').throws(new Error('Unexpected error'));

    const result = await isFriend("user123", "friend456");
    expect(result).to.be.false;

    sinon.restore();
  });
});