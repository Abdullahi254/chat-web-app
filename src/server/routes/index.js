const express = require("express");
const { registerUser, loginUser, verifyToken } = require("../controllers/UserController");
const { uploadFile, uploads } = require("../controllers/uploadsController");
const { Translate } = require("../controllers/transilator");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify_token", verifyToken);
router.post("/upload", uploads.array('files'), uploadFile);
router.post("/translate", Translate);


module.exports = router;