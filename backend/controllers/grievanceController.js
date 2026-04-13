const express = require("express")
const Grievance = require("../models/Grievance")
const User = require("../models/User")
const axios = require("axios")


exports.createGrievance = async(req,res)=>{
    try{
        const {text,category} = req.body
        const userId = req.user.id

        if(!text){
            return res.status(400).json({
                success:false,
                message:"input all fields"
            })
        }
        if(!category){
            return res.status(400).json({
                success:false,
                message:"please entry category"
            })
        }

        const today = new Date()
        today.setHours(0,0,0,0)

        const countGri = await Grievance.countDocuments({
            user:userId,
            createdAt:{ $gte: today }
        })

        if(countGri>=5)
        {
            return res.status(400).json({
                success:false,
                message:"You have reached the maximum limit of 5 grievances."
            })
        }

        const duplicate = await Grievance.findOne({
            text: { $regex: new RegExp(`^${text.trim()}$`, "i") },
            category: category
        })

        if(duplicate){
            return res.status(400).json({
                success:false,
                message:"A similar grievance already exists."
            })
        }

        // const hateResult = await axios.post(
        //     'http://127.0.0.1:10000/predict/hate-rnn',
        //     {text}
        // )

        // const hate = {
        //     label : hateResult.data.prediction,
        //     confidence : hateResult.data.confidence
        // }

        // if(hate.label === "offensive" || hate.label === "hatespeech")
        // {
        //     return res.status(400).json({
        //         success:false,
        //         message:"Dont spread hate,Post genuine grievance"
        //     })
        // }


        const grievance  = await Grievance.create({
            text,
            user:userId,
            category
            // hate:hate
        })

        return res.status(200).json({
            success:true,
            grievance,
            message:"grievance created success"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            error,
            message:"unable to create grievance"
        })
    }
}


exports.getAllGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find()
            .populate("user", "name email") 
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true, 
            count: grievances.length,
            grievances
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch grievances",
            error: error.message
        });
    }
};