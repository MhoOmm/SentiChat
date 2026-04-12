const mongoose  = require("mongoose")

const postSchema = new mongoose.Schema({
    text:{
        type:String,
        require:true,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    sentiment:{
        label:{
            type:String,
        },
        confidence:{
            type:Number
        }
    },
    hate:{
        label:{
            type:String,
        },
        confidence:{
            type:Number
        }
    },

    votes:[{
        user: { type:mongoose.Schema.Types.ObjectId, ref:"User" },
        value: { type: Number, enum: [1, -1] }
    }],
    upvotes:{ type: Number, default: 0 },
    downvotes:{ type: Number, default: 0 },

},{timestamps:true})

module.exports = mongoose.model("Post",postSchema)