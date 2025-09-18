const { body, validationResult } = require("express-validator");

const validateRegister = async (req, res, next) => {
  // הגדר את כל הבדיקות
  await Promise.all([
    body("full_name")
      .notEmpty().withMessage("Full name is required")
      .custom(value => {
        const words = value.trim().split(/\s+/); // מחלק לפי אחד או יותר רווחים
        if (words.length < 2) {
          throw new Error("Full name must include first and last name");
        }
        return true;
      }).run(req),

    body("email")
      .isEmail().withMessage("Valid email is required")
      .normalizeEmail()
      .run(req),

    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .run(req),
  ]);

  // בדיקה אם יש שגיאות
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};


const validateLogin = async (req, res, next) => {
  // הגדרת הבדיקות
  await Promise.all([
    body("email")
      .isEmail().withMessage("Valid email is required")
      .normalizeEmail()
      .run(req),

    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .run(req),
  ]);

  // בדיקה אם יש שגיאות
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};


module.exports = { validateRegister, validateLogin };
