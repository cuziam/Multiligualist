require("dotenv").config(); //.env파일을 읽어서 process.env에 넣어줌

const axios = require("axios");
const { EventEmitter } = require("events");
const translationEvents = new EventEmitter();
const results = [];
const errors = [];

translationEvents.on("translation", (result) => {
  results.push(result);
  console.log(results);
});

translationEvents.on("error", (error) => {
  errors.push(error);
});

//post요청이 /으로 들어오면 papago api로 데이터들을 보내고 응답을 받은 후에 응답내용을 클라이언트에게 보내준다.
const translatePapago = async function (srcText, srcLang, targetLang) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
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
  try {
    const response = await axios(options);
    translationEvents.emit("translation", [
      "papago",
      response.data.message.result.translatedText,
    ]);
    return response.data;
  } catch (error) {
    translationEvents.emit("error", { source: "papago", error });
  }
};

const { TranslationServiceClient } = require("@google-cloud/translate");
const translationClient = new TranslationServiceClient();

const translateGoogle = async function (srcText, srcLang, targetLang) {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_LOCATION;
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [srcText],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: "ko",
    targetLanguageCode: "en",
  };
  try {
    const [response] = await translationClient.translateText(request);
    translationEvents.emit("translation", [
      "google",
      response.translations
        .map((translation) => translation.translatedText) //이 부분은 더 빠르게 하기 위해 수정해야함
        .join(""),
    ]);
    return response;
  } catch (error) {
    translationEvents.emit("error", { source: "google", error });
  }
};

const deepl = require("deepl-node");
const authKey = process.env.DEEPL_AUTH_KEY;
const translator = new deepl.Translator(authKey);

const translateDeepl = async function (srcText, srcLang, targetLang) {
  try {
    const response = await translator.translateText(srcText, "ko", "en-us");
    translationEvents.emit("translation", ["deepl", response.text]);
    return response;
  } catch (error) {
    translationEvents.emit("error", { source: "deepl", error });
  }
};

module.exports = {
  translatePapago,
  translateGoogle,
  translateDeepl,
  errors,
  results,
};
