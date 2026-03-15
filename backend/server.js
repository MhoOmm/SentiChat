import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());  
app.use(cookieParser());

app.get("/", (req,res) => {
  res.send("backend working");
});

app.listen(port, () => { 
  console.log(`Server started on PORT:${port}`) 
});