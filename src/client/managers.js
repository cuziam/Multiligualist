class AjaxManager {
  constructor(stateManager, uiManager) {
    this.axios = require("axios");
    this.stateManager = stateManager;
    this.uiManager = uiManager;
    this.eventSource = null;
  }

  //이벤트 리스너 콜백 함수
  applyTranslationResult(e) {
    const data = JSON.parse(e.data);
    //일단 데이터를 받아서 콘솔에 출력하는 것으로 테스트
    console.log(data);
    //데이터를 받아서 outputConfigs를 업데이트
    const { targetLang, targetText, targetTool } = data[0];
    this.stateManager.updateOutputConfigsText(
      targetLang,
      targetTool,
      targetText
    );
    //uiManager의 updateChosenLangTool을 호출
    this.uiManager.updateChosenLangTool(targetLang, targetTool, targetText);
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
    const { inputConfig, outputConfigs } = this.stateManager.getState();
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

class UiManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.currentDropdown = null;
    this.BoxElements = {
      inputBox: document.querySelector("#input-box"),
      outputBoxToggleOn: document
        .querySelector(".output-box-toggle-on")
        .cloneNode(true),
      outputBoxToggleOff: document
        .querySelector(".output-box-toggle-off")
        .cloneNode(true),
    };
  }

  // zoom window along with screen resolution
  zoomWindow(window) {
    let width = window.innerWidth;

    if (width >= 2560 && width < 3840) {
      // QHD resolution
      document.body.style.zoom = "150%"; // zoom 150%
    } else if (width >= 3840) {
      // 4K resolution
      document.body.style.zoom = "200%"; // zoom 200%
    }
  }

  showDropdown(iconSelect, configIndex, isLanguage) {
    const dropdownClass = isLanguage ? "lang-dropdown" : "tool-dropdown";
    const chosenClass = isLanguage ? "chosen-lang" : "chosen-tool";
    const optionClass = isLanguage ? "language-option" : "translator-option";

    // 이전에 표시된 드롭다운 삭제
    if (this.currentDropdown) {
      this.currentDropdown.remove();
    }

    const chosenItemElement = iconSelect.parentNode.querySelector(
      `.${chosenClass}`
    );
    const chosenItem = chosenItemElement.textContent.replace(" ", "-"); //ex) google translate => google-translate
    const originalDropdown = document.querySelector(`.${dropdownClass}`);
    const dropdown = originalDropdown.cloneNode(true);

    const targetItemElement = dropdown.querySelector(`#${chosenItem}`);
    targetItemElement.classList.add("highlighted");
    dropdown.style.display = "flex";

    // 삽입 위치 결정
    const closestBox =
      iconSelect.closest(".output-box-toggle-on") ||
      iconSelect.closest(".output-box-toggle-off") ||
      iconSelect.closest("#input-box");

    closestBox.style.position = "relative";
    closestBox.appendChild(dropdown);
    this.currentDropdown = dropdown;

    // 각 항목에 대한 이벤트 리스너 추가
    dropdown.querySelectorAll(`.${optionClass}`).forEach((optionElement) => {
      optionElement.addEventListener("click", () => {
        chosenItemElement.textContent = optionElement.textContent;
        let updateKey;
        if (isLanguage) {
          if (configIndex !== null) {
            updateKey = "targetLang";
          } else {
            updateKey = "srcLang";
          }
        } else {
          updateKey = "targetTool";
        }

        this.stateManager.updateState(
          configIndex,
          updateKey,
          optionElement.textContent
        );
        console.log(this.stateManager.getState());
        dropdown.remove();
      });
    });
  }

  // Toggle on/off
  toggleSwitch(iconToggle, configIndex) {
    const outputBoxes = iconToggle.closest("#output-boxes");
    const isToggleOn = iconToggle.closest(".output-box-toggle-on");
    const closestOutputBox = isToggleOn
      ? iconToggle.closest(".output-box-toggle-on")
      : iconToggle.closest(".output-box-toggle-off");

    // 상태 업데이트
    const newState = isToggleOn ? "off" : "on";
    this.stateManager.updateState(configIndex, "state", newState);

    // Search closest lang-tool-select of closest output box(기존 선택 정보를 담음)
    const prevLangToolSelect = closestOutputBox.querySelector(
      ".language-tool-select"
    );

    // load new output box & change contents to match closest output box=>문서에 해당요소가 없으면?
    const newOutputBox = isToggleOn
      ? this.BoxElements.outputBoxToggleOff.cloneNode(true)
      : this.BoxElements.outputBoxToggleOn.cloneNode(true);

    newOutputBox
      .querySelector("#icon-toggle-" + (isToggleOn ? "off" : "on"))
      .addEventListener("click", () => {
        this.toggleSwitch(newOutputBox, configIndex);
      });

    const elementToRemove = newOutputBox.querySelector(".language-tool-select");
    newOutputBox
      .querySelector(".output-lang-select")
      .replaceChild(prevLangToolSelect, elementToRemove);

    // change previous closest output box to new output box
    outputBoxes.replaceChild(newOutputBox, closestOutputBox);
  }

  //outputConfigs를 이용해 언어와 툴이 같은 outputBox의 내용을 업데이트
  updateChosenLangTool(targetLang, targetTool, targetText) {
    const outputBoxes = document.querySelectorAll(".output-box-toggle-on");
    outputBoxes.forEach((outputBox) => {
      const outputLang = outputBox.querySelector(".chosen-lang");
      const outputTool = outputBox.querySelector(".chosen-tool");
      if (
        outputLang.textContent === targetLang &&
        outputTool.textContent === targetTool
      ) {
        const outputText = outputBox.querySelector(".box-text");
        outputText.textContent = targetText;
      }
    });
  }
}

class StateManager {
  constructor() {
    this.inputConfig = {};
    this.outputConfigs = [];
    this.initializeState();
  }

  initializeState() {
    this.inputConfig = {
      srcLang: document.querySelector("#input-box .chosen-lang").textContent,
      srcText:
        document.querySelector("#input-box #input-box-textarea").value || "",
    };

    // 박스의 종류와 언어, 번역기를 저장
    const boxList = document.querySelectorAll(
      ".output-box-toggle-on, .output-box-toggle-off"
    );
    const targetLangs = document.querySelectorAll(
      ".output-box-toggle-on .chosen-lang, .output-box-toggle-off .chosen-lang"
    );
    const targetTools = document.querySelectorAll(
      ".output-box-toggle-on .chosen-tool, .output-box-toggle-off .chosen-tool"
    );
    targetLangs.forEach((lang, index) => {
      this.outputConfigs[index] = {
        state: boxList[index].classList.contains("output-box-toggle-on")
          ? "on"
          : "off",
        targetLang: lang.textContent,
        targetTool: targetTools[index].textContent,
        targetText: "",
      };
    });
    console.log(this.outputConfigs);
  }

  getState() {
    return {
      inputConfig: this.inputConfig,
      outputConfigs: this.outputConfigs,
    };
  }

  updateState(configIndex, key, newValue) {
    if (configIndex !== null && configIndex !== undefined) {
      // Create a new object for immutability
      this.outputConfigs[configIndex] = {
        ...this.outputConfigs[configIndex],
        [key]: newValue,
      };
    } else {
      // Create a new object for immutability
      this.inputConfig = { ...this.inputConfig, [key]: newValue };
    }
  }

  updateOutputConfigsText(targetLang, targetTool, targetText) {
    this.outputConfigs.forEach((outputConfig) => {
      if (
        outputConfig.targetLang === targetLang &&
        outputConfig.targetTool === targetTool
      ) {
        outputConfig.targetText = targetText;
      }
    });
  }
}

module.exports = {
  StateManager,
  UiManager,
  AjaxManager,
};
