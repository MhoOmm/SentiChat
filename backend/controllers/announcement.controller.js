const Announcement = require("../models/announcement.model");

const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    const announcement = new Announcement({
      title,
      message
    });

    const saved = await announcement.save();

    res.json({
      success: true,
      message: "Announcement created"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements
};