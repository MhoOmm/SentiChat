// const Comment = require("../models/Comment")
const User = require("../models/User")
const Post = require("../models/Post")
const axios = require("axios")


//create post
exports.createPost = async(req,res)=>{
    try {
        
        const { text } = req.body;
        const userId = req.user.id
        console.log(userId)

        if(!text){
            return res.status(400).json({
                success:false,
                message:"input all feilds"
            })
        }

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"failed to fetch userId OR login first"
            })
        }

        // const hateResult = await axios.post(
        //     'http://127.0.0.1:10000/predict/hate',
        //     {text}
        // )

        // const SentimentResult = await axios.post(
        //     'http://127.0.0.1:10000/predict/sentiment',
        //     {text}
        // )

        // const sentiment = {
        //     label : SentimentResult.data.prediction,
        //     confidence : SentimentResult.data.confidence
        // }
        // const hate = {
        //     label : hateResult.data.prediction,
        //     confidence : hateResult.data.confidence
        // }

        const post  = await Post.create({
            text,
            user:userId,
            // sentiment:sentiment,
            // hate:hate
        })

        await User.findByIdAndUpdate(userId,{$push:{posts:post._id}})

        return res.status(200).json({
            success:true,
            post,
            message:"post created success"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success:false,
            error,
            message:"unable to create post"
        })
    }
}