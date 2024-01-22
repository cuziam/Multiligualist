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

//미들웨어 사용
router.use(cookieParser()); //쿠키 파서 미들웨어
router.use(sessionMiddleware); //세션 미들웨어

router.use((req, res, next) => {
  //cors 허용
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

router.get("/", async (req, res) => {
  // 요청에 세션 쿠키가 없으면 세션을 새로 생성한다.
  if (!req.session.initialized) {
    req.session.maxUsage = 20000;
    req.session.usage = 0;
    req.session.initialized = true;
    req.session.userAgent = req.headers["user-agent"] || "";
    await req.session.save();
  }
  //index.html 보내기
  res.sendFile("index.html");
});

router.get("/events", (req, res) => {
  // 이벤트 스트림을 보내는 라우터
  sendEvents(req, res);
});

router.post("/translate", async (req, res) => {
  console.log("translate post request");
  console.log("req.body: ", req.body);
  const data = req.body;
  const usageLength = data[0].srcText.length;
  if (req.session.initialized) {
    try {
      const successfulTranslations = results.filter((result) => result).length;
      const totalUsage = successfulTranslations * usageLength;

      if (req.session.usage + totalUsage >= req.session.maxUsage) {
        res.status(403).send("Forbidden: usage limit exceeded");
        return;
      }

      req.session.usage += totalUsage;
      await req.session.save();
      res.status(200).send("ok");
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  } else {
    //세션이 초기화되지 않았을 때
    try {
      const results = await translateClientReq(data);
      res.status(200).send("translation complete");
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
});

router.get("/healthcheck", (req, res) => {
  res.status(200).send("ok");
});

module.exports = router;
