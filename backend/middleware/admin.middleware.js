const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SERVER_KEY);
    req.admin = decoded;
    next();
  } 
  
  catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

};

module.exports = adminAuth;