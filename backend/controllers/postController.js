const User = require("../models/User")
const Post = require("../models/Post")
const axios = require("axios")


// create post
exports.createPost = async(req,res)=>{
    try {
        
        const { text } = req.body;
        const userId = req.user.id

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

        const hateResult = await axios.post(
            'http://127.0.0.1:8000/predict/hate',
            {text}
        )

        const SentimentResult = await axios.post(
            'http://127.0.0.1:8000/predict/sentiment',
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

        const post  = await Post.create({
            text,
            user:userId,
            sentiment:sentiment,
            hate:hate
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


// get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "userName avatar")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Unable to fetch posts"
        })
    }
}


// get single post
exports.getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate("user", "userName avatar")
        if (!post) return res.status(404).json({ success: false, message: "Post not found" })
        return res.status(200).json({ success: true, post })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Unable to fetch post" })
    }
}


// vote on a post
exports.votePost = async (req, res) => {
    try {
        const { postId, value } = req.body;
        const userId = req.user.id;

        const voteValue = Number(value);

        if (!postId || Number.isNaN(voteValue) || ![1, -1].includes(voteValue)) {
            return res.status(400).json({
                success: false,
                message: "postId and value (1 or -1) are required"
            });
        }

        const post = await Post.findById(postId).populate('user');
        if (!post) {
            return res.status(404).json({ success: false, message: "post not found" });
        }

        // Cannot vote on your own post
        if (post.user._id.toString() === userId) {
            return res.status(400).json({ success: false, message: "cannot vote on your own post" });
        }

        const existingVote = post.votes.find(vote => vote.user.toString() === userId);

        if (existingVote) {
            if (existingVote.value === voteValue) {
                if (existingVote.value === 1) {
                    post.upvotes -= 1;
                } else {
                    post.downvotes -= 1;
                }
                post.votes = post.votes.filter(v => v.user.toString() !== userId);
            } else {
                if (existingVote.value === 1) {
                    post.upvotes -= 1;
                } else {
                    post.downvotes -= 1;
                }

                if (voteValue === 1) {
                    post.upvotes += 1;
                } else {
                    post.downvotes += 1;
                }
                existingVote.value = voteValue;
            }
        } else {
            post.votes.push({ user: userId, value: voteValue });
            if (voteValue === 1) {
                post.upvotes += 1;
            } else {
                post.downvotes += 1;
            }
        }

        await post.save();
        await post.populate('user', 'userName avatar');

        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "unable to vote" });
    }
}
