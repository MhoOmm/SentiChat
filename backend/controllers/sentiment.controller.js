const getSentimentStats = async (req, res) => {
  try {
    res.json({
      success: true,
      stats: {
        positive: 65,
        negative: 20,
        neutral: 15
      }
    });
  } 
  
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }

};

module.exports = { getSentimentStats };