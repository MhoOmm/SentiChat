const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin.middleware");

const { loginAdmin, logoutAdmin } = require("../controllers/admin.controller");

router.post("/login-admin", loginAdmin);
router.get("/me", adminAuth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin", 
    admin: req.admin
  });
});
router.post("/logout-admin", adminAuth, logoutAdmin);


module.exports = router;