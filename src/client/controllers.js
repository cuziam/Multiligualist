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
    //zoom event listener
    window.addEventListener("load", () => {
      clientView.adjustZoomLevel(window);
    });

    //input box event listeners
    const inputBoxTextarea = document.querySelector("#input-box .box-text");
    inputBoxTextarea.addEventListener("input", () => {
      this.clientView.displayRemainingLength();
    });

    //dropdown event listeners
    const iconLangToolList = document.querySelectorAll(
      ".icon-language-select, .icon-translator-select"
    );
    iconLangToolList.forEach((iconLangTool) => {
      iconLangTool.addEventListener("click", () => {
        console.log("clicked");
        this.clientView.displayDropdown(
          iconLangTool,
          this.clientModel.getConfigs(),
          this.clientModel.setConfig.bind(this.clientModel)
        );
        console.log("현재 정보", this.clientModel.getConfigs());
      });
    });

    //toggle switch event listeners
    const iconToggles = document.querySelectorAll(
      "#icon-toggle-on, #icon-toggle-off"
    );

    iconToggles.forEach((iconToggle, idx) => {
      iconToggle.addEventListener("click", () => {
        clientView.toggleSwitch(
          iconToggle,
          idx,
          this.clientModel.updateOutputConfig.bind(this.clientModel)
        );
      });
    });

    const iconCopyList = document.querySelectorAll("#icon-copy");
    iconCopyList.forEach((iconCopy) => {
      iconCopy.addEventListener("click", () => {
        this.util.copyText(iconCopy);
      });
    });

    //history event listeners
    const iconHistoryList = document.querySelectorAll("#icon-history");
    iconHistoryList.forEach((iconHistory) => {
      iconHistory.addEventListener("click", () => {
        this.clientView.displayHistory(
          iconHistory,
          this.clientModel.getOutputConfigs.bind(this.clientModel)
        );
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
