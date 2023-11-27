const session = require("express-session");
const { doubleCsrf } = require("csrf-csrf");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: (req) => process.env.CSRF_SECRET,
});
const generateLocalToken = (req, res) => {
  const token = generateToken(req, res);
  res.locals.csrfToken = token;
};

const configureCsrf = (req, res) => {
  try {
    if (!req.cookies) {
      generateLocalToken(req, res);
      next();
    } else {
      doubleCsrfProtection();
      generateLocalToken(req, res);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { configureCsrf };
