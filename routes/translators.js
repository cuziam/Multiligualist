const express = require("express");
const router = express.Router();

const {
  translatePapago,
  translateGoogle,
  translateDeepl,
  translateClientReq,
  sendEvents,
} = require("../src/server/get-api-response");

router.get("/", (req, res) => {
  res.render("landing-page");
});

router.get("/events", (req, res) => {
  sendEvents(req, res);
});

router.post("/translate", async (req, res) => {
  const data = req.body;
  console.log(data);
  translateClientReq(data);
  res.status(200).send("ok");
});

module.exports = router;
