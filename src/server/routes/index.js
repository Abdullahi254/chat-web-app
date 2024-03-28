const express = require("express");
const {
  registerUser,
  loginUser,
  tokenChecker,
  getUserBio,
} = require("../controllers/UserController");
const { uploadFile, uploads } = require("../controllers/uploadsController");
const { Translate } = require("../controllers/transilator");
const SocketController = require("../controllers/socketController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify_token", tokenChecker, async (req, res) => {
  // check if token is valid
  res.status(200).json({
    userId: req.body.user_id,
  });
});

router.post("/upload", uploads.array("files"), uploadFile);
router.post("/translate", Translate);
router.get("/:userId/chats", SocketController.getUserChats);
router.post("/create_chat", SocketController.createChat);
router.get("/chats/:chatId", SocketController.getChat);
router.get("/get_chat_history/:chatId", SocketController.getChatMessages);
// router.post("/store_chat", SocketController.storeChat);
// router.post("/store_chat_history", SocketController.storeMessage);
router.post("/delete_group", SocketController.deleteGroup);
router.post("/add_user_to_group", SocketController.addUserToRoom);
router.get("/get_user_bio/:userId/:friendId", SocketController.getUserBio);
router.get("/add_friend/:userId/:friendId", SocketController.addFriend);
//NOTE: Commented out since it will be used with sockets directly
//router.post("/store_chat_history", SocketController.storeMessage);
router.get("/search/:name/:userId", SocketController.searchChat);

module.exports = router;
