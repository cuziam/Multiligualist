const iconCopy = document.querySelector("#icon-copy");
const iconHistory = document.querySelector("#icon-history");
const tooltip = document.querySelector(".tooltip");

let iconToggleOnList = document.querySelectorAll("#icon-toggle-on");
let iconToggleOffList = document.querySelectorAll("#icon-toggle-off");

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

  // update iconToggleOnList and iconToggleOffList
  const newIconToggleOnList = outputBoxes.querySelectorAll("#icon-toggle-on");
  const newIconToggleOffList = outputBoxes.querySelectorAll("#icon-toggle-off");
  iconToggleOnList = newIconToggleOnList;
  iconToggleOffList = newIconToggleOffList;
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

  // update iconToggleOnList and iconToggleOffList
  const newIconToggleOnList = outputBoxes.querySelectorAll("#icon-toggle-on");
  const newIconToggleOffList = outputBoxes.querySelectorAll("#icon-toggle-off");
  iconToggleOnList = newIconToggleOnList;
  iconToggleOffList = newIconToggleOffList;
};

iconCopy.addEventListener("click", copyText);

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