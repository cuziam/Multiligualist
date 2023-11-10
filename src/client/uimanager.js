//클라이언트의 UI를 담당하는 View
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

  displayDropdown(iconSelect, configIndex, isLanguage) {
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

        this.stateManager.setConfig(
          configIndex,
          updateKey,
          optionElement.textContent
        );
        console.log(this.stateManager.getconfigs());
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
    this.stateManager.setConfig(configIndex, "state", newState);
    // console.log(this.stateManager.getconfigs());
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
  updateTargetText() {
    const { outputConfigs } = this.stateManager.getconfigs();
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

module.exports = UiManager;
