const express = require('express');
const router = express.Router();
const {authenticate} = require("../middellwares/authenticate");


const {login ,register } = require("../controller/LogRegController");
const { validateRegister, validateLogin } = require("../middellwares/validators");

router.post("/login" , validateLogin,login);
router.post("/register",validateRegister,register);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/" // חייב להיות זהה ל-cookie המקורי
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;