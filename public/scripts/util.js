const iconCopyList = document.querySelectorAll("#icon-copy");
const iconHistory = document.querySelector("#icon-history");

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

// zoom window along with screen resolution
function zoomWindow(window) {
  let width = window.innerWidth;

  if (width >= 2560 && width < 3840) {
    // QHD resolution
    document.body.style.zoom = "150%"; // zoom 150%
  } else if (width >= 3840) {
    // 4K resolution
    document.body.style.zoom = "200%"; // zoom 200%
  }
}

function copyText(iconCopy) {
  // Copy text to clipboard
  const boxElement =
    iconCopy.closest("#input-box") || iconCopy.closest(".output-box-toggle-on");
  const boxTextElement = boxElement.querySelector(".box-text");
  console.log(boxTextElement);
  let copiedText;
  if (boxTextElement.tagName === "TEXTAREA") {
    copiedText = boxTextElement.value;
  } else {
    copiedText = boxTextElement.textContent;
  }
  navigator.clipboard.writeText(copiedText);

  //show info of copied text
  const numOfCopiedText = copiedText.length;
  const sampleText = copiedText.slice(0, 30).concat("...");
  console.log("copy text: ", sampleText);
  console.log("copied text length: ", numOfCopiedText);
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

//main event listeners
window.addEventListener("load", () => {
  zoomWindow(window);
});

iconCopyList.forEach((iconCopy) => {
  iconCopy.addEventListener("click", () => {
    copyText(iconCopy);
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
