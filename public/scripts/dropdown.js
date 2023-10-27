const iconLanguageSelectList = document.querySelectorAll(
  ".icon-language-select"
);
const iconTranslatorSelectList = document.querySelectorAll(
  ".icon-translator-select"
);

let currentDropdown = null;

function showLangDropdown(iconLanguageSelect) {
  console.log("icon-language-select clicked!");
  // Remove any existing dropdown
  if (currentDropdown) {
    currentDropdown.remove();
  }
  // Null check for chosen language
  const chosenLangEle =
    iconLanguageSelect.parentNode.querySelector(".chosen-lang");
  if (!chosenLangEle) {
    console.error("Chosen language element not found");
    return;
  }
  const chosenLang = chosenLangEle.textContent;
  // Null check for dropdown element
  const originalDropdown = document.querySelector(".lang-dropdown");
  if (!originalDropdown) {
    console.error("Dropdown element not found");
    return;
  }
  const dropdownEle = originalDropdown.cloneNode(true); // Deep copy

  // Null check for chosen language in dropdown
  const targetLangEle = dropdownEle.querySelector(`#${chosenLang}`);
  if (!targetLangEle) {
    console.error("Target language element not found in dropdown");
    return;
  }
  // Style modification using class instead of direct style changes
  targetLangEle.classList.add("highlighted-language");

  // Layout adjustments
  dropdownEle.style.display = "flex";
  dropdownEle.style.position = "absolute";
  dropdownEle.style.top = 0;
  dropdownEle.style.left = 0;

  // Determine insertion point
  const closestBox =
    iconLanguageSelect.closest(".output-box-toggle-on") ||
    iconLanguageSelect.closest("#input-box") ||
    iconLanguageSelect.closest(".output-box-toggle-off");
  closestBox.style.position = "relative";
  console.log("closestBox", closestBox);
  if (!closestBox) {
    console.error("No closest box found");
    return;
  }

  // Insert dropdown
  if (closestBox.className === "output-box-toggle-off") {
    closestBox
      .querySelector(".output-lang-select")
      .insertAdjacentElement("afterend", dropdownEle);
  } else {
    closestBox
      .querySelector(".box-text")
      .insertAdjacentElement("afterend", dropdownEle);
  }
  // Update the current dropdown
  currentDropdown = dropdownEle;

  // Add event listener to each language element in dropdown
  dropdownEle.querySelectorAll(".language-option").forEach((languageEle) => {
    languageEle.addEventListener("click", () => {
      console.log("child clicked!");
      chosenLangEle.textContent = languageEle.textContent;
      dropdownEle.remove();
    });
  });
}

//show translator dropdown
function showTransDropdown(iconTranslatorSelect) {
  console.log("icon-translator-select clicked!");
  // Remove any existing dropdown
  if (currentDropdown) {
    currentDropdown.remove();
  }
  // Null check for chosen language
  const chosenToolEle =
    iconTranslatorSelect.parentNode.querySelector(".chosen-tool");
  if (!chosenToolEle) {
    console.error("Chosen tool element not found");
    return;
  }
  const chosenTool = chosenToolEle.textContent;
  // Null check for dropdown element
  const originalDropdown = document.querySelector(".tool-dropdown");
  if (!originalDropdown) {
    console.error("Dropdown element not found");
    return;
  }
  const dropdownEle = originalDropdown.cloneNode(true); // Deep copy

  // Null check for chosen language in dropdown
  const targetToolEle = dropdownEle.querySelector(`#${chosenTool}`);
  if (!targetToolEle) {
    console.error("Target language element not found in dropdown");
    return;
  }
  // Style modification using class instead of direct style changes
  targetToolEle.classList.add("highlighted-tool");

  // Layout adjustments
  dropdownEle.style.display = "flex";
  dropdownEle.style.position = "absolute";
  dropdownEle.style.top = 0;
  dropdownEle.style.left = 0;

  // Determine insertion point
  const closestBox =
    iconTranslatorSelect.closest(".output-box-toggle-on") ||
    iconTranslatorSelect.closest("#input-box") ||
    iconTranslatorSelect.closest(".output-box-toggle-off");
  closestBox.style.position = "relative";
  console.log("closestBox", closestBox);
  if (!closestBox) {
    console.error("No closest box found");
    return;
  }

  // Insert dropdown
  if (closestBox.className === "output-box-toggle-off") {
    closestBox
      .querySelector(".output-lang-select")
      .insertAdjacentElement("afterend", dropdownEle);
  } else {
    closestBox
      .querySelector(".box-text")
      .insertAdjacentElement("afterend", dropdownEle);
  }
  // Update the current dropdown
  currentDropdown = dropdownEle;

  // Add event listener to each language element in dropdown
  dropdownEle
    .querySelectorAll(".translator-option")
    .forEach((translatorEle) => {
      translatorEle.addEventListener("click", () => {
        console.log("child clicked!");
        chosenToolEle.textContent = translatorEle.textContent;
        dropdownEle.remove();
      });
    });
}
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
