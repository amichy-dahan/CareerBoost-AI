
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
        // IMPORTANT: secure cookies over HTTP (local dev) are rejected by browsers -> leads to "No token provided"
        const isProd = process.env.PROD === 'true';
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                 // only secure in production (HTTPS)
            sameSite: isProd ? "none" : "lax", // allow cross-port localhost requests
            path: '/',                       // explicit root path
            maxAge: 1000 * 60 * 60           // 1 hour
        });

        res.json({ message: "Logged in successfully", user });
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            error: err.message || "Server error"
        });
    }
}

async function register(req, res, next) {
    try {
        const { full_name, email, password } = req.body;
        const newUser = await AuthNodel.register(full_name, email, password);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error(err);
        const statusCode = err.status || 400;
        res.status(statusCode).json({
            error: err.message || "Server error"
        });
    }
}

module.exports = { login, register }
