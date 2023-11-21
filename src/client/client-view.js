//클라이언트의 UI를 담당하는 View
class ClientView {
  constructor() {
    this.currentDropdown = null;
    this.currentHistory = null;
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

  resetDisplay() {
    this.currentDropdown = null;
    this.currentHistory = null;
  }
  // zoom window along with screen resolution
  adjustZoomLevel(window) {
    let width = window.innerWidth;

    if (width >= 2560 && width < 3840) {
      // QHD resolution
      document.body.style.zoom = "150%"; // zoom 150%
    } else if (width >= 3840) {
      // 4K resolution
      document.body.style.zoom = "200%"; // zoom 200%
    }
  }

  displayRemainingLength() {
    const inputTextLength = document.querySelector("#input-box .box-text").value
      .length;
    const textCountEle = document.querySelector("#input-box .text-count");
    textCountEle.textContent = `${inputTextLength}/2000`;
    if (inputTextLength >= 2000) {
      textCountEle.style.color = "red";
    } else {
      textCountEle.style.color = "var(--text-default)";
    }
  }

  removeDropdown() {
    if (this.currentDropdown) {
      this.currentDropdown.remove();
    }
  }

  makeDropdown(isLanguage, config) {
    //문자열을 id로 사용하기 위한 헬퍼 함수
    const makeIdString = (str) => {
      return str.replace(" ", "-").replace(/[()]/g, "");
    };

    //깊은 복사한 config
    const copiedConfig = JSON.parse(JSON.stringify(config));

    //드롭다운 생성
    const dropdown = document.createElement("div");
    dropdown.style.display = "flex";

    //input-box의 경우 언어 선택, output-box의 경우 언어 선택과 번역기 선택이 가능하다.
    let chosenItem;
    if (copiedConfig.supportedSrcLangs) {
      chosenItem = copiedConfig.srcLang;
      dropdown.classList.add("lang-dropdown");
      copiedConfig.supportedSrcLangs.forEach((lang) => {
        const langElement = document.createElement("div");
        langElement.classList.add("language-option");
        langElement.setAttribute("id", makeIdString(lang));
        langElement.textContent = lang;
        dropdown.appendChild(langElement);
      });
    } else if (
      copiedConfig.supportedTargetLangs &&
      copiedConfig.supportedTargetTools
    ) {
      if (isLanguage) {
        chosenItem = copiedConfig.targetLang;
        dropdown.classList.add("lang-dropdown");
        copiedConfig.supportedTargetLangs.forEach((lang) => {
          const langElement = document.createElement("div");
          langElement.classList.add("language-option");
          langElement.setAttribute("id", makeIdString(lang));
          langElement.textContent = lang;
          dropdown.appendChild(langElement);
        });
      } else {
        chosenItem = copiedConfig.targetTool;
        dropdown.classList.add("tool-dropdown");
        copiedConfig.supportedTargetTools.forEach((tool) => {
          const toolElement = document.createElement("div");
          toolElement.classList.add("translator-option");
          toolElement.setAttribute("id", makeIdString(tool));
          toolElement.textContent = tool;
          dropdown.appendChild(toolElement);
        });
      }
    }
    //선택된 아이템 하이라이트
    const chosenItemElement = dropdown.querySelector(
      `#${makeIdString(chosenItem)}`
    );
    chosenItemElement.classList.add("highlighted");
    return dropdown;
  }

  async displayDropdown(iconSelect, configs, setConfig) {
    //이전에 표시된 드롭다운 삭제
    if (this.currentDropdown) {
      this.currentDropdown.remove();
    }

    //선택된 아이콘이 언어 선택인지, 번역기 선택인지 판단
    const isLanguage = iconSelect.classList.contains("icon-language-select");

    //선택된 아이콘을 담고 있는 박스 탐색
    const closestBox =
      iconSelect.closest(".output-box-toggle-on") ||
      iconSelect.closest(".output-box-toggle-off") ||
      iconSelect.closest("#input-box");
    console.log("현재 선택된 박스:", closestBox);

    //각각의 박스에 대응하는 config탐색
    let config;
    let configIndex;
    if (closestBox.id === "input-box") {
      config = configs.inputConfig;
    } else {
      configIndex = Array.from(closestBox.parentNode.children).indexOf(
        closestBox
      );
      config = configs.outputConfigs[configIndex];
    }
    console.log("현재 접근한 config:", config, "configIndex:", configIndex);

    //드롭다운 생성
    const dropdown = this.makeDropdown(isLanguage, config);
    console.log("반환된 드롭다운:", dropdown);
    //삽입 위치 결정
    closestBox.style.position = "relative";
    closestBox.appendChild(dropdown);

    //현재 드롭다운으로 설정
    this.currentDropdown = dropdown;

    //드롭다운의 각 항목이 클릭되면 config의 srcLang, targetLang, targetTool을 업데이트
    dropdown
      .querySelectorAll(".language-option, .translator-option")
      .forEach((optionElement) => {
        optionElement.addEventListener("click", (e) => {
          let updateKey;
          if (closestBox.id === "input-box") {
            updateKey = "srcLang";
          } else if (isLanguage) {
            updateKey = "targetLang";
          } else {
            updateKey = "targetTool";
          }
          const newValue = e.target.textContent;
          console.log("setConfig 파라미터", configIndex, updateKey, newValue);
          setConfig(configIndex, updateKey, newValue);
          //박스의 내용을 업데이트
          const chosenItemElement = closestBox.querySelector(
            isLanguage ? ".chosen-lang" : ".chosen-tool"
          );
          chosenItemElement.textContent = newValue;
          dropdown.remove();
        });
      });
  }

  // Toggle on/off
  toggleSwitch(iconToggle, configIndex, setConfig) {
    const outputBoxes = iconToggle.closest("#output-boxes");
    const isToggleOn = iconToggle.closest(".output-box-toggle-on");
    const closestOutputBox = isToggleOn
      ? iconToggle.closest(".output-box-toggle-on")
      : iconToggle.closest(".output-box-toggle-off");

    // 상태 업데이트
    const newState = isToggleOn ? "off" : "on";
    setConfig(configIndex, "state", newState);
    // Search closest lang-tool-select of closest output box(기존 박스의 언어, 번역기 선택창을 가져옴)
    const prevLangToolSelect = closestOutputBox.querySelector(
      ".language-tool-select"
    );
    // load new output box & change contents to match closest output box
    const newOutputBox = isToggleOn
      ? this.BoxElements.outputBoxToggleOff.cloneNode(true)
      : this.BoxElements.outputBoxToggleOn.cloneNode(true);

    // //icon-toggle 교체, 이벤트 리스너 추가
    // newOutputBox
    //   .querySelector("#icon-toggle-" + (isToggleOn ? "off" : "on"))
    //   .addEventListener("click", () => {
    //     this.toggleSwitch(newOutputBox, configIndex, setConfig);
    //   });

    // language-tool-select 교체
    const elementToRemove = newOutputBox.querySelector(".language-tool-select");
    newOutputBox
      .querySelector(".output-lang-select")
      .replaceChild(prevLangToolSelect, elementToRemove);

    // change previous closest output box to new output box
    outputBoxes.replaceChild(newOutputBox, closestOutputBox);
  }

  //outputConfigs를 이용해 outputBox의 내용을 업데이트
  displayTargetText(configs, index) {
    console.log(`update targetText of index ${index}`);
    const { outputConfigs } = configs;
    const outputBoxes = document.querySelectorAll(
      ".output-box-toggle-on, .output-box-toggle-off"
    );
    const boxTextEle = outputBoxes[index].querySelector(".box-text");
    console.log("boxTextEle", boxTextEle);
    boxTextEle.textContent = outputConfigs[index].targetText;
    return;
  }

  displayHistory(iconHistory, getConfigs) {
    console.log("iconHistory", iconHistory);
    //이전에 표시된 history 삭제
    if (this.currentHistory) {
      this.currentHistory.remove();
      this.currentHistory = null;
      return;
    }
    //가장 가까운 output-box 탐색
    const closestOutputBox = iconHistory.closest(
      ".output-box-toggle-on , #input-box"
    );
    const { inputConfig, outputConfigs } = getConfigs();
    const isInputBox = closestOutputBox.id === "input-box";

    //가장 가까운 output-box의 history를 반환하는 헬퍼 함수
    const getHistory = (isInputBox) => {
      if (isInputBox) {
        return inputConfig.history;
      } else {
        const configIndex = Array.from(
          closestOutputBox.parentNode.children
        ).indexOf(closestOutputBox);
        console.log("configIndex", configIndex);
        return outputConfigs[configIndex].history;
      }
    };
    //history가 없다면 간단한 알림창을 띄운다.
    if (getHistory(isInputBox).length === 0) {
      alert("No history");
      return;
    }

    //가장 가까운 output-box의 history 탐색
    const history = getHistory(isInputBox);
    console.log("history", history);
    //클래스 이름이 history인 div 생성
    const historyDiv = document.createElement("div");
    historyDiv.classList.add("history");
    //history의 각 요소를 div로 만들어 historyDiv에 추가
    const historyRecords = history.map((record) => {
      const recordDiv = document.createElement("div");
      recordDiv.classList.add("history-bar");
      recordDiv.innerHTML = `
      <div id="history-bar-time">
        <div>${record.time}</div>
      </div>
      <div id="history-bar-text">
        <div>${record.targetText || record.srcText}</div>
      </div>
      `;
      return recordDiv;
    });
    historyRecords.forEach((record) => {
      historyDiv.appendChild(record);
    });
    //가장 가까운 output-box에 historyDiv 추가
    closestOutputBox.appendChild(historyDiv);
    //historyDiv의 position을 absolute로 설정
    closestOutputBox.style.position = "relative";
    historyDiv.style.position = "absolute";
    //historyDiv의 위치를 가장 가까운 output-box의 아래로 설정
    historyDiv.style.top = "0";
    historyDiv.style.left = "0";
    //현재 표시된 historyDiv로 설정
    this.currentHistory = historyDiv;

    //각 history-bar에 대해 클릭 이벤트 리스너 추가
    historyDiv.querySelectorAll(".history-bar").forEach((historyBar) => {
      historyBar.addEventListener("click", (e) => {
        const targetText = historyBar.querySelector(
          "#history-bar-text div"
        ).textContent;
        const targetBox = closestOutputBox.querySelector(".box-text");
        if (targetBox.tagName === "TEXTAREA") {
          targetBox.value = targetText;
        } else {
          targetBox.textContent = targetText;
        }
        historyDiv.remove();
      });
    });
  }
}

module.exports = ClientView;
