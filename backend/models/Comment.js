const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        required: true
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
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

}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);