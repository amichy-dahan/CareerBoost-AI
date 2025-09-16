
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const axios = require('axios');
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express')
const router = require('../server/Routes/logRegRoute');
const linkedinRoutes = require("../server/Routes/linkedin")
const app = express();
const port = 3000;
app.use(express.json());




app.use('/users', router);
app.use("/auth", linkedinRoutes);


async function startDB() {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startDB();


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});