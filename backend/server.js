const express = require("express");
require("dotenv").config({ quiet: true });
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/mongodb");
const adminRouter = require("./routes/admin.route");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["*"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get("/", (req,res) => {
  res.send("backend working");
});

app.use("/api/admin", adminRouter);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});