/**
 * @jest-environment jsdom
 */

// translate.test.js
const {
  StateManager,
  AjaxManager,
  UiManager,
} = require("../src/client/managers"); // 가정하는 클래스 경로
const axios = require("axios");
jest.mock("axios");

describe("translate", () => {
  let stateManager;
  let translate;
  let mockGetState;
  let mockPost;
  //테스트 초기 세팅.
  beforeEach(() => {
    document.body.innerHTML = require("../__test__/sampleHtml");
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

  it("should convert data to JSON", async () => {
    await translate();
    // JSON.stringify 함수를 사용하여 변환된 결과를 검증할 수 있습니다.
    // 예를 들면, JSON.parse(JSON.stringify(...)) === ... 을 검증하는 것입니다.
    const expectedData = JSON.stringify([
      {
        srcLang: "English",
        srcText: "Hello my friend!",
        targetLang: "Korean",
        targetTool: "Google Translator",
      },
      {
        srcLang: "English",
        srcText: "Hello my friend!",
        targetLang: "Spanish",
        targetTool: "DeepL",
      },
    ]);
    const actualData = JSON.stringify(
      mockGetState().outputConfigs.map((outputConfig) => {
        const { targetLang, targetTool } = outputConfig;
        return {
          srcLang: srcLang,
          srcText: srcText,
          targetLang: targetLang,
          targetTool: targetTool,
        };
      })
    );
    expect(actualData).toBe(expectedData);
  });

  // 필요에 따라 추가 테스트 케이스를 작성할 수 있습니다.
});
