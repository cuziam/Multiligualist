// 서버와의 통신을 담당하는 controller
class AjaxManager {
  constructor(stateManager, uiManager) {
    this.axios = require("axios");
    this.stateManager = stateManager;
    this.uiManager = uiManager;
    this.eventSource = null;
  }

  //이벤트 리스너 콜백 함수
  applyTargetTextToConfig(e) {
    const data = JSON.parse(e.data);
    //일단 데이터를 받아서 콘솔에 출력하는 것으로 테스트
    console.log(data);
    //데이터를 받아서 outputConfigs를 업데이트
    const { targetLang, targetText, targetTool } = data[0];
    this.stateManager.setOutputConfigTargetText(
      targetLang,
      targetTool,
      targetText
    );
    this.uiManager.updateTargetText();
  }

  // SSE를 이용해 번역 결과를 받아옴
  async translate() {
    // eventSource가 존재하면 닫음
    if (this.eventSource) {
      this.eventSource.close();
    }

    //새로운 eventSource를 생성.(SSE를 받을 엔드포인트는 /events)
    this.eventSource = new EventSource("/events");

    this.eventSource.onmessage = this.applyTargetTextToConfig.bind(this);

    // inputConfig, outputConfigs를 활용하여 dataToSendArr을 만듦
    document.querySelector("#input-box-textarea").value;
    const { inputConfig, outputConfigs } = this.stateManager.getconfigs();
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

    //response의 유형에 따라 처리
  }
}

module.exports = AjaxManager;
