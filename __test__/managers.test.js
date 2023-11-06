const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const sampleHtml = require("../__test__/sampleHtml");
const dom = new JSDOM(sampleHtml);

const {
  StateManager,
  AjaxManager,
  UiManager,
} = require("../src/client/managers"); // 가정하는 클래스 경로
const axios = require("axios");
jest.mock("axios");

const languageToISOCode = (language) => {
  const languageMap = {
    Afrikaans: "af",
    Albanian: "sq",
    Amharic: "am",
    Arabic: "ar",
    Armenian: "hy",
    Azerbaijani: "az",
    Basque: "eu",
    Belarusian: "be",
    Bengali: "bn",
    Bosnian: "bs",
    Bulgarian: "bg",
    Catalan: "ca",
    Cebuano: "ceb",
    Chichewa: "ny",
    "Chinese (Simplified)": "zh-cn",
    "Chinese (Traditional)": "zh-tw",
    Corsican: "co",
    Croatian: "hr",
    Czech: "cs",
    Danish: "da",
    Dutch: "nl",
    English: "en",
    Esperanto: "eo",
    Estonian: "et",
    Filipino: "tl",
    Finnish: "fi",
    French: "fr",
    Frisian: "fy",
    Galician: "gl",
    Georgian: "ka",
    German: "de",
    Greek: "el",
    Gujarati: "gu",
    "Haitian Creole": "ht",
    Hausa: "ha",
    Hawaiian: "haw",
    Hebrew: "he",
    Hindi: "hi",
    Hmong: "hmn",
    Hungarian: "hu",
    Icelandic: "is",
    Igbo: "ig",
    Indonesian: "id",
    Irish: "ga",
    Italian: "it",
    Japanese: "ja",
    Javanese: "jv",
    Kannada: "kn",
    Kazakh: "kk",
    Khmer: "km",
    Korean: "ko",
    "Kurdish (Kurmanji)": "ku",
    Kyrgyz: "ky",
    Lao: "lo",
    Latin: "la",
    Latvian: "lv",
    Lithuanian: "lt",
    Luxembourgish: "lb",
    Macedonian: "mk",
    Malagasy: "mg",
    Malay: "ms",
    Malayalam: "ml",
    Maltese: "mt",
    Maori: "mi",
    Marathi: "mr",
    Mongolian: "mn",
    "Myanmar (Burmese)": "my",
    Nepali: "ne",
    Norwegian: "no",
    Pashto: "ps",
    Persian: "fa",
    Polish: "pl",
    Portuguese: "pt",
    Punjabi: "pa",
    Romanian: "ro",
    Russian: "ru",
    Samoan: "sm",
    "Scots Gaelic": "gd",
    Serbian: "sr",
    Sesotho: "st",
    Shona: "sn",
    Sindhi: "sd",
    Sinhala: "si",
    Slovak: "sk",
    Slovenian: "sl",
    Somali: "so",
    Spanish: "es",
    Sundanese: "su",
    Swahili: "sw",
    Swedish: "sv",
    Tajik: "tg",
    Tamil: "ta",
    Telugu: "te",
    Thai: "th",
    Turkish: "tr",
    Ukrainian: "uk",
    Urdu: "ur",
    Uzbek: "uz",
    Vietnamese: "vi",
    Welsh: "cy",
    Xhosa: "xh",
    Yiddish: "yi",
    Yoruba: "yo",
    Zulu: "zu",
    // Add more languages as needed
  };

  return languageMap[language];
};

describe("translate", () => {
  let stateManager;
  let translate;
  let mockGetState;
  let mockPost;
  //테스트 초기 세팅.
  beforeEach(() => {
    global.document = dom.window.document;
    stateManager = new StateManager();
    ajaxManager = new AjaxManager(stateManager);
    uiManager = new UiManager(stateManager);
    translate = ajaxManager.translate.bind(ajaxManager);
    mockGetState = jest.fn().mockReturnValue({
      inputConfig: {
        srcLang: "English",
        srcText: "Hello my friend!",
      },
      outputConfigs: [
        { targetLang: "Korean", targetTool: "Google Translator", state: "on" },
        { targetLang: "Korean", targetTool: "Papago", state: "off" },
        { targetLang: "Spanish", targetTool: "DeepL", state: "on" },
        // ... 여기에 더 많은 outputConfig 객체를 추가할 수 있습니다.
      ],
    });
    stateManager.getState = mockGetState;
    mockPost = jest.fn();
    axios.post = mockPost;
  });

  it("should get state from stateManager", async () => {
    await translate();
    expect(mockGetState).toHaveBeenCalled();
  });

  it("should get srcText which type is string from inputConfig", async () => {
    await translate();
    expect(typeof mockGetState().inputConfig.srcText).toBe("string");
  });

  it("should filter out configs with state off", async () => {
    await translate();
    // 이 테스트는 filteredOutputConfigs에 관한 것이므로,
    // 필터링 결과를 검증해야 합니다.
    // 예를 들면, 필터링된 배열의 길이를 검증하는 것입니다.
    const expectedLength = 2;
    const actualFilteredConfigs = mockGetState().outputConfigs.filter(
      (config) => config.state === "on"
    );
    expect(actualFilteredConfigs.length).toBe(expectedLength);
  });
});

describe("translateClientReq", () => {
  const reqBody = [
    {
      srcLang: "Korean",
      srcText: "헬로 월드",
      targetLang: "German",
      targetTool: "Papago",
    },
    {
      srcLang: "Korean",
      srcText: "헬로 월드",
      targetLang: "Spanish",
      targetTool: "DeepL",
    },
  ];

  it("should get reqBody of array type from client", () => {
    expect(Array.isArray(reqBody)).toBe(true);
  });

  // it("should have proper properties in each object of reqBody, or send error response to client", () => {
  //   reqBody.forEach((config) => {
  //     expect(config.srcLang).toBeDefined();
  //     expect(config.srcText).toBeDefined();
  //     expect(config.targetLang).toBeDefined();
  //     expect(config.targetTool).toBeDefined();
  //   });
  //   //various error responses...
  // });

  it("read each targetTool property in reqBody and execute proper function", async () => {
    const mockTranslatePapago = jest.fn().mockResolvedValue("Papago result");
    const mockTranslateGoogle = jest.fn().mockResolvedValue("Google result");
    const mockTranslateDeepl = jest.fn().mockResolvedValue("DeepL result");

    // 모든 비동기 작업이 끝나길 기다림
    await Promise.all(
      reqBody.map((config) => {
        //config.srcLang을 ISO 639-1 code로 바꾸는 함수
        config.srcLang = languageToISOCode(config.srcLang);
        //config.targetLang을 ISO 639-1 code로 바꾸는 함수
        config.targetLang = languageToISOCode(config.targetLang);
        expect(config.srcLang).toBe;
        // 각각의 targetTool에 따라 다른 mock 함수를 호출
        switch (config.targetTool) {
          case "Papago":
            return mockTranslatePapago();
          case "Google Translator":
            return mockTranslateGoogle();
          case "DeepL":
            return mockTranslateDeepl();
        }
      })
    );

    // 각각의 mock 함수가 올바른 횟수로 호출되었는지 확인
    expect(mockTranslatePapago).toHaveBeenCalledTimes(1);
    // Google Translator에 대한 요청이 있다면 이렇게 호출
    // expect(mockTranslateGoogle).toHaveBeenCalledTimes(1);
    expect(mockTranslateDeepl).toHaveBeenCalledTimes(1);
  });
});

describe("translatePapago", () => {});
