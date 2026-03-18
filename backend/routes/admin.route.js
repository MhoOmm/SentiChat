const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin.middleware");
const { loginAdmin, logoutAdmin } = require("../controllers/admin.controller");

const { createAnnouncement, getAnnouncements } = require("../controllers/announcement.controller");
const { getSentimentStats } = require("../controllers/sentiment.controller");


router.post("/login-admin", loginAdmin);
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin", 
    admin: req.admin
  });
}); 
router.post("/logout-admin", adminAuth, logoutAdmin);

router.post("/announcements/create", createAnnouncement);
router.get("/announcements/all", adminAuth, getAnnouncements);
router.get("/sentiment/stats", adminAuth, getSentimentStats);

module.exports = router;