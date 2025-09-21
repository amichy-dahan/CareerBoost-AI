const express = require('express');
const router = express.Router();

const {authenticate} = require("../middellwares/authenticate");
const {login ,register , getMe } = require("../controller/LogRegController");
const { validateRegister, validateLogin } = require("../middellwares/validators");

router.post("/login" ,validateLogin,login);
router.post("/register",validateRegister,register);
router.get("/me",authenticate,getMe);


module.exports = router;