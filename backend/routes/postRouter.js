const express = require("express")
const router = express.Router()

const {createPost} = require("../controllers/postController")

router.post("/post",createPost)
// router.post("/comment",createComment)

module.exports = router