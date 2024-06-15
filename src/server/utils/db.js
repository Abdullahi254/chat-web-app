// entry point to the db
const { MongoClient } = require("mongodb");


class DBClient {
  constructor(connectionString) {
    if (!connectionString) {
      throw new Error(
        "REACT_APP_MONGO_URL environment variable is not defined.",
      );
    }
    this.client = new MongoClient(connectionString);
  }
  async getCollection(databaseName, collectionName) {
    try {
      await this.client.connect();
      const db = this.client.db(databaseName);
      const collection = db.collection(collectionName);
      return collection;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}
const dbClient = new DBClient(process.env.REACT_APP_MONGO_URL);

module.exports = dbClient;
