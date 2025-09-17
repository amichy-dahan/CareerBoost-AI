
const AuthNodel = require('../models/AuthModel');
const jwt = require("jsonwebtoken")

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await AuthNodel.login(email, password);

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            maxAge: 60 * 60 * 1000
        });

        res.json({ message: "Logged in successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function register(req, res, next) {
    try {
        const { full_name, email, password } = req.body;
        const newUser = await AuthNodel.register(full_name, email, password);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { login, register }