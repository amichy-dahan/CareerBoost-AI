
const express = require('express');
const linkedinRoutes = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

const REDIRECT_URI = `${process.env.SERVER_URL}/auth/linkedin/callback`;
const User = require("../models/User");


let flow = "";
// Route להתחברות
linkedinRoutes.get("/linkedin", (req, res) => {
    console.log("heloow");
    flow = req.query.flow;
    const scope = "openid profile email";
    const state = "123456";
    const linkedinAuthUrl =
        `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(scope)}`;
    res.json({ url: linkedinAuthUrl });
});

// Route ל-callback
linkedinRoutes.get("/linkedin/callback", async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    // "login" או "register"

    try {
        const tokenResponse = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            null,
            {
                params: {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: REDIRECT_URI,
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

        let user = await User.findOne({ email: decoded.email });


        if (flow === "login") {
            if (!user) {
                return res.redirect(`https://careerboost-ai-1.onrender.com/login?error=${encodeURIComponent("User not registered. Please register first.")}`);
            }
        } else if (flow === "register") {
            if (user) {
                res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent("User already exists. Please login.")}`);

            }
            user = await User.create({
                linkedinId: decoded.sub,
                firstName: decoded.given_name,
                lastName: decoded.family_name,
                email: decoded.email,
                profileImage: decoded.picture || null
            });
        }
        console.log(user);


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });


        res.cookie("token", token, {
            httpOnly: true,
            secure: true,   // אם deploy ב-https
            sameSite: "lax",
            maxAge: 1000 * 60 * 60
        });
        // Redirect ל-frontend
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);


    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});


module.exports = linkedinRoutes;