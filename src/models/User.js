const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type:String,
        minLength: 1,
        maxLength: 100,
        required: true
    },
    email: {
        type:String,
        minLength: 1,
        maxLength: 100,
        required: true,
        unique: true
    },
    password: {
        type:String,
        minLength: 6,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
    
}, {timestamps: true}) //to get created at in db

const userModel = mongoose.model('User', userSchema);
module.exports= userModel;