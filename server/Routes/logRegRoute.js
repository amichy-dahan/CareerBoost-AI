const express = require('express');
const router = express.Router();
const {authenticate} = require("../middellwares/authenticate");


const {login ,register } = require("../controller/LogRegController");
const { validateRegister, validateLogin } = require("../middellwares/validators");

router.post("/login" , validateLogin,login);
router.post("/register",validateRegister,register);
router.post("/logout", (req, res) => {
  const isProd = process.env.PROD === 'true';
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: "/" // must match original cookie path
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;