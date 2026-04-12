const Comment = require("../models/Comment")
const User = require("../models/User")
const Post = require("../models/Post")
const axios = require('axios')


// create comment
exports.createComment = async (req, res) => {
    try {
        const { postId, text, parentCommentId } = req.body;
        const userId = req.user.id;

        if (!postId || !text) {
            return res.status(400).json({ success: false, message: "postId and text required" })
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: "Login first" })
        }

        let sentiment = { label: "neutral", confidence: 0 };
        let hate = { label: "non-hate", confidence: 0 };

        try {
            const hateResult = await axios.post('http://127.0.0.1:10000/predict/hate-rnn', { text })
            const SentimentResult = await axios.post('http://127.0.0.1:10000/predict/sentiment', { text })
            sentiment = { label: SentimentResult.data.prediction, confidence: SentimentResult.data.confidence }
            hate = { label: hateResult.data.prediction, confidence: hateResult.data.confidence }
        } catch (mlErr) {
            console.log("ML service unavailable, skipping analysis:", mlErr.message)
        }

        const comment = await Comment.create({
            post: postId,
            user: userId,
            text,
            sentiment,
            hate,
            parentComment: parentCommentId || null,
        })

        await User.findByIdAndUpdate(userId, { $push: { comments: comment._id } });

        const populated = await comment.populate("user", "userName avatar");

        return res.status(200).json({ success: true, comment: populated })

    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Unable to create comment" })
    }
}


// get all comments for a post (as a tree)
exports.getPostComments = async (req, res) => {
    try {
        const { postId } = req.query;
        if (!postId) {
            return res.status(400).json({ success: false, message: "postId required" })
        }

        const comments = await Comment.find({ post: postId })
            .populate('user', 'userName avatar')
            .lean();

        const map = {};
        const roots = [];

        comments.forEach(c => {
            map[c._id] = { ...c, children: [] };
        });

        comments.forEach(c => {
            if (c.parentComment) {
                if (map[c.parentComment]) {
                    map[c.parentComment].children.push(map[c._id]);
                }
            } else {
                roots.push(map[c._id]);
            }
        });

        return res.status(200).json({ success: true, roots })

    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Unable to get comments" })
    }
}


// vote on a comment
exports.voteComment = async (req, res) => {
    try {
        const { commentId, value } = req.body;
        const userId = req.user.id;

        const voteValue = Number(value);

        if (!commentId || Number.isNaN(voteValue) || ![1, -1].includes(voteValue)) {
            return res.status(400).json({
                success: false,
                message: "commentId and value (1 or -1) are required"
            });
        }

        const comment = await Comment.findById(commentId).populate('user');
        if (!comment) {
            return res.status(404).json({ success: false, message: "comment not found" });
        }

        if (comment.user._id.toString() === userId) {
            return res.status(400).json({ success: false, message: "cannot vote on your own comment" });
        }

        const existingVote = comment.votes.find(vote => vote.user.toString() === userId);

        if (existingVote) {
            if (existingVote.value === voteValue) {
                if (existingVote.value === 1) {
                    comment.upvotes -= 1;
                } else {
                    comment.downvotes -= 1;
                }
                comment.votes = comment.votes.filter(v => v.user.toString() !== userId);
            } else {
                if (existingVote.value === 1) {
                    comment.upvotes -= 1;
                } else {
                    comment.downvotes -= 1;
                }

                if (voteValue === 1) {
                    comment.upvotes += 1;
                } else {
                    comment.downvotes += 1;
                }
                existingVote.value = voteValue;
            }
        } else {
            comment.votes.push({ user: userId, value: voteValue });
            if (voteValue === 1) {
                comment.upvotes += 1;
            } else {
                comment.downvotes += 1;
            }
        }

        await comment.save();

        return res.status(200).json({ success: true, comment });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "unable to vote" });
    }
}