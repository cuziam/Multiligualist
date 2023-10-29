const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("landing-page");
});

const errorHandling = async function errorHandling(promise, error) {
  console.log("error:", error.response ? error.response.status : error);
  res.status(error.response ? error.response.status : 500).end();
};

//post요청이 /으로 들어오면 papago api로 데이터들을 보내고 응답을 받은 후에 응답내용을 클라이언트에게 보내준다.
const clientId = "Q2NhuAe89oAPCapP4mxm";
const clientSecret = "np8i4EfFB4";

const translatePapago = async function (srcText, srcLang, targetLang) {
  const clientId = "Q2NhuAe89oAPCapP4mxm";
  const clientSecret = "np8i4EfFB4";
  const apiUrl = "https://openapi.naver.com/v1/papago/n2mt";

  const options = {
    method: "POST",
    url: apiUrl,
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
    data: `source=ko&target=en&text=${encodeURIComponent(srcText)}`,
  };
  const response = await axios(options);
  return response.data;
};

const { TranslationServiceClient } = require("@google-cloud/translate");
const translationClient = new TranslationServiceClient();
const projectId = "translators-403306";
const location = "global";

const translateGoogle = async function (srcText, srcLang, targetLang) {
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [srcText],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: "ko",
    targetLanguageCode: "en",
  };

  const [response] = await translationClient.translateText(request);
  return response;
};

const deepl = require("deepl-node");
const authKey = "8637ebc3-08db-db43-0a27-9499681254b0:fx";
const translator = new deepl.Translator(authKey);

const translateDeepl = async function (srcText, srcLang, targetLang) {
  const response = await translator.translateText(srcText, "ko", "en-us");
  return response;
};

router.get("/translate", async (req, res) => {
  const response1 = await translatePapago("안녕하세요", "ko", "en");
  const response2 = await translateGoogle("안녕하세요 여러분!", "ko", "en");
  const response3 = await translateDeepl(
    "안녕하세요 여러분 만나서 반갑습니다.",
    "ko",
    "en"
  );
  res.json({ response1, response2, response3 });
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
