//module imports
const express = require("express");
const router = express.Router();

//user-defined modules
const { languageToISOCode, ISOCodeToLanguage } = require("../src/server/util");
const {
  translateClientReq,
  sendEvents,
} = require("../src/server/get-api-response");
const { sessionMiddleware } = require("../src/server/session-controller");
const { configureCsrf } = require("../security/csrf");

router.use(sessionMiddleware);

router.get("/", async (req, res) => {
  req.session.name = "test";
  await req.session.save();
  const preferredLanguages = req.acceptsLanguages();
  res.locals.preferredLanguage =
    ISOCodeToLanguage(preferredLanguages[0]) ||
    ISOCodeToLanguage(preferredLanguages[1]) ||
    ISOCodeToLanguage(preferredLanguages[2]) ||
    "English";
  res.render("landing-page");
});

// router.use((req, res, next) => {
//   configureCsrf(req, res);
//   next();
// });

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
