const ClientModel = require("./client-model");
const ClientView = require("./client-view");

class UiController {
  constructor(clientModel, clientView) {
    this.clientModel = clientModel;
    this.clientView = clientView;
    this.util = require("./util");
    this.setEventListeners();
  }

  setEventListeners() {
    window.addEventListener("load", () => {
      clientView.adjustZoomLevel(window);
    });

    const inputIconLanguageSelect = document.querySelector(
      "#input-box .icon-language-select"
    );
    const iconLanguageSelectList = document.querySelectorAll(
      ".output-box-toggle-on .icon-language-select, .output-box-toggle-off .icon-language-select"
    );
    const iconTranslatorSelectList = document.querySelectorAll(
      ".icon-translator-select"
    );

    //dropdown event listeners
    //input-box에 있는 icon은 index가 null이 되고, 나머지는 차례대로 index가 0, 1, 2, 3, 4, 5, 6, 7, 8, 9가 된다.
    //코드가 마음에 안 듬.
    inputIconLanguageSelect.addEventListener("click", () => {
      clientView.displayDropdown(
        inputIconLanguageSelect,
        null,
        true,
        this.clientModel.setConfig.bind(this.clientModel)
      );
    });
    iconLanguageSelectList.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        clientView.displayDropdown(
          icon,
          index,
          true,
          this.clientModel.setConfig.bind(this.clientModel)
        );
      });
    });

    iconTranslatorSelectList.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        clientView.displayDropdown(
          icon,
          index,
          false,
          this.clientModel.setConfig.bind(this.clientModel)
        );
      });
    });

    //toggle switch event listeners
    const iconToggles = document.querySelectorAll(
      "#icon-toggle-on, #icon-toggle-off"
    );

    iconToggles.forEach((iconToggle, idx) => {
      iconToggle.addEventListener("click", () => {
        clientView.toggleSwitch(iconToggle, idx, this.clientModel.setConfig);
      });
    });

    const iconCopyList = document.querySelectorAll("#icon-copy");
    iconCopyList.forEach((iconCopy) => {
      iconCopy.addEventListener("click", () => {
        this.util.copyText(iconCopy);
      });
    });
  }
}

class AjaxController {
  constructor(clientModel, clientView) {
    this.axios = require("axios");
    this.clientModel = clientModel;
    this.clientView = clientView;
    this.eventSource = null;
    this.setEventListeners();
  }

  //Ajax와 관련된 event listener를 추가
  setEventListeners() {
    const btnTranslate = document.querySelector("#btn-translate");
    btnTranslate.addEventListener("click", () => {
      this.translate();
    });
  }

  applyTranslationResult(e) {
    const data = JSON.parse(e.data);
    //일단 데이터를 받아서 콘솔에 출력하는 것으로 테스트
    console.log(data);
    //데이터를 받아서 outputConfigs를 업데이트
    const { targetLang, targetText, targetTool } = data[0];
    this.clientModel.setOutputConfigTargetText(
      targetLang,
      targetTool,
      targetText
    );
    this.clientView.updateTargetText(this.clientModel.getConfigs());
  }

  // SSE를 이용해 번역 결과를 받아옴
  async translate() {
    // eventSource가 존재하면 닫음
    if (this.eventSource) {
      this.eventSource.close();
    }

    //새로운 eventSource를 생성.(SSE를 받을 엔드포인트는 /events)
    this.eventSource = new EventSource("/events");

    this.eventSource.onmessage = this.applyTranslationResult.bind(this);

    // inputConfig, outputConfigs를 활용하여 dataToSendArr을 만듦
    document.querySelector("#input-box-textarea").value;
    const { inputConfig, outputConfigs } = this.clientModel.getConfigs();
    const { srcLang } = inputConfig;
    const srcText = document.querySelector("#input-box-textarea").value;

    // outputConfig의 요소 중 state가 on인 것만 필터링
    const filteredOutputConfigs = outputConfigs.filter(
      (outputConfig) => outputConfig.state === "on"
    );
    const dataToSendArr = filteredOutputConfigs.map((outputConfig) => {
      const { targetLang, targetTool } = outputConfig;
      return {
        srcLang: srcLang,
        srcText: srcText,
        targetLang: targetLang,
        targetTool: targetTool,
      };
    });

    //데이터를 json형식으로 변환
    const dataToSend = JSON.stringify(dataToSendArr);
    console.log("보낼 데이터: ", dataToSend);

    //axios를 이용해 post요청을 보냄
    const response = await this.axios.post("/translate", dataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

class AppController {
  constructor(UiController, AjaxController) {
    this.UiController = UiController;
    this.AjaxController = AjaxController;
  }
}

const clientModel = new ClientModel();
const clientView = new ClientView();
const uiController = new UiController(clientModel, clientView);
const ajaxController = new AjaxController(clientModel, clientView);
const appController = new AppController(uiController, ajaxController);

module.exports = AppController;
