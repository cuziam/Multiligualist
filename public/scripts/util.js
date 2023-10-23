const iconCopy = document.querySelector("#icon-copy");
const iconHistory = document.querySelector("#icon-history");

const iconLanguageSelectList = document.querySelectorAll(
  ".icon-language-select"
);

let iconToggleOnList = document.querySelectorAll("#icon-toggle-on");
let iconToggleOffList = document.querySelectorAll("#icon-toggle-off");
const iconToggleList = document.querySelectorAll(".icon-toggle");
const iconFuncList = document.querySelectorAll(".icon-func");

const outputBoxes = document.querySelector("#output-boxes");
const outputBoxToggleOff = document
  .querySelector(".output-box-toggle-off")
  .cloneNode(true);
const outputBoxToggleOn = document
  .querySelector(".output-box-toggle-on")
  .cloneNode(true);

function copyText() {
  // Copy text to clipboard
  const boxTextElement =
    iconCopy.closest("#input-box").querySelector(".box-text") ||
    iconCopy.closest(".output-box-toggle-on").querySelector(".box-text");

  let copiedText;
  if (boxTextElement.tagName === "INPUT") {
    copiedText = boxTextElement.textContent;
  } else {
    copiedText = boxTextElement.value;
  }
  navigator.clipboard.writeText(copiedText);
}

// Toggle on/off
const toggleOff = (iconToggleOn) => {
  const outputBoxes = iconToggleOn.closest("#output-boxes");
  const closestOutputBoxToggleOn = iconToggleOn.closest(
    ".output-box-toggle-on"
  );

  // Search closest lang-tool-select of output-box-toggle-on
  const prevLangToolSelect = closestOutputBoxToggleOn.querySelector(
    ".language-tool-select"
  );

  // load new output-box-toggle-off
  const newOutputBoxToggleOff = outputBoxToggleOff.cloneNode(true);
  // add event listener to icon-toggle-off
  newOutputBoxToggleOff
    .querySelector("#icon-toggle-off")
    .addEventListener("click", () => {
      toggleOn(newOutputBoxToggleOff);
    });
  // change contents in output-box-toggle-off to match output-box-toggle-on
  const elementToRemove = newOutputBoxToggleOff.querySelector(
    ".language-tool-select"
  );
  newOutputBoxToggleOff
    .querySelector(".output-lang-select")
    .replaceChild(prevLangToolSelect, elementToRemove);

  // change previous output-box-toggle-on to new output-box-toggle-off
  outputBoxes.replaceChild(newOutputBoxToggleOff, closestOutputBoxToggleOn);
};

const toggleOn = (iconToggleOff) => {
  const outputBoxes = iconToggleOff.closest("#output-boxes");
  const closestOutputBoxToggleOff = iconToggleOff.closest(
    ".output-box-toggle-off"
  );

  // Search closest lang-tool-select of output-box-toggle-off
  const prevLangToolSelect = closestOutputBoxToggleOff.querySelector(
    ".language-tool-select"
  );

  // load new output-box-toggle-on & change contents in output-box-toggle-on to match output-box-toggle-off
  const newOutputBoxToggleOn = outputBoxToggleOn.cloneNode(true);
  newOutputBoxToggleOn
    .querySelector("#icon-toggle-on")
    .addEventListener("click", () => {
      toggleOff(newOutputBoxToggleOn);
    });
  const elementToRemove = newOutputBoxToggleOn.querySelector(
    ".language-tool-select"
  );
  newOutputBoxToggleOn
    .querySelector(".output-lang-select")
    .replaceChild(prevLangToolSelect, elementToRemove);

  // change previous output-box-toggle-off to new output-box-toggle-on
  outputBoxes.replaceChild(newOutputBoxToggleOn, closestOutputBoxToggleOff);
};

function zoomWindow(window) {
  let width = window.innerWidth;

  if (width >= 2560 && width < 3840) {
    // QHD 해상도
    document.body.style.zoom = "150%"; // 150%로 확대
  } else if (width >= 3840) {
    // 4K 해상도
    document.body.style.zoom = "200%"; // 200%로 확대
  }
}

function showDropdown(iconLanguageSelect) {}

//event listeners
window.addEventListener("load", () => {
  zoomWindow(window);
});

iconLanguageSelectList.forEach((iconLanguageSelect) => {
  iconLanguageSelect.addEventListener("click", () => {
    showDropdown(iconLanguageSelect);
  });
});

iconCopy.addEventListener("click", copyText);

iconFuncList.forEach((iconFunc) => {
  iconFunc.addEventListener("mouseover", () => {
    console.log("iconFunc mouseover");
  });
});

iconToggleOnList.forEach((iconToggleOn) => {
  iconToggleOn.addEventListener("click", () => {
    toggleOff(iconToggleOn);
  });
});

iconToggleOffList.forEach((iconToggleOff) => {
  iconToggleOff.addEventListener("click", () => {
    toggleOn(iconToggleOff);
  });
});
