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

//copy이미지를 누르면 부모 요소 중에 box-text 클래스를 찾는다.
//거기에 담긴 텍스트를 복사한다.
function copyText() {
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

iconCopy.addEventListener("click", copyText);

const toggleOff = (iconToggleOn) => {
  const outputBoxes = iconToggleOn.closest("#output-boxes");
  const closestOutputBoxToggleOn = iconToggleOn.closest(
    ".output-box-toggle-on"
  );

  // Search closest lang-tool-select of output-box-toggle-on
  const prevLangToolSelect = closestOutputBoxToggleOn.querySelector(
    ".language-tool-select"
  );

  // Hide closest output-box-toggle-on
  closestOutputBoxToggleOn.classList.add("hidden");

  // load new output-box-toggle-off & change contents in output-box-toggle-off to match output-box-toggle-on
  const newOutputBoxToggleOff = outputBoxToggleOff.cloneNode(true);
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

iconToggleOnList.forEach((iconToggleOn) => {
  iconToggleOn.addEventListener("click", () => {
    toggleOff(iconToggleOn);
  });
});

const toggleOn = (iconToggleOff) => {
  const outputBoxes = iconToggleOff.closest("#output-boxes");
  const closestOutputBoxToggleOff = iconToggleOff.closest(
    ".output-box-toggle-off"
  );

  // Search closest lang-tool-select of output-box-toggle-off
  const prevLangToolSelect = closestOutputBoxToggleOff.querySelector(
    ".language-tool-select"
  );

  // Hide closest output-box-toggle-off
  closestOutputBoxToggleOff.classList.add("hidden");

  // load new output-box-toggle-on & change contents in output-box-toggle-on to match output-box-toggle-off
  const newOutputBoxToggleOn = outputBoxToggleOn.cloneNode(true);
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

iconToggleOffList.forEach((iconToggleOff) => {
  iconToggleOff.addEventListener("click", () => {
    toggleOn(iconToggleOff);
  });
});
