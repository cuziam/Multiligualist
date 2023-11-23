const express = require("express");
const router = express.Router();
const { languageToISOCode, ISOCodeToLanguage } = require("../src/server/util");
const {
  translateClientReq,
  sendEvents,
} = require("../src/server/get-api-response");
const session = require("express-session");
const { doubleCsrf } = require("csrf-csrf");
require("dotenv").config();

//session
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: (req) => process.env.CSRF_SECRET,
});

router.use(doubleCsrfProtection);
router.get("/", (req, res) => {
  try {
    const csrfToken = generateToken(req, res);
  } catch (err) {
    console.log(err);
  }

  console.log(csrfToken);
  // 클라이언트가 선호하는 언어를 파악
  const preferredLanguages = req.acceptsLanguages();
  res.locals.preferredLanguage =
    ISOCodeToLanguage(preferredLanguages[0]) ||
    ISOCodeToLanguage(preferredLanguages[1]) ||
    ISOCodeToLanguage(preferredLanguages[2]) ||
    "English";
  res.render("landing-page");
});

router.get("/events", (req, res) => {
  sendEvents(req, res);
});

router.post("/translate", async (req, res) => {
  const data = req.body;
  console.log("요청 데이터", data);
  translateClientReq(data);
  res.status(200).send("ok");
});

module.exports = router;
