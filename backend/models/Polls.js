const express = require("express")
const mongoose = require('mongoose')

const {Schema} = mongoose

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    options :[optionSchema]
});

const optionSchema = new mongoose.Schema({
    optionText :{
        type:String
    },
    votes:{
        type:String
    }
})


const pollsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
})


const ps = mongoose.model('Polls',pollsSchema);
module.exports = {ps}