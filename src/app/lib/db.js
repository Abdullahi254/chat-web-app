const mongoose = require("mongoose");

const uri = "mongodb+srv://admin:xTErsJzESty9jud5@chatappcluster.bble1lm.mongodb.net/?retryWrites=true&w=majority&appName=chatAppCluster";

global.mongoose = {
  conn: null,
  promise: null,
};

async function dbConnect() {
  try {
    if (global.mongoose && global.mongoose.conn) {
      console.log("Connected from previous");
      return global.mongoose.conn;
    } else {
      const conString = process.env.MONGO_URL;

      const promise = mongoose.connect(conString, {
        autoIndex: true,
      });

      global.mongoose = {
        conn: await promise,
        promise,
      };

      console.log("Newly connected");
      return await promise;
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection failed");
  }
}

const disconnect = () => {
  if (!global.mongoose.conn) {
    return;
  }
  global.mongoose.conn = null;
  mongoose.disconnect();
};

module.exports = { dbConnect,  disconnect};