const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        userName:{
            type: String,
            required:true,
            trim:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
            require:true
        },
        comment:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        ],
        token:{
            type:String
        },
        otp:{
            type:Number,
        },
        otpExpires:{
            type:Date
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("User",userSchema);