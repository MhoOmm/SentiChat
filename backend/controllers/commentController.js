const Comment = require("../models/Comment")
const User = require("../models/User")
const Post = require("../models/Post")
const axios = require('axios')


//create comments 
exports.createComment = async(req,res)=>{
    try {
        
        const {postId , text , parentCommentId} = req.body;
        const userId = req.user.id;

        if(!postId || !text ){
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
        const hateResult = await axios.post(
            'http://127.0.0.1:10000/predict/hate',
            {text}
        )

        const SentimentResult = await axios.post(
            'http://127.0.0.1:10000/predict/sentiment',
            {text}
        )

        const sentiment = {
            label : SentimentResult.data.prediction,
            confidence : SentimentResult.data.confidence
        }
        const hate = {
            label : hateResult.data.prediction,
            confidence : hateResult.data.confidence
        }

        const comment = await Comment.create({
            post:postId,
            user:userId,
            text,
            sentiment:sentiment,
            hate:hate,
            parentComment:parentCommentId,
        })

        await User.findByIdAndUpdate(userId,{
            $push:{comments: comment._id}
        });

        return res.status(200).json({
            success:true,
            comment
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"unable to create comment"
        })
    }
}


//get comments
exports.getPostComments = async(req,res)=>{
    try {
        
        const {postId} = req.body;
        if(!postId){
            return res.status(400).json({
                success:false,
                message:"input all feilds"
            })
        }

        const comments = await Comment.find({post:postId}).populate('user','userName avatar')
        const map = {};
        const roots = [];
        comments.forEach(c => {
            map[c._id] = { ...c.toObject(), children: [] };
        });

        comments.forEach(c=>{
            if(c.parentComment){
                map[c.parentComment]?.children.push(map[c._id]);
            }else{
                roots.push(map[c._id])
            }
        })

        return res.status(200).json({
            success:true,
            roots
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"unable to get comment"
        })
    }
}