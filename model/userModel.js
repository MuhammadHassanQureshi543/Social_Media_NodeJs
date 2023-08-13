const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String
    },
    photo:{
        type:String
    },
    friends:[{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }],
    friendrequest:[{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }]
})

const user = mongoose.model('User',userSchema)
module.exports = user;