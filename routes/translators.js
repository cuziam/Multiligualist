const express = require("express");
const router = express.Router();

const axios = require("axios");

router.get("/", (req, res) => {
  res.render("landing-page");
});

//post요청이 /으로 들어오면 papago api로 데이터들을 보내고 응답을 받은 후에 응답내용을 클라이언트에게 보내준다.
const clientId = "Q2NhuAe89oAPCapP4mxm";
const clientSecret = "np8i4EfFB4";
const testQuery = "안녕하세요";

router.get("/papago", async (req, res) => {
  const apiUrl = "https://openapi.naver.com/v1/papago/n2mt";

  const options = {
    method: "POST",
    url: apiUrl,
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
    data: `source=ko&target=en&text=${encodeURIComponent(testQuery)}`,
  };

  try {
    const response = await axios(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.log("error:", error.response ? error.response.status : error);
    res.status(error.response ? error.response.status : 500).end();
  }
});

const { TranslationServiceClient } = require("@google-cloud/translate");
const translationClient = new TranslationServiceClient();
const projectId = "translators-403306";
const location = "global";
const text = "안녕여러분 만나서 반갑습니다. 하하.";

router.get("/google", async (req, res) => {
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: "ko",
    targetLanguageCode: "en",
  };

  try {
    const [response] = await translationClient.translateText(request);
    res.status(200).json(response);
  } catch (error) {
    console.log("error:", error);
    res.status(500).end();
  }
});

//
module.exports = router;
