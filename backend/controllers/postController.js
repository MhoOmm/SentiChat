const Comment = require("../models/Comment")
const User = require("../models/User")
const Post = require("../models/Post")

//create post
exports.createPost = async(req,res)=>{
    try {
        
        const {text} = req.body;
        const userId= req.user.id;

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

        const post  = await Post.create({text,user:userId})
        const populatedPost = await Post.findById(post._id)
                                .populate("user", "userName avatar");

        await User.findByIdAndUpdate(userId,{$push:{posts:post._id}})

        return res.status(200).json({
            success:true,
            post,
            populatedPost,
            message:"post created success"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"unable to create post"
        })
    }
}