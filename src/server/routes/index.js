const express = require("express");
const { registerUser, loginUser, tokenChecker } = require("../controllers/UserController");
const { uploadFile, uploads } = require("../controllers/uploadsController");
const { Translate } = require("../controllers/transilator");
const SocketController = require("../controllers/socketController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify_token", tokenChecker, async (req, res) => {
    // check if token is valid
    res.status(200).json({
        userId: req.body.user_id
    })
});

router.post("/upload", uploads.array('files'), uploadFile);
router.post("/translate", Translate);
router.post("/create_chat", SocketController.createChat);
router.get("/chats/:chatId", SocketController.getChat);
router.get("/get_chat_history", SocketController.getChatMessages);
router.post("/store_chat", SocketController.storeChat);
router.post("/store_chat_history", SocketController.storeMessage);

module.exports = router;