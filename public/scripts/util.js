const iconCopyList = document.querySelectorAll("#icon-copy");
const iconHistory = document.querySelector("#icon-history");

const iconLanguageSelectList = document.querySelectorAll(
  ".icon-language-select"
);
const iconTranslatorSelectList = document.querySelectorAll(
  ".icon-translator-select"
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

// Window click 이벤트 리스너는 한 번만 추가합니다.
let isWindowClickListenerActive = false;

function showLangDropdown(iconLanguageSelect) {
  console.log("icon-language-select clicked!");

  // Chosen Language
  const chosenLang =
    iconLanguageSelect.parentNode.querySelector(".chosen-lang").textContent;

  // Deepcopy of Dropdown Element
  const dropdownEle = document.querySelector(".lang-dropdown").cloneNode(true);

  // Style for the Chosen Language
  const chosenLangEle = dropdownEle.querySelector(
    `[data-lang="${chosenLang}"]`
  );
  if (chosenLangEle) {
    chosenLangEle.style.color = "var(--brand-second-color)";
    chosenLangEle.style.fontWeight = "bold";
  }

  // Dropdown Styles
  dropdownEle.style.display = "flex";
  dropdownEle.style.position = "absolute";

  // Insert the Dropdown
  const closestBox =
    iconLanguageSelect.closest(".output-box-toggle-on") ||
    iconLanguageSelect.closest("#input-box");
  closestBox
    .querySelector(".box-text")
    .insertAdjacentElement("afterend", dropdownEle);

  // Event Delegation for Dropdown Items
  dropdownEle.addEventListener("click", (e) => {
    if (e.target.matches("[data-lang]")) {
      console.log("child clicked!");
      iconLanguageSelect
        .closest(".language-container")
        .querySelector(".chosen-lang").textContent = e.target.textContent;
      dropdownEle.remove();
    }
  });

  // Click Outside to Remove Dropdown
  if (!isWindowClickListenerActive) {
    window.addEventListener("click", (e) => {
      if (!e.target.matches(".lang-dropdown div, .icon-language-select")) {
        dropdownEle.remove();
      }
    });
    isWindowClickListenerActive = true; // 이제 이 리스너는 활성화되었음을 표시
  }
}

// function showLangDropdown(iconLanguageSelect) {
//   console.log("icon-language-select clicked!");
//   const choosenLang =
//     iconLanguageSelect.parentNode.querySelector(".choosen-lang").textContent; //get the language that user choose
//   const dropdownEle = document.querySelector(".lang-dropdown").cloneNode(true); //get the deepcopy of dropdown element

//   //find the text equal to the language that user choose and change the style of the text to bold
//   const choosenLangEle = dropdownEle.querySelector(`#${choosenLang}`);
//   choosenLangEle.style.color = "var(--brand-second-color)";
//   choosenLangEle.style.fontWeight = "bold";

//   dropdownEle.style.display = "flex"; //change the style of dropdown to display flex
//   dropdownEle.style.position = "absolute"; //change the style of dropdown to position absolute

//   //insert the dropdown element to the position of .box-text
//   const closestBox =
//     iconLanguageSelect.closest(".output-box-toggle-on") ||
//     iconLanguageSelect.closest("#input-box");
//   closestBox
//     .querySelector(".box-text")
//     .insertAdjacentElement("afterend", dropdownEle);

//   //add event listener to each language element
//   dropdownEle.childNodes.forEach((languageEle) => {
//     //if user click on the language element, the choosen language will be changed
//     languageEle.addEventListener("click", () => {
//       console.log("child clicked!");
//       iconLanguageSelect.parentNode.querySelector(".choosen-lang").textContent =
//         languageEle.textContent;
//       //remove the dropdown element
//       dropdownEle.remove();
//     });
//   });

//   //if user click outside the dropdown element, the dropdown element will disappear
//   window.addEventListener("click", (e) => {
//     if (
//       !e.target.matches(".lang-dropdown div") &&
//       !e.target.matches(".icon-language-select")
//     ) {
//       dropdownEle.remove();
//     }
//   });
// }

function showTransDropdown(iconTranslatorSelect) {
  console.log("icon-translator-select clicked!");
  const choosenTool = iconTranslatorSelect.parentNode
    .querySelector(".choosen-tool")
    .textContent.split(" ")
    .join("-"); //get the id of choosen tool that use choose
  console.log(choosenTool);
  const dropdown = document.querySelector(".tool-dropdown").cloneNode(true); //get the deepcopy of dropdown element
  //find the text equal to the language that user choose
  dropdown.querySelector(`#${choosenTool}`).style.color =
    "var(--brand-second-color)";
  //change the style of the text to bold
  dropdown.querySelector(`#${choosenTool}`).style.fontWeight = "bold";
  dropdown.style.display = "flex"; //change the style of dropdown to display flex
  dropdown.style.position = "absolute"; //change the style of dropdown to position absolute

  //insert the dropdown element to the position of .box-text
  iconTranslatorSelect
    .closest(".output-box-toggle-on")
    .querySelector(".box-text")
    .insertAdjacentElement("afterend", dropdown);
}

//main event listeners
window.addEventListener("load", () => {
  zoomWindow(window);
});

iconLanguageSelectList.forEach((iconLanguageSelect) => {
  iconLanguageSelect.addEventListener("click", () => {
    showLangDropdown(iconLanguageSelect);
  });
});

iconTranslatorSelectList.forEach((iconTranslatorSelect) => {
  iconTranslatorSelect.addEventListener("click", () => {
    showTransDropdown(iconTranslatorSelect);
  });
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
