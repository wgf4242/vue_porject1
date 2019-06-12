const mongoose = require("mongoose");
const Schesma = mongoose.Schema;

// Create Schema
const UserSchema = new Schesma({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    avatar: {
        type:String,
    },
    date: {
        type:Date,
        default:Date.now
    },
    identity:{
        type:String,
        required:true
    }
})

module.exports = User = mongoose.model("users", UserSchema);