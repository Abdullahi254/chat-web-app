<<<<<<< HEAD
// entry point to the db
=======
// entry point to the db
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:xTErsJzESty9jud5@chatappcluster.bble1lm.mongodb.net/?retryWrites=true&w=majority&appName=chatAppCluster";

class DBClient {
    constructor() {
        const connectionString = process.env.MONGO_URL || uri;
        if (!connectionString) {
            throw new Error('DB_URI environment variable is not defined.');
        }
        this.client = new MongoClient(connectionString, { useUnifiedTopology: true });
    }
    async getCollection(databaseName, collectionName) {
        try {
            await this.client.connect();
            const db = this.client.db(databaseName);
            const collection = db.collection(collectionName);
            return collection;
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
}

const dbClient = new DBClient();

module.exports = dbClient;
>>>>>>> c8ff33b (updated authentication)
