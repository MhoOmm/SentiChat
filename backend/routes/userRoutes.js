const express = require("express")
const router = express.Router()

const {signup,verifyOTP} = require("../controllers/Auth");


router.post("/signup",signup)
router.post("/otp-verify",verifyOTP)


module.exports = router