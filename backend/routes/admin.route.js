const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/admin.controller");

router.post("/login-admin", loginAdmin);

module.exports = router;