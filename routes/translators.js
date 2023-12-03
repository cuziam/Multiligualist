//module imports
const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const { doubleCsrf } = require("csrf-csrf");
require("dotenv").config();

//user-defined modules
const { languageToISOCode, ISOCodeToLanguage } = require("../src/server/util");
const {
  translateClientReq,
  sendEvents,
} = require("../src/server/get-api-response");
const { sessionMiddleware } = require("../src/server/session-controller");
router.use(cookieParser()); //쿠키 파서 미들웨어

router.use("/", sessionMiddleware); //세션 미들웨어
router.get("/", async (req, res) => {
  // 세션에 사용량 정보 저장
  if (req.session._id === undefined) {
    req.session.maxUsage = 20000;
    req.session.usage = 0;
    await req.session.save();
  }
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
  const usageLength = data[0].srcText.length;

  try {
    const results = await translateClientReq(data);
    const successfulTranslations = results.filter((result) => result).length;
    const totalUsage = successfulTranslations * usageLength;

    if (req.session.usage + totalUsage >= req.session.maxUsage) {
      res.status(403).send("usage limit exceeded");
      return;
    }

    req.session.usage += totalUsage;
    await req.session.save();
    res.status(200).send("ok");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.get("/healthcheck", (req, res) => {
  res.status(200).send("ok");
});

module.exports = router;
