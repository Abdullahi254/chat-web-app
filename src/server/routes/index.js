const express = require("express");
const { registerUser, loginUser, tokenChecker } = require("../controllers/UserController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify_token", tokenChecker, async (req, res) => {
    // check if token is valid
    res.status(200).json({
        userId: req.body.user_id
    })
});


module.exports = router;