const mongoose = require('mongoose')
const {Schema} = mongoose


const greivanceSchema = Schema({
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
    category:{
        type:String,
        enum:["academic","hostel","mess","infrastructure","admin","other"],
        required:true
    },
    hate:{
        label:{
            type:String,
        },
        confidence:{
            type:Number
        }
    }
},{timestamps:true})

 gre= mongoose.model("Greivance",greivanceSchema);
 module.exports = gre