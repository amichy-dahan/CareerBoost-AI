const express = require('express');
const router = express.Router();
const {authenticate} = require("../middellwares/authenticate");


const {login ,register } = require("../controller/LogRegController");
const { validateRegister, validateLogin } = require("../middellwares/validators");

router.post("/login" ,authenticate, validateLogin,login);
router.post("/register", authenticate,validateRegister,register);


module.exports = router;