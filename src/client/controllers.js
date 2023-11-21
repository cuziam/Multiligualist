const ClientModel = require("./client-model");
const ClientView = require("./client-view");

class UiController {
  constructor(clientModel, clientView) {
    this.clientModel = clientModel;
    this.clientView = clientView;
    this.util = require("./util");
    this.initEventListeners();
  }

  addEventListenerToNode(node, event, callback) {
    node.addEventListener(event, callback);
  }

  initEventListeners() {
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
          this.clientModel.setConfig.bind(this.clientModel)
        );
        //index에 해당하는 outputBox에 이벤트 리스너 추가
        const outputBox = document.querySelector("#output-boxes").children[idx];
        console.log("outputBox: ", outputBox);
        if (outputBox.className === "output-box-toggle-on") {
          outputBox
            .querySelector("#icon-copy")
            .addEventListener("click", () => {
              this.util.copyText(outputBox.querySelector("#icon-copy"));
            });
          outputBox
            .querySelector("#icon-history")
            .addEventListener("click", () => {
              this.clientView.displayHistory(
                outputBox.querySelector("#icon-history"),
                this.clientModel.getConfigs.bind(this.clientModel)
              );
            });
        }
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
          this.clientModel.getConfigs.bind(this.clientModel)
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
    this.initEventListeners();
  }

  //Ajax와 관련된 event listener를 추가
  initEventListeners() {
    const btnTranslate = document.querySelector("#btn-translate");
    btnTranslate.addEventListener("click", () => {
      this.translate();
    });
  }

  applyTranslationResult(e) {
    const data = JSON.parse(e.data);
    //일단 데이터를 받아서 콘솔에 출력하는 것으로 테스트
    console.log(data);

    //데이터를 받아서 index와 일치하는 outputConfig의 targetText를 업데이트
    const { index, targetText } = data[0];
    console.log(`index: ${index}번에 응답이 왔습니다.`);
    this.clientModel.setConfig(index, "targetText", targetText);

    //history에 targetText추가
    this.clientModel.addHistory(index, targetText);

    //outputBox의 targetText를 출력
    this.clientView.displayTargetText(this.clientModel.getConfigs(), index);
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
    //input-box의 history에 srcText추가
    this.clientModel.addHistory(null, srcText);

    // outputConfig의 요소 중 state가 on인 것만 필터링
    const dataToSendArr = [];
    for (let i = 0; i < outputConfigs.length; i++) {
      if (outputConfigs[i].state === "on") {
        const dataToSend = {
          index: i,
          srcLang: srcLang,
          srcText: srcText,
          targetLang: outputConfigs[i].targetLang,
          targetTool: outputConfigs[i].targetTool,
        };
        dataToSendArr.push(dataToSend);
      }
    }

    //데이터를 json형식으로 변환
    const stringfiedData = JSON.stringify(dataToSendArr);
    console.log("보낼 데이터: ", stringfiedData);

    //axios를 이용해 post요청을 보냄
    const response = await this.axios.post("/translate", stringfiedData, {
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
