const express = require("express")
const router = express.Router()

const {signup,verifyOTP,login} = require("../controllers/Auth");


router.post("/signup",signup)
router.post("/login",login)
router.post("/otp-verify",verifyOTP)


module.exports = router