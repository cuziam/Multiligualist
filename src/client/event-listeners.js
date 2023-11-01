const { StateManager, UiManager, AjaxManager } = require("./managers");
const util = require("./util");

// 매니저 생성
const stateManager = new StateManager();
const uiManager = new UiManager(stateManager);
const ajaxManager = new AjaxManager(stateManager);

// 이벤트 리스너 연결

//main event listeners
window.addEventListener("load", () => {
  uiManager.zoomWindow(window);
});

const iconLanguageSelectList = document.querySelectorAll(
  ".icon-language-select"
);
const iconTranslatorSelectList = document.querySelectorAll(
  ".icon-translator-select"
);

//이 부분 버그 많다... 수정할 것
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

const btnTranslate = document.querySelector("#btn-translate");
btnTranslate.addEventListener("click", () => {
  ajaxManager.translate();
});
