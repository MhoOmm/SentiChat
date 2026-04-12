const express = require('express')
const router = express.Router()

const {auth} = require("../middleware/userMiddleware")

const {createComment , getPostComments} = require("../controllers/commentController")
const {createPost} = require("../controllers/postController")
const {createGreivance} = require("../controllers/greivanceController")


// Post related Controllers
router.post("/post",auth,createPost)
router.post("/create-comment", auth, createComment);
router.get("/get-comments", getPostComments);


// Grievance 
router.post("/create-greivance",auth,createGreivance)


module.exports = router