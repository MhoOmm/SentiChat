const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")


exports.signup = async(req,res)=>{
    try {
        
        const{
            userName,
            email,
            password,
            confirmPassword,
            avatar
        } = req.body;

        if(!userName || !email || !password || !confirmPassword || !avatar){
            return res.status(403).json({
                success:false,
                message:"All feilds are required"
            })
        }
        
        const existingUsername = await User.findOne({userName});
        if(existingUsername){
            return res.status(400).json({
                success:false,
                message:"This UserName is already taken, use other"
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                "Password and Confirm Password do not match. Please try again.",
            });
        }

        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        

        const hashedPassword = await bcrypt.hash(password,10);

        const otp = Number(otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        );

        const otpExpires = Date.now() + 5 * 60 * 1000;

        const hashedEmail = await bcrypt.hash(email,10);

        const user = await User.create({
            userName,
            email:hashedEmail,
            password:hashedPassword,
            avatar,
            otp,
            otpExpires
        })

        await mailSender(
            email,
            "SentiChat OTP Verification",
            `Your OTP for account verification is: ${otp}. It will expire in 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent to email. Please verify.",
        });   


    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"User cannot be registered"
        })
    }
}






exports.verifyOTP =  async(req,res) =>{
    try {
        
        const {userName,otp} = req.body;

        const user = await User.findOne({userName});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.otp !== Number(otp)) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        });
    }

    user.otp = null;
    user.otpExpires = null;

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SERVER_KEY,
      {
        expiresIn: "24h",
      }
    );

    user.token = token;
    user.isVerified = true

    await user.save();

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "login successful",
      });

    } catch (error) {
        return res.status(500).json({
            success:false,
            error,
            message:"otp-verify failed"
        })
    }
}





exports.login = async(req,res) =>{
    try {
        
        const {password,userName} = req.body;

        if(!password || !userName){
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        const user = await User.findOne({ userName })

        if (!user) {
        
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SERVER_KEY,
                {
                expiresIn: "24h",
                }
        );

        user.token = token;
        user.password = undefined;
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: `User Login Success`,
        });
        } else {
        return res.status(401).json({
            success: false,
            message: `Password is incorrect`,
        });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
            message: `Login Failure Please Try Again`,
        });
    }
}