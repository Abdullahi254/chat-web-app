// user controllers
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { ObjectId } = require('mongodb');

const dbClient = require('../utils/db');


const getTokenKey = () => {
    return process.env.JWT_SECRET_KEY || "my-secret-key-2024";
}

const createToken = (_id) => {
    const jwtkey = getTokenKey();
    return jwt.sign({id: _id}, jwtkey, {expiresIn: "3d"});
}

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) return res.status(400).json("All fields are required!");

        if(!validator.isEmail(email)) return res.status(400).json("Email must be valid email!");

        if(!validator.isStrongPassword(password)) return res.status(400).json("The password must be strong password");

        const users = await dbClient.getCollection("chatDB", "users");
        const existingUser = await users.findOne({email}); 
       
        if (existingUser) return res.status(400).json("User already exists!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const username = email.split('@')[0];
        await users.insertOne({username, email, password: hashedPassword});
     
        res.status(201).json({ username, email });
    
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const loginUser = async (req, res) => {
        const userId = req.userId
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json("All fields are required!");

        if(!validator.isEmail(email)) return res.status(400).json("Email must be valid email!");

        const users = await dbClient.getCollection("chatDB", "users");
        let user = await users.findOne({email}); 

        if(!user){
            return res.status(401).json("user not found")
        };

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
    
        res.status(200).json({username: user.username, email, token});
    } catch(error) {
        console.log(error);
        res.status(500).json(error); 
    }
}

// Middleware to check if token is valid.
const tokenChecker = async function (req, res, next) {
    const authToken = req.query.token
    try {
      const decoded = jwt.verify(authToken, "my-secret-key-2024")
      req.body.user_id = decoded
      next()
    } catch (er) {
      const error = new Error("Invalid auth token")
      error.status = 403
      next(error)
    }
  }
  
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log(authHeader)
        if (!authHeader) {
            return res.status(401).send('Token is missing');
        }

        const token = authHeader.split(' ')[1]; 

        return jwt.verify(token, "my-secret-key-2024", (err, decoded) => {
            if (err) {
                return res.status(401).send('Token is invalid');
            }

            return res.status(200).json({ verified: true });
        });
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
}


async function getUserfromToken(token) {
    try {
        return jwt.verify(token, "my-secret-key-2024", async (err, decoded) => {
            if (err) {
               throw new Error('Token is invalid');
            }
            const usersCollection = await dbClient.getCollection('chatDB', 'users')
            const user = await usersCollection.findOne({_id: ObjectId.createFromHexString(decoded.id)})
            return user;
        });
    } catch(error) {
        console.log(error)
    }
    return null;
}

const getUserBio = async (req, res) => {
    try {
        const { userId } = req.body;
        const usersCollection = await dbClient.getCollection('chatDB', 'users')
        const user = await usersCollection.findOne({_id: userId});
        const chats = await dbClient.getCollection("chatDB", "chats");

        // gets all groups chats the user is member of
        const chatGroups = chats.find({users: {$in: userId}, isRoomChat: true})
        const bio = {
            username: user.username,
            email: user.email,
            groups: chatGroups
        }
        return res.status(200).send(bio);
    } catch(err) {
        return res.status(404).json({"Error": "User bio not found!"});
    }
}

module.exports = { registerUser, loginUser, tokenChecker };