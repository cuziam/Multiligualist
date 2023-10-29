const express = require("express");
const router = express.Router();
const {
  translatePapago,
  translateGoogle,
  translateDeepl,
} = require("../get-response/get-api-response");

router.get("/", (req, res) => {
  res.render("landing-page");
});

router.get("/translate", async (req, res) => {
  //아래 부분을 수정해야함
  const params = ["안녕 이것들아!", "srcLang", "targetLang"];
  await Promise.all([
    translatePapago(...params),
    translateGoogle(...params),
    translateDeepl(...params),
  ]);
  if (errors.length > 0) {
    return res.status(500).json({ results, errors });
  }
  res.json(results);
});

// const srcText = req.query.srcText;
// const srcLang = req.query.srcLang;
// const targetLang = req.query.targetLang;
// const translator = req.query.translator;

// if (translator === "papago") {
//   translatePapago(srcText, srcLang, targetLang);
// } else if (translator === "google") {
//   translateGoogle(srcText, srcLang, targetLang);
// } else if (translator === "deepl") {
//   translateDeepl(srcText, srcLang, targetLang);
// } else {
//   res.status(400).end();
// }
module.exports = router;
