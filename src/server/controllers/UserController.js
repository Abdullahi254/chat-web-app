// user controllers
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const dbClient = require('../utils/db');

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY || "my-secret-key-2024";
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
    
        if(!username || !email || !password) return res.status(400).json("All fields are required!");
    
        if(!validator.isEmail(email)) return res.status(400).json("Email must be valid email!");
    
        if(!validator.isStrongPassword(password)) return res.status(400).json("The password must be strong password");
       
        const users = await dbClient.getCollection("chatDB", "users");
        let user = await users.findOne({email}); 
       
        if (user) return res.status(400).json("User already exists!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = users.insertOne({username, email, password: hashedPassword});
        
        const token = createToken(user._id);
    
        res.status(200).json({_id: user._id, username, email, token});
    
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const users = await dbClient.getCollection("chatDB", "users");
        let user = await users.findOne({email}); 

        if(!user) return res.status(400).json("Invalid email or password");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
    
        res.status(200).json({_id: user._id, username: user.username, email, token});
    } catch(error) {
        console.log(error);
        res.status(500).json(error); 
    }
}

const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('Token is missing');
        }

        const token = authHeader.split(' ')[1]; 

        jwt.verify(token, "my-secret-key-2024", (err, decoded) => {
            if (err) {
                return res.status(403).send('Token is invalid');
            }
            res.status(200).json({expired: false});
        });
    } catch (error) {
        res.status(403).send('Invalid token');
    }
}

module.exports = { registerUser, loginUser, verifyToken };