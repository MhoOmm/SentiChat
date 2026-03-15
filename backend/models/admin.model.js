const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  }
});

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;