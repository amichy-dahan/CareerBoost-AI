const { body, validationResult } = require("express-validator");

// ולידציה להרשמה
const validateRegister = [
  body("full_name")
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 chars")
    .custom(value => {
      if (!value.includes(" ")) {
        throw new Error("Full name must include first and last name");
      }
      return true;
    }),

  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
    .matches(/\d/).withMessage("Password must contain at least one number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ולידציה ללוגין
const validateLogin = [
  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateRegister, validateLogin };
