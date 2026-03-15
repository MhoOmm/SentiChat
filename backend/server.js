import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import adminRouter from "./routes/admin.route.js";


const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());  
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));

app.get("/", (req,res) => {
  res.send("backend working");
});

app.use("/api/admin", adminRouter);

app.listen(port, () => { 
  console.log(`Server started on PORT:${port}`) 
});