const jwt = require("jsonwebtoken")

const User = require("../models/User")

exports.auth = async(req,res,next)=>{
    try {
        
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ","");

        console.log("Token:", token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }
        

        //verify token
        try{
            const decode  = jwt.verify(token,process.env.JWT_SERVER_KEY);
            req.user = decode
        }
        catch(err){
            console.log("JWT ERROR:", err.message);
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();

    } catch (error) {
         console.log("OUTER ERROR:", error.message);
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}