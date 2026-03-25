const User = require("../models/User")
const Post = require("../models/Post")
const axios = require("axios")


// create post
exports.createPost = async (req, res) => {
    try {
        const { text, title } = req.body;
        const userId = req.user.id

        if (!text || !title) {
            return res.status(400).json({
                success: false,
                message: "Title and text are required"
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Login first"
            })
        }

        let sentiment = { label: "neutral", confidence: 0 };
        let hate = { label: "non-hate", confidence: 0 };

        try {
            const hateResult = await axios.post('http://127.0.0.1:10000/predict/hate', { text })
            const SentimentResult = await axios.post('http://127.0.0.1:10000/predict/sentiment', { text })
            sentiment = { label: SentimentResult.data.prediction, confidence: SentimentResult.data.confidence }
            hate = { label: hateResult.data.prediction, confidence: hateResult.data.confidence }
        } catch (mlErr) {
            console.log("ML service unavailable, skipping analysis:", mlErr.message)
        }

        const post = await Post.create({
            text,
            title,
            user: userId,
            sentiment,
            hate
        })

        await User.findByIdAndUpdate(userId, { $push: { posts: post._id } })

        return res.status(200).json({
            success: true,
            post,
            message: "Post created successfully"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error,
            message: "Unable to create post"
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


// vote on a post  (type = "up" | "down")
exports.votePost = async (req, res) => {
    try {
        const { postId, type } = req.body;
        const userId = req.user.id;

        if (!postId || !type) {
            return res.status(400).json({ success: false, message: "postId and type required" })
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" })

        const hasUpvoted   = post.upvotes.includes(userId);
        const hasDownvoted = post.downvotes.includes(userId);

        if (type === "up") {
            if (hasUpvoted) {
                // toggle off
                post.upvotes.pull(userId);
            } else {
                post.upvotes.push(userId);
                if (hasDownvoted) post.downvotes.pull(userId);
            }
        } else if (type === "down") {
            if (hasDownvoted) {
                // toggle off
                post.downvotes.pull(userId);
            } else {
                post.downvotes.push(userId);
                if (hasUpvoted) post.upvotes.pull(userId);
            }
        } else {
            return res.status(400).json({ success: false, message: "type must be 'up' or 'down'" })
        }

        await post.save();

        return res.status(200).json({
            success: true,
            upvotes: post.upvotes.length,
            downvotes: post.downvotes.length,
            message: "Vote registered"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Unable to vote" })
    }
}
