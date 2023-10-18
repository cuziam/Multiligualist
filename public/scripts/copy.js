const iconCopy = document.querySelector("#icon-copy");
const iconHistory = document.getElementById("icon-history");
const tooltip = document.querySelector(".tooltip");

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

function showTooltip() {
  // 일정 시간이 지난 후에 작은 설명창을 표시
  setTimeout(() => {
    // 아이콘 요소의 위치와 크기를 가져옴
    const iconRect = iconCopy.getBoundingClientRect();

    // 작은 설명창의 내용을 설정
    tooltip.textContent = iconCopy.dataset.tooltip;

    // 작은 설명창을 표시하고, 아이콘 요소의 위치에 배치
    tooltip.style.display = "block";
    tooltip.style.top = `${iconRect.top - tooltip.offsetHeight}px`;
    tooltip.style.left = `${
      iconRect.left + iconRect.width / 2 - tooltip.offsetWidth / 2
    }px`;
  }, 1000); // 1초 후에 작은 설명창을 표시
}

function hideTooltip() {
  tooltip.style.display = "none";
}

iconCopy.addEventListener("click", copyText);
iconCopy.addEventListener("mouseover", showTooltip);
iconCopy.addEventListener("mouseout", hideTooltip);
