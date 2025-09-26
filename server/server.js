
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
// CORS configuration: allow server origin + Vite dev origin during development
const devOrigins = [
  `http://localhost:${process.env.PORT || 3000}`,
  'http://localhost:5173',
  'http://localhost:8080'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // non-browser clients
    if (process.env.PROD === 'true') {
      const prodOrigin = 'https://careerboost-ai-1.onrender.com';
      return origin === prodOrigin ? cb(null, true) : cb(new Error('Not allowed by CORS'));
    }
    if (devOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
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

// Simple DB health check endpoint
app.get('/health/db', (req, res) => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection.readyState;
  res.json({ readyState: state });
});

const feedbackRouter = require("./Routes/feedback");
const applicationsRouter = require('./Routes/applications');
app.use("/api/feedback", feedbackRouter);
app.use('/api/applications', applicationsRouter);




async function startDB() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }
  try {
    // Add detailed connection event listeners once (before connect)
    mongoose.connection.on('connected', () => console.log('[Mongo] connected'));
    mongoose.connection.on('error', (err) => console.error('[Mongo] connection error:', err.message));
    mongoose.connection.on('disconnected', () => console.warn('[Mongo] disconnected'));
    mongoose.connection.on('reconnected', () => console.log('[Mongo] reconnected'));
    mongoose.connection.on('connecting', () => console.log('[Mongo] connecting...'));

    await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 });
    console.log('Mongo connected');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
}

startDB();


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});