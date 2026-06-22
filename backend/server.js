const express = require("express");
require("dotenv").config({ quiet: true });
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/mongodb");
const adminRouter = require("./routes/admin.route");
const userRoutes = require("./routes/userRoutes");

const postRouter = require('./routes/postRouter')
const pollsRouter = require('./routes/pollsRouter')

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://127.0.0.1:10000", "http://localhost:5173", "http://localhost:5174", "https://senti-chat-36sq.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get("/", (req,res) => {
  res.send("backend working");
});

app.use("/api/admin", adminRouter);
app.use("/api/user", userRoutes);

// post
app.use('/api/chat',postRouter);
app.use('/api/poll',pollsRouter);

app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});

module.exports = app;