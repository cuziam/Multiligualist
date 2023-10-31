class DropdownManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.currentDropdown = null;
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
    const chosenItem = chosenItemElement.textContent;
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
        dropdown.remove();
        const updateKey = isLanguage
          ? configIndex !== null
            ? "targetLang"
            : "srcLang"
          : "targetTool";
        this.stateManager.updateState(
          configIndex,
          updateKey,
          optionElement.textContent
        );
      });
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
      };
    });
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
}

const stateManager = new StateManager();
const dropdownManager = new DropdownManager(stateManager);

// 이벤트 리스너 연결
const iconLanguageSelectList = document.querySelectorAll(
  ".icon-language-select"
);
const iconTranslatorSelectList = document.querySelectorAll(
  ".icon-translator-select"
);

iconLanguageSelectList.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    dropdownManager.showDropdown(icon, index, true);
  });
});

iconTranslatorSelectList.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    dropdownManager.showDropdown(icon, index, false);
  });
});
