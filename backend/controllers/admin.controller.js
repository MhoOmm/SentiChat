const adminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  // console.log("Req body:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const admin = await adminModel.findOne({ username, email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Username or email not authorized",
      });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        email: admin.email
      },
      process.env.JWT_SERVER_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } 
  catch (error) {
    console.log("SERVER ERROR:", error); 

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const logoutAdmin = (req, res) => {
  res.json({
    success: true,
    message: "Admin logged out successfully"
  });

};

module.exports = { loginAdmin, logoutAdmin };