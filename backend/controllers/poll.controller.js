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

const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex, userId } = req.body;

    if (!pollId || optionIndex === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "pollId, optionIndex, and userId are required"
      });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found"
      });
    }

    if (
      typeof optionIndex !== "number" ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid option index"
      });
    }

    // 🔥 CHECK EXISTING VOTE
    const existingVote = poll.voters.find(v => v.userId === userId);

    if (existingVote) {
      // REMOVE OLD VOTE
      poll.options[existingVote.optionIndex].votes -= 1;

      // UPDATE VOTE
      existingVote.optionIndex = optionIndex;
    } else {
      // NEW VOTE
      poll.voters.push({ userId, optionIndex });
    }

    // ADD NEW VOTE
    poll.options[optionIndex].votes += 1;

    await poll.save();

    res.json({
      success: true,
      message: "Vote updated",
      poll
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = { createPoll, getPolls , votePoll };