const iconCopy = document.querySelector("#icon-copy");
const iconHistory = document.querySelector("#icon-history");
const tooltip = document.querySelector(".tooltip");

const iconToggleOnList = document.querySelectorAll("#icon-toggle-on");
const iconToggleOffList = document.querySelectorAll("#icon-toggle-off");

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
// let tooltipIntervalId = null;

// function startTooltipInterval() {
//   tooltipIntervalId = setInterval(() => {
//     // 아이콘 요소의 위치와 크기를 가져옴
//     const iconRect = iconCopy.getBoundingClientRect();

//     // 작은 설명창의 내용을 설정
//     tooltip.textContent = iconCopy.dataset.tooltip;

//     // 작은 설명창을 표시하고, 아이콘 요소의 위치에 배치
//     tooltip.style.display = "block";
//     tooltip.style.top = `${iconRect.top - tooltip.offsetHeight}px`;
//     tooltip.style.left = `${
//       iconRect.left + iconRect.width / 2 - tooltip.offsetWidth / 2
//     }px`;
//   }, 100);
// }

// function stopTooltipInterval() {
//   clearInterval(tooltipIntervalId);
//   tooltip.style.display = "none";
// }

iconCopy.addEventListener("click", copyText);
// iconCopy.addEventListener("mouseover", startTooltipInterval);
// iconCopy.addEventListener("mouseout", stopTooltipInterval);

//toggle function
iconToggleOnList.forEach((iconToggleOn) => {
  iconToggleOn.addEventListener("click", () => {
    const outputBoxes = iconToggleOn.closest("#output-boxes");

    //1. Hide output-box-toggle-on
    iconToggleOn.closest(".output-box-toggle-on").classList.add("hidden");
    //2. show output-box-toggle-off
  });
});
