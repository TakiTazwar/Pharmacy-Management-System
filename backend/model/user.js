const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    admin:
    {
        type: Boolean,
        default: false
    },
    type:
    {
        type: String,
        required: true
    },
    phoneNumber:
    {
        type: String,
        required: true
    },
    verify:
    {
        type: Boolean,
        default: false
    },

    resetToken: String,
    resetExpire: Date,
    verifyToken: String,
    verifyExpire: Date

},{collection: 'users'});

const userData=mongoose.model('User',userSchema);

module.exports = userData;