const express = require('express')
const router = express.Router()

const { auth } = require("../middleware/userMiddleware")

const { createComment, getPostComments, voteComment } = require("../controllers/commentController")
const { createPost, getPosts, getPost, votePost, getUserProfile } = require("../controllers/postController")
const { createGrievance } = require("../controllers/grievanceController")


// ── Posts ──────────────────────────────────────────────────────────────────
router.post("/post", auth, createPost)
router.get("/posts", getPosts)
router.get("/post/:postId", getPost)
router.post("/post/vote", auth, votePost)
router.get("/profile", auth, getUserProfile)

// ── Comments ───────────────────────────────────────────────────────────────
router.post("/create-comment", auth, createComment)
router.get("/get-comments", getPostComments)          // uses ?postId=  query param
router.post("/comment/vote", auth, voteComment)

// ── Grievance ─────────────────────────────────────────────────────────────
router.post("/create-grievance", auth, createGrievance)


module.exports = router