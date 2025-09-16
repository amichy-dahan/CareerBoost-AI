

const jwt = require('jsonwebtoken');
const axios = require('axios');
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express')
const router = require('../server/Routes/logRegRoute');
const app = express();
const port = 3000;
app.use(express.json());

app.use('/users', router);

const REDIRECT_URI="http://localhost:3000/auth/linkedin/callback";

// Route להתחברות
app.get("/auth/linkedin", (req, res) => {
  const scope = "openid profile email"; 
  const state = "123456";
  const linkedinAuthUrl = 
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(scope)}`;
  res.redirect(linkedinAuthUrl);
});

// Route ל-callback
app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri:REDIRECT_URI,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

const accessToken = tokenResponse.data.access_token;
const idToken = tokenResponse.data.id_token; 

 const decoded = jwt.decode(idToken);

const user = {
  id: decoded.sub,
  firstName: decoded.given_name,
  lastName: decoded.family_name,
  email: decoded.email
};

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// להפעיל את השרת
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});