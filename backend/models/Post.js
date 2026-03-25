const mongoose  = require("mongoose")

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:300
    },
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

    upvotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    downvotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{timestamps:true})

module.exports = mongoose.model("Post",postSchema)