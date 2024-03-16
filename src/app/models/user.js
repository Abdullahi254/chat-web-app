const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, minilength: 3, maxlength: 30},
        email: {type: String, required: true, minilength: 3, maxlength: 200, unique: true},
        password: {type: String, required: true, minilength: 3, maxlength: 1024, unique: true},
    },
    {
        timestamps: true,
    }
)

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;