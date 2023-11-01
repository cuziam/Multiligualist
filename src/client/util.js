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

module.exports = {
  copyText,
};
