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

  async makeDropdown(isLanguage, config) {
    //깊은 복사한 config
    const copiedConfig = JSON.parse(JSON.stringify(config));

    console.log("chosen config", copiedConfig);
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
        langElement.setAttribute("id", lang);
        langElement.textContent = lang;
        langElement.addEventListener("click", () => {
          //선택되면 config의 srcLang을 업데이트
          copiedConfig.srcLang = lang;
          dropdown.remove();
        });
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
          langElement.setAttribute("id", lang);
          langElement.textContent = lang;
          langElement.addEventListener("click", () => {
            //선택되면 config의 targetLang를 업데이트
            copiedConfig.targetLang = lang;
            dropdown.remove();
          });
          dropdown.appendChild(langElement);
        });
      } else {
        chosenItem = copiedConfig.targetTool;
        dropdown.classList.add("tool-dropdown");
        copiedConfig.supportedTargetTools.forEach((tool) => {
          const toolElement = document.createElement("div");
          toolElement.classList.add("translator-option");
          toolElement.setAttribute("id", tool);
          toolElement.textContent = tool;
          toolElement.addEventListener("click", () => {
            //선택되면 config의 targetTool을 업데이트
            copiedConfig.targetTool = tool;
            dropdown.remove();
          });
          dropdown.appendChild(toolElement);
        });
      }
    }
    //선택된 아이템 하이라이트
    const chosenItemElement = dropdown.querySelector(`#${chosenItem}`);
    chosenItemElement.classList.add("highlighted");
    return [dropdown, copiedConfig];
  }

  displayDropdown(iconSelect, configs, setConfig) {
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
    //각각의 박스에 대응하는 config탐색
    let config;
    let configIndex;
    if (closestBox.id === "input-box") {
      config = configs.inputConfig;
    } else {
      const configIndex = Array.from(closestBox.parentNode.children).indexOf(
        closestBox
      );
      console.log(configIndex);
      config = configs.outputConfigs[configIndex];
    }
    //드롭다운 생성
    const [dropdown, returnedConfig] = this.makeDropdown(isLanguage, config);
    //삽입 위치 결정//문제점 this.makeDropdown이 다 안 끝났는데 returnedConfig를 쓰는 문제
    console.log(returnedConfig);
    closestBox.style.position = "relative";
    closestBox.appendChild(dropdown);
    //현재 드롭다운으로 설정
    this.currentDropdown = dropdown;
    //박스 유형에 따라 Config 업데이트
    if (closestBox.id === "input-box") {
      console.log("input box");
      setConfig(null, returnedConfig);
    } else {
      setConfig(configIndex, returnedConfig);
    }
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
