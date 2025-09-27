const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // If you consistently get "No token provided":
  // 1. Ensure cookie-parser middleware is registered BEFORE protected routes.
  // 2. In frontend fetch/axios, set credentials: 'include'.
  // 3. For local dev, cookie must NOT be secure:true (handled in controllers).
  // 4. Check browser devtools -> Application -> Cookies to verify presence.
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser; // מוסיף מידע על המשתמש לבקשה
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate };