const { StateManager, UiManager, AjaxManager } = require("./managers");
const util = require("./util");

// 매니저 생성
const stateManager = new StateManager();
const uiManager = new UiManager(stateManager);
const ajaxManager = new AjaxManager(stateManager, uiManager);

// 이벤트 리스너 연결
//window event listeners
window.addEventListener("load", () => {
  uiManager.zoomWindow(window);
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
  uiManager.showDropdown(inputIconLanguageSelect, null, true);
});
iconLanguageSelectList.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    uiManager.showDropdown(icon, index, true);
  });
});

iconTranslatorSelectList.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    uiManager.showDropdown(icon, index, false);
  });
});

//toggle switch event listeners
const iconToggles = document.querySelectorAll(
  "#icon-toggle-on, #icon-toggle-off"
);

iconToggles.forEach((iconToggle, idx) => {
  iconToggle.addEventListener("click", () => {
    uiManager.toggleSwitch(iconToggle, idx);
  });
});

const iconCopyList = document.querySelectorAll("#icon-copy");
iconCopyList.forEach((iconCopy) => {
  iconCopy.addEventListener("click", () => {
    util.copyText(iconCopy);
  });
});

//input-box event listeners
const btnTranslate = document.querySelector("#btn-translate");
btnTranslate.addEventListener("click", () => {
  ajaxManager.translate();
});
