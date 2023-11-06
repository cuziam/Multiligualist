const express = require("express");
const router = express.Router();
const {
  translatePapago,
  translateGoogle,
  translateDeepl,
  translateClientReq,
  errors,
  results,
} = require("../src/server/get-api-response");

router.get("/", (req, res) => {
  res.render("landing-page");
});

//수정할 내용: 라우팅 경로, params를 req.body에서 받아오기, 이벤트 함수로직을 html렌더링을 하는 방향으로 수정
//  에러발생 시 에러메시지를 json이 아니라 html페이지로 렌더링
router.post("/translate", async (req, res) => {
  const data = req.body;
  console.log(data);
  translateClientReq(data);
});

module.exports = router;
