const sinon = require('sinon');
const { getUserChats } = require('../controllers/socketController');
const dbClient = require('../utils/db');

describe('getUserChats', () => {
    afterEach(() => {
      sinon.restore(); // Reset Sinon's state after each test
    });
  
    it('should return 400 if userId is not provided', async () => {
      const req = { params: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      await getUserChats(req, res);
  
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.json, { Error: 'user id required' });
    });
  
    it('should return 500 if dbClient.getCollection fails', async () => {
      const req = { params: { userId: 'someUserId' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      sinon.stub(dbClient, 'getCollection').rejects(new Error('DB connection error'));
  
      await getUserChats(req, res);
  
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { Error: 'Failed to get user chats' });
    });
  
    it('should return user chats if userId is provided', async () => {
      const userId = 1;
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
        _id: 1,
        name: "chatName2",
        isRoomChat: false,
        users: ['user1', 'user2'],
        createdBy: 'user1',
        createdAt: '20.04.2023',
      }];

      const req = { params: { userId } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      const collectionStub = {
        find: sinon.stub().returns({
          toArray: sinon.stub().resolves(userChats),
        }),
      };
  
      sinon.stub(dbClient, 'getCollection').resolves(collectionStub);
  
      await getUserChats(req, res);
  
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, userChats);
    });
  });