const express = require('express');
const router = express.Router();



const {login ,register } = require("../controller/LogRegController");
const { validateRegister, validateLogin } = require("../middellwares/validators");

router.post("/login" ,validateLogin,login);
router.post("/register",validateRegister,register);


module.exports = router;