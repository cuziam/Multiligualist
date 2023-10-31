const express = require("express");
const router = express.Router();
const {
  translatePapago,
  translateGoogle,
  translateDeepl,
  errors,
  results,
} = require("../get-response/get-api-response");

router.get("/", (req, res) => {
  res.render("landing-page");
});

//수정할 내용: 라우팅 경로, params를 req.body에서 받아오기, 이벤트 함수로직을 html렌더링을 하는 방향으로 수정
//  에러발생 시 에러메시지를 json이 아니라 html페이지로 렌더링
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
  results.length = 0;
});

module.exports = router;
