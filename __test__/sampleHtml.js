const sampleHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../public/styles/default.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Righteous&display=swap"
      rel="stylesheet"
    />
    <script src="../public/dist/bundle.js" defer></script>
    <title>Translators</title>
    <link
      rel="icon"
      href="/public/images/icons/favicon.ico"
      type="image/x-icon"
    />
  </head>
  <body>
    <header>
  <div id="header-nav">
    <div id="header-logo">
      <img src="../public/images/icons/logo.png" id="header-logo-no-bg" />
      <div id="header-logo-text">Translators</div>
    </div>
    <img src="../public/images/icons/icon-settings.svg" id="icon-settings" />
  </div>
</header>

    <main id="main-flex">
      <div id="input-box">
  <form action="/translate" method="post">
  <div class="box-input-lang-select">
    <div class="input-lang-select">
      <div class="select">
  <div class="chosen-lang">Korean</div>
  <svg
    id="icon-expand"
    class="icon-func icon-language-select"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>language selection</title>
  </svg>
</div>

      <svg
        id="icon-swap"
        class="icon-func"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M9.32 14.6666L4 20L9.32 25.3333V21.3333H18.6667V18.6666H9.32V14.6666ZM28 12L22.68 6.66663V10.6666H13.3333V13.3333H22.68V17.3333L28 12Z"
          fill="#525252"
        />
        <title>Language Change</title>
      </svg>
    </div>
  </form>
  </div>
  
    <textarea
      id="input-box-textarea"
      class="box-text"
      type="text"
      placeholder="Please enter what you want to translate..."
    ></textarea>
  </form>
  <div id="input-box-toolbar">
    <div class="tooltips">
      <svg
  class="icon-func"
  id="icon-copy"
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  fill="none"
>
  <path
    d="M22.5 2.5H11.25C9.875 2.5 8.75 3.625 8.75 5V20C8.75 21.375 9.875 22.5 11.25 22.5H22.5C23.875 22.5 25 21.375 25 20V5C25 3.625 23.875 2.5 22.5 2.5ZM22.5 20H11.25V5H22.5V20ZM3.75 18.75V16.25H6.25V18.75H3.75ZM3.75 11.875H6.25V14.375H3.75V11.875ZM12.5 25H15V27.5H12.5V25ZM3.75 23.125V20.625H6.25V23.125H3.75ZM6.25 27.5C4.875 27.5 3.75 26.375 3.75 25H6.25V27.5ZM10.625 27.5H8.125V25H10.625V27.5ZM16.875 27.5V25H19.375C19.375 26.375 18.25 27.5 16.875 27.5ZM6.25 7.5V10H3.75C3.75 8.625 4.875 7.5 6.25 7.5Z"
    fill="#525252"
  />
  <title>Copy</title>
</svg>
 <svg
  id="icon-history"
  class="icon-func"
  data-tooltip="Show history"
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  fill="none"
>
  <path
    d="M15 30C11.1667 30 7.82639 28.7292 4.97917 26.1875C2.13194 23.6458 0.5 20.4722 0.0833333 16.6667H3.5C3.88889 19.5556 5.17361 21.9444 7.35417 23.8333C9.53472 25.7222 12.0833 26.6667 15 26.6667C18.25 26.6667 21.0069 25.5347 23.2708 23.2708C25.5347 21.0069 26.6667 18.25 26.6667 15C26.6667 11.75 25.5347 8.99306 23.2708 6.72917C21.0069 4.46528 18.25 3.33333 15 3.33333C13.0833 3.33333 11.2917 3.77778 9.625 4.66667C7.95833 5.55556 6.55556 6.77778 5.41667 8.33333H10V11.6667H0V1.66667H3.33333V5.58333C4.75 3.80556 6.47917 2.43056 8.52083 1.45833C10.5625 0.486111 12.7222 0 15 0C17.0833 0 19.0347 0.395833 20.8542 1.1875C22.6736 1.97917 24.2569 3.04861 25.6042 4.39583C26.9514 5.74306 28.0208 7.32639 28.8125 9.14583C29.6042 10.9653 30 12.9167 30 15C30 17.0833 29.6042 19.0347 28.8125 20.8542C28.0208 22.6736 26.9514 24.2569 25.6042 25.6042C24.2569 26.9514 22.6736 28.0208 20.8542 28.8125C19.0347 29.6042 17.0833 30 15 30ZM19.6667 22L13.3333 15.6667V6.66667H16.6667V14.3333L22 19.6667L19.6667 22Z"
    fill="#525252"
  />
  <title>history</title>
</svg>

    </div>
    <button id="btn-translate">Translate</button>
  </div>
</div>

      <div id="output-boxes">
         <div class="output-box-toggle-on">
  <div class="box-output-lang-select">
    <div class="output-lang-select">
      <div class="language-tool-select">
        <div class="select">
  <div class="chosen-lang">Korean</div>
  <svg
    id="icon-expand"
    class="icon-func icon-language-select"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>Language Selection</title>
  </svg>
</div>
<div class="select">
  <div class="chosen-tool">Papago</div>
  <svg
    id="icon-expand"
    class="icon-func icon-translator-select"
    data-tooltip="Translator Selection"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>Translator Selection</title>
  </svg>
</div>

      </div>
      <svg
        id="icon-toggle-on"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M28.415 11.6667H11.8649C7.29707 11.6667 3.58984 15.4 3.58984 20C3.58984 24.6 7.29707 28.3334 11.8649 28.3334H28.415C32.9828 28.3334 36.6901 24.6 36.6901 20C36.6901 15.4 32.9828 11.6667 28.415 11.6667ZM28.415 25C25.6677 25 23.45 22.7667 23.45 20C23.45 17.2334 25.6677 15 28.415 15C31.1623 15 33.3801 17.2334 33.3801 20C33.3801 22.7667 31.1623 25 28.415 25Z"
          fill="#38C876"
        />
        <title>Toggle</title>
      </svg>
    </div>
  </div>
  <div class="box-text">this is dummy text.</div>
  <div class="box-toolbar">
    <div class="tooltips">
      <svg
  class="icon-func"
  id="icon-copy"
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  fill="none"
>
  <path
    d="M22.5 2.5H11.25C9.875 2.5 8.75 3.625 8.75 5V20C8.75 21.375 9.875 22.5 11.25 22.5H22.5C23.875 22.5 25 21.375 25 20V5C25 3.625 23.875 2.5 22.5 2.5ZM22.5 20H11.25V5H22.5V20ZM3.75 18.75V16.25H6.25V18.75H3.75ZM3.75 11.875H6.25V14.375H3.75V11.875ZM12.5 25H15V27.5H12.5V25ZM3.75 23.125V20.625H6.25V23.125H3.75ZM6.25 27.5C4.875 27.5 3.75 26.375 3.75 25H6.25V27.5ZM10.625 27.5H8.125V25H10.625V27.5ZM16.875 27.5V25H19.375C19.375 26.375 18.25 27.5 16.875 27.5ZM6.25 7.5V10H3.75C3.75 8.625 4.875 7.5 6.25 7.5Z"
    fill="#525252"
  />
  <title>Copy</title>
</svg>
 <svg
  id="icon-history"
  class="icon-func"
  data-tooltip="Show history"
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  fill="none"
>
  <path
    d="M15 30C11.1667 30 7.82639 28.7292 4.97917 26.1875C2.13194 23.6458 0.5 20.4722 0.0833333 16.6667H3.5C3.88889 19.5556 5.17361 21.9444 7.35417 23.8333C9.53472 25.7222 12.0833 26.6667 15 26.6667C18.25 26.6667 21.0069 25.5347 23.2708 23.2708C25.5347 21.0069 26.6667 18.25 26.6667 15C26.6667 11.75 25.5347 8.99306 23.2708 6.72917C21.0069 4.46528 18.25 3.33333 15 3.33333C13.0833 3.33333 11.2917 3.77778 9.625 4.66667C7.95833 5.55556 6.55556 6.77778 5.41667 8.33333H10V11.6667H0V1.66667H3.33333V5.58333C4.75 3.80556 6.47917 2.43056 8.52083 1.45833C10.5625 0.486111 12.7222 0 15 0C17.0833 0 19.0347 0.395833 20.8542 1.1875C22.6736 1.97917 24.2569 3.04861 25.6042 4.39583C26.9514 5.74306 28.0208 7.32639 28.8125 9.14583C29.6042 10.9653 30 12.9167 30 15C30 17.0833 29.6042 19.0347 28.8125 20.8542C28.0208 22.6736 26.9514 24.2569 25.6042 25.6042C24.2569 26.9514 22.6736 28.0208 20.8542 28.8125C19.0347 29.6042 17.0833 30 15 30ZM19.6667 22L13.3333 15.6667V6.66667H16.6667V14.3333L22 19.6667L19.6667 22Z"
    fill="#525252"
  />
  <title>history</title>
</svg>

    </div>
  </div>
</div>
  <div class="output-box-toggle-on">
  <div class="box-output-lang-select">
    <div class="output-lang-select">
      <div class="language-tool-select">
        <div class="select">
  <div class="chosen-lang">Korean</div>
  <svg
    id="icon-expand"
    class="icon-func icon-language-select"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>Language Selection</title>
  </svg>
</div>
<div class="select">
  <div class="chosen-tool">Papago</div>
  <svg
    id="icon-expand"
    class="icon-func icon-translator-select"
    data-tooltip="Translator Selection"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>Translator Selection</title>
  </svg>
</div>

      </div>
      <svg
        id="icon-toggle-on"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M28.415 11.6667H11.8649C7.29707 11.6667 3.58984 15.4 3.58984 20C3.58984 24.6 7.29707 28.3334 11.8649 28.3334H28.415C32.9828 28.3334 36.6901 24.6 36.6901 20C36.6901 15.4 32.9828 11.6667 28.415 11.6667ZM28.415 25C25.6677 25 23.45 22.7667 23.45 20C23.45 17.2334 25.6677 15 28.415 15C31.1623 15 33.3801 17.2334 33.3801 20C33.3801 22.7667 31.1623 25 28.415 25Z"
          fill="#38C876"
        />
        <title>Toggle</title>
      </svg>
    </div>
  </div>
  <div class="box-text">this is dummy text.</div>
  <div class="box-toolbar">
    <div class="tooltips">
      <svg
  class="icon-func"
  id="icon-copy"
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  fill="none"
>
  <path
    d="M22.5 2.5H11.25C9.875 2.5 8.75 3.625 8.75 5V20C8.75 21.375 9.875 22.5 11.25 22.5H22.5C23.875 22.5 25 21.375 25 20V5C25 3.625 23.875 2.5 22.5 2.5ZM22.5 20H11.25V5H22.5V20ZM3.75 18.75V16.25H6.25V18.75H3.75ZM3.75 11.875H6.25V14.375H3.75V11.875ZM12.5 25H15V27.5H12.5V25ZM3.75 23.125V20.625H6.25V23.125H3.75ZM6.25 27.5C4.875 27.5 3.75 26.375 3.75 25H6.25V27.5ZM10.625 27.5H8.125V25H10.625V27.5ZM16.875 27.5V25H19.375C19.375 26.375 18.25 27.5 16.875 27.5ZM6.25 7.5V10H3.75C3.75 8.625 4.875 7.5 6.25 7.5Z"
    fill="#525252"
  />
  <title>Copy</title>
</svg>
 <svg
  id="icon-history"
  class="icon-func"
  data-tooltip="Show history"
  xmlns="http://www.w3.org/2000/svg"
  width="30"
  height="30"
  viewBox="0 0 30 30"
  fill="none"
>
  <path
    d="M15 30C11.1667 30 7.82639 28.7292 4.97917 26.1875C2.13194 23.6458 0.5 20.4722 0.0833333 16.6667H3.5C3.88889 19.5556 5.17361 21.9444 7.35417 23.8333C9.53472 25.7222 12.0833 26.6667 15 26.6667C18.25 26.6667 21.0069 25.5347 23.2708 23.2708C25.5347 21.0069 26.6667 18.25 26.6667 15C26.6667 11.75 25.5347 8.99306 23.2708 6.72917C21.0069 4.46528 18.25 3.33333 15 3.33333C13.0833 3.33333 11.2917 3.77778 9.625 4.66667C7.95833 5.55556 6.55556 6.77778 5.41667 8.33333H10V11.6667H0V1.66667H3.33333V5.58333C4.75 3.80556 6.47917 2.43056 8.52083 1.45833C10.5625 0.486111 12.7222 0 15 0C17.0833 0 19.0347 0.395833 20.8542 1.1875C22.6736 1.97917 24.2569 3.04861 25.6042 4.39583C26.9514 5.74306 28.0208 7.32639 28.8125 9.14583C29.6042 10.9653 30 12.9167 30 15C30 17.0833 29.6042 19.0347 28.8125 20.8542C28.0208 22.6736 26.9514 24.2569 25.6042 25.6042C24.2569 26.9514 22.6736 28.0208 20.8542 28.8125C19.0347 29.6042 17.0833 30 15 30ZM19.6667 22L13.3333 15.6667V6.66667H16.6667V14.3333L22 19.6667L19.6667 22Z"
    fill="#525252"
  />
  <title>history</title>
</svg>

    </div>
  </div>
</div>
  <div class="output-box-toggle-off">
  <div class="output-lang-select">
    <div class="language-tool-select">
      <div class="select">
  <div class="chosen-lang">Korean</div>
  <svg
    id="icon-expand"
    class="icon-func icon-language-select"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>Language Selection</title>
  </svg>
</div>
<div class="select">
  <div class="chosen-tool">Papago</div>
  <svg
    id="icon-expand"
    class="icon-func icon-translator-select"
    data-tooltip="Translator Selection"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <mask
      id="mask0_89_190"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="40"
      height="40"
    >
      <rect width="40" height="40" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89_190)">
      <path
        d="M20 25.625L10 15.625L12.3333 13.2917L20 20.9584L27.6667 13.2917L30 15.625L20 25.625Z"
        fill="#525252"
      />
    </g>
    <title>Translator Selection</title>
  </svg>
</div>

    </div>
    <svg
      id="icon-toggle-off"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="M28.415 11.6666H11.8649C7.29707 11.6666 3.58984 15.4 3.58984 20C3.58984 24.6 7.29707 28.3333 11.8649 28.3333H28.415C32.9828 28.3333 36.6901 24.6 36.6901 20C36.6901 15.4 32.9828 11.6666 28.415 11.6666ZM11.8649 25C9.11758 25 6.89987 22.7666 6.89987 20C6.89987 17.2333 9.11758 15 11.8649 15C14.6122 15 16.8299 17.2333 16.8299 20C16.8299 22.7666 14.6122 25 11.8649 25Z"
        fill="#F25252"
      />
      <title>Toggle</title>
    </svg>
  </div>
</div>

      </div>
    </main>
    <div class="lang-dropdown">
  <div id="English" class="language-option">English</div>
  <div id="Spanish" class="language-option">Spanish</div>
  <div id="French" class="language-option">French</div>
  <div id="Chinese" class="language-option">Chinese</div>
  <div id="Korean" class="language-option">Korean</div>
  <div id="Japanese" class="language-option">Japanese</div>
  <div id="German" class="language-option">German</div>
</div>
 <div class="tool-dropdown">
  <div id="Google-Translator" class="translator-option">Google Translator</div>
  <div id="Papago" class="translator-option">Papago</div>
  <div id="DeepL" class="translator-option">DeepL</div>
</div>

    <footer></footer>
  </body>
</html>
`;

module.exports = sampleHtml;
