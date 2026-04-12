const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  createdBy: {
    type: String
  },

  // 🔥 NEW FIELD
  voters: [
    {
      userId: String,   // or ObjectId if using auth
      optionIndex: Number
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Poll", pollSchema);