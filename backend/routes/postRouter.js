const express = require("express")

const router = express.Router()

const {auth} = require("../middleware/userMiddleware")

const {createComment , getPostComments} = require("../controllers/commentController")
const {createPost} = require("../controllers/postController")

router.post("/create-comment", auth, createComment);
router.get("/get-comments", getPostComments);


router.post("/post",auth,createPost)


module.exports = router