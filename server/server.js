
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require("cors");
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express')
const router = require('../server/Routes/logRegRoute');
const linkedinRoutes = require("../server/Routes/linkedin")
const app = express();
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());
// process.env.PROD === "true"? `https://careerboost-ai-1.onrender.com`:`http://localhost:${process.env.PORT}`,
app.use(cors({
  origin:`https://careerboost-ai-1.onrender.com`,
  credentials: true 
}));

app.use('/users', router);
app.use("/auth", linkedinRoutes);

app.get("/auth/check", (req, res) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});


app.get("/",(req, res)=>{

  res.send("hello word career boost");
})
app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, secure: true, sameSite: "none", maxAge: 0 });
  res.redirect("/login");
});

const feedbackRouter = require("./Routes/feedback");
app.use("/api/feedback", feedbackRouter);




async function startDB() {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
  });
}

startDB();


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});