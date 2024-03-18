## Models
1. where all the mongodb models will be at

Users
	Email: user's email
	password: user's password
	username: user's username


Rooms
	name: name of room
	created_by: id of user who created room
	created_at: timestamp of the time the room was created

Chats
	owner_id: user's id
	guest_id: id of room or other user being chat with

Chats_messages
	message_content: content of the message
	sender_id: id of user who sent the message
	chat_id: id of the created chat
	created_at: timestamp of the time the message was sent
