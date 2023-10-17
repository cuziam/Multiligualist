const iconCopy = document.getElementById("icon-copy");

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
