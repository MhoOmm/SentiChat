const express = require("express");
const router = express.Router();

const { getAnnouncements } = require("../controllers/announcement.controller");
const { getPolls,votePoll } = require("../controllers/poll.controller");

router.get("/announcements/all", getAnnouncements);
router.get("/polls/all", getPolls); 
router.post("/polls/vote",votePoll);

module.exports = router;