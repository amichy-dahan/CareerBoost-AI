const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    
  const token = req.cookies.token; // <-- קריאה מה-cookie

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