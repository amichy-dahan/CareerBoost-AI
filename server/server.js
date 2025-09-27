
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

// Optional verbose mongoose debug (query-level) if enabled via env
if (process.env.DEBUG_MONGO === 'true') {
  mongoose.set('debug', (coll, method, query, doc, options) => {
    try {
      console.log(`[MongoDebug] ${coll}.${method} query=${JSON.stringify(query)} doc=${doc ? JSON.stringify(doc) : ''}`);
    } catch {}
  });
  console.log('[MongoDebug] Enabled');
}


app.use(express.json());
app.use(cookieParser());
// Flexible CORS configuration supporting multiple prod + dev origins.
// Set CORS_ORIGINS env as comma-separated list to append.
const baseDevOrigins = [
  `http://localhost:${process.env.PORT || 3000}`,
  'http://localhost:5173',
  'http://localhost:8080'
];
const prodDefaults = [
  'https://careerboost-ai-1.onrender.com',
  'https://careerboost-ai-al0j.onrender.com'
];
const extra = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
// If PROD=true keep dev origins too so local testing against prod API works.
const allowedOrigins = Array.from(new Set([
  ...baseDevOrigins,
  ...prodDefaults,
  ...extra
]));
console.log('[CORS] Allowed origins:', allowedOrigins);
app.use(cors({
  origin: process.env.PROD === "true"? `https://careerboost-ai-1.onrender.com`:`http://localhost:8080`,
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
const userProgressRouter = require('./Routes/userProgress');
const priorityActionsRouter = require('./Routes/priorityActions');
app.use("/api/feedback", feedbackRouter);
app.use('/applications', applicationsRouter);
app.use('/user/progress', userProgressRouter);
app.use('/priority-actions', priorityActionsRouter);

// Central error handler (including CORS rejections) before DB start message
app.use((err, req, res, next) => {
  if (err.message && /CORS/i.test(err.message)) {
    return res.status(403).json({ error: 'CORS blocked', detail: err.message });
  }
  console.error('[Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});



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