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

  alert("text copied to clipboard");
  // Show the copied text
  // const tooltip = document.getElementById("myTooltip");
  // tooltip.innerHTML = "Copied: " + copiedText;
}

module.exports = {
  copyText,
};
