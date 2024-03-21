const { Socket } = require("socket.io");
const dbClient = require('../utils/db')


class SocketController {

static
/** Send message to user
 * @param {string} userId User Id from database
 * @param {string} msg to send
 * @param {Socket} conn Socket connection
 */
 async sendMessage(roomId,  msg, conn) {
	//NOTE: Possibly configure user id from database
	console.log(userId);
	console.log(msg);

	try {
		const { message, userId, timeStamp } = msg;
		const chats = {
			owner_id: userId,
			room_id: roomId
		}
	
		const chatsResults = await dbClient.chatCollection.insertOne(chats)
		const chats_messages = {
			message_content: message,
			sender_id: userId,
			chat_id: chatsResults.insertedId,
			created_at: timeStamp
		}


		// const 
		conn.emit("message:recieved", chats_messages);
	} catch(error) {

	}
	
  }
  
}

module.exports = SocketController