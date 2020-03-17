const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    password:{
        type: String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now
    }
});

const User = mongoose.model('Users', UserSchema);
module.exports = User;