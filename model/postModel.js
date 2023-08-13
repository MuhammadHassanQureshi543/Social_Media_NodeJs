const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    description:{
        type:String
    },
    photo:{
        type:String,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    likes:[{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }]
})

const post = mongoose.model('Post',postSchema)
module.exports = post;