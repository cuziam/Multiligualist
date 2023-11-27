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
  Chinese: "zh",
  "Chinese (Simplified)": "zh-cn",
  "Chinese (Traditional)": "zh-tw",
  Corsican: "co",
  Croatian: "hr",
  Czech: "cs",
  Danish: "da",
  Dutch: "nl",
  English: "en",
  "English (British)": "en-gb",
  "English (American)": "en-us",
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
  "Portuguese (Brazilian)": "pt-br",
  "Portuguese (European)": "pt-pt",
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

reversedLanguageMap = Object.entries(languageMap).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

const languageToISOCode = (language) => {
  return languageMap[language];
};
const ISOCodeToLanguage = (ISOCode) => {
  //ISOCode를 language로 바꿔주는 함수
  return reversedLanguageMap[ISOCode];
};

const ISOCodeForTargetTool = (ISOCode, targetTool) => {
  if (targetTool === "Papago") {
    switch (ISOCode) {
      case "en-us":
        return "en";
      case "en-gb":
        return "en";
      case "zh-cn":
        return "zh-CN";
      case "zh-tw":
        return "zh-TW";
      default:
        return ISOCode;
    }
  }

  if (targetTool === "Google Translator") {
    switch (ISOCode) {
      case "pt-br":
        return "pt";
      case "pt-pt":
        return "pt";
      default:
        return ISOCode;
    }
  }
};
module.exports = {
  languageToISOCode,
  ISOCodeToLanguage,
  ISOCodeForTargetTool,
};
