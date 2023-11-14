//클라이언트의 UI를 담당하는 View
class ClientView {
  constructor() {
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

  // displayDropdown(iconSelect, configIndex, isLanguage, callback) {
  //   const dropdownClass = isLanguage ? "lang-dropdown" : "tool-dropdown";
  //   const chosenClass = isLanguage ? "chosen-lang" : "chosen-tool";
  //   const optionClass = isLanguage ? "language-option" : "translator-option";
  //   // 이전에 표시된 드롭다운 삭제
  //   if (this.currentDropdown) {
  //     this.currentDropdown.remove();
  //   }
  //   const chosenItemElement = iconSelect.parentNode.querySelector(
  //     `.${chosenClass}`
  //   );
  //   const chosenItem = chosenItemElement.textContent.replace(" ", "-"); //ex) google translate => google-translate
  //   const originalDropdown = document.querySelector(`.${dropdownClass}`);
  //   const dropdown = originalDropdown.cloneNode(true);
  //   const targetItemElement = dropdown.querySelector(`#${chosenItem}`);
  //   targetItemElement.classList.add("highlighted");
  //   dropdown.style.display = "flex";
  //   // 삽입 위치 결정
  //   const closestBox =
  //     iconSelect.closest(".output-box-toggle-on") ||
  //     iconSelect.closest(".output-box-toggle-off") ||
  //     iconSelect.closest("#input-box");
  //   closestBox.style.position = "relative";
  //   closestBox.appendChild(dropdown);
  //   this.currentDropdown = dropdown;
  //   // 각 항목에 대한 이벤트 리스너 추가
  //   dropdown.querySelectorAll(`.${optionClass}`).forEach((optionElement) => {
  //     optionElement.addEventListener("click", () => {
  //       chosenItemElement.textContent = optionElement.textContent;
  //       let updateKey;
  //       if (isLanguage) {
  //         if (configIndex !== null) {
  //           updateKey = "targetLang";
  //         } else {
  //           updateKey = "srcLang";
  //         }
  //       } else {
  //         updateKey = "targetTool";
  //       }
  //       //컨트롤러로
  //       callback(configIndex, updateKey, optionElement.textContent);
  //       dropdown.remove();
  //     });
  //   });
  // }

  // Toggle on/off
  toggleSwitch(iconToggle, configIndex, updateOutputConfig) {
    const outputBoxes = iconToggle.closest("#output-boxes");
    const isToggleOn = iconToggle.closest(".output-box-toggle-on");
    const closestOutputBox = isToggleOn
      ? iconToggle.closest(".output-box-toggle-on")
      : iconToggle.closest(".output-box-toggle-off");

    // 상태 업데이트
    const newState = isToggleOn ? "off" : "on";
    updateOutputConfig(configIndex, "state", newState);
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

  //outputConfigs를 이용해 outputBox의 내용을 업데이트
  updateTargetText(configs) {
    const { outputConfigs } = configs;
    const boxesToUpdate = document.querySelectorAll(".output-box-toggle-on");
    boxesToUpdate.forEach((boxToUpdate) => {
      const targetLang = boxToUpdate.querySelector(".chosen-lang").textContent;
      const targetTool = boxToUpdate.querySelector(".chosen-tool").textContent;

      console.log(targetLang, targetTool, outputConfigs);
      const targetText = outputConfigs.find(
        (outputConfig) =>
          outputConfig.targetLang === targetLang &&
          outputConfig.targetTool === targetTool
      ).targetText;
      boxToUpdate.querySelector(".box-text").textContent = targetText;
    });
  }
}

module.exports = ClientView;
