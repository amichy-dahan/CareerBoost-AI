
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

                // Adaptive cookie strategy:
                // - If request host is a render.com domain (production), use Secure + SameSite=None.
                // - If local (localhost / 127.0.0.1), allow Secure=false + SameSite=Lax so cookie is stored over HTTP.
                // Forcing Secure on localhost prevents the cookie from being set and breaks login.
                const host = (req.get('host') || '').toLowerCase();
                const isRenderHost = /\.onrender\.com$/.test(host);
                const force = (process.env.FORCE_CROSS_SITE_COOKIE || 'true') === 'true';
                let cookieOptions;
                if (isRenderHost && force) {
                    cookieOptions = {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        path: '/',
                        maxAge: 1000 * 60 * 60
                    };
                } else {
                    cookieOptions = {
                        httpOnly: true,
                        secure: false,          // allow over http during local dev
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 1000 * 60 * 60
                    };
                }
                res.cookie('token', token, cookieOptions);

    const safeUser = { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    res.json({ message: "Logged in successfully", user: safeUser });
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
        // Sign token just like login for immediate session
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const host = (req.get('host') || '').toLowerCase();
        const isRenderHost = /\.onrender\.com$/.test(host);
        const force = (process.env.FORCE_CROSS_SITE_COOKIE || 'true') === 'true';
        let cookieOptions;
        if (isRenderHost && force) {
            cookieOptions = { httpOnly: true, secure: true, sameSite: 'None', path: '/', maxAge: 1000 * 60 * 60 };
        } else {
            cookieOptions = { httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 1000 * 60 * 60 };
        }
        res.cookie('token', token, cookieOptions);
        const safeUser = { id: newUser._id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName };
        res.status(201).json({ message: 'User registered successfully', user: safeUser });
    } catch (err) {
        console.error(err);
        const statusCode = err.status || 400;
        res.status(statusCode).json({
            error: err.message || 'Server error'
        });
    }
}

module.exports = { login, register }
