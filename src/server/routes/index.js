const express = require("express");
const { registerUser, loginUser, verifyToken } = require("../controllers/UserController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify_token", verifyToken);


module.exports = router;