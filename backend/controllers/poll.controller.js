const Poll = require("../models/poll.model");

const createPoll = async (req, res) => {
  try {
    const { question, options, createdBy } = req.body;
    const poll = new Poll({
      question,
      options: options.map((text) => ({ text })),
      createdBy
    });
    await poll.save();
    res.json({ success: true, message: "Poll created" });
  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      polls
    });
  } 
  catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createPoll, getPolls };