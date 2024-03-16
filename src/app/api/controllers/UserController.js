const userModel = require("../../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY || "my-secret-key-2024";
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
    
        if(!name || !email || !password) return res.status(400).json("All fields are required!");
    
        if(!validator.isEmail(email)) return res.status(400).json("Email must be valid email!");
    
        if(!validator.isStrongPassword(password)) return res.status(400).json("The password must be strong password");
       
        let user = await userModel.findOne({email});   
       
        if (user) return res.status(400).json("User already exists!");

        user = new userModel({name, email, password});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    
        const token = createToken(user._id);
    
        res.status(200).json({_id: user._id, name, email, token});
    
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        let user = await userModel.findOne({email});

        if(!user) return res.status(400).json("Invalid email or password");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
    
        res.status(200).json({_id: user._id, name: user.name, email, token});
    } catch(error) {
        console.log(error);
        res.status(500).json(error); 
    }
}

module.exports = { registerUser, loginUser };