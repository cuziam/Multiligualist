class InputConfig {
  constructor(srcLang, srcText) {
    this.srcLang = srcLang;
    this.srcText = srcText;
  }
  setLangText(srcLang, srcText) {
    this.srcLang = srcLang;
    this.srcText = srcText;
  }
  getLangText() {
    return {
      srcLang: this.srcLang,
      srcText: this.srcText,
    };
  }
}

class outputConfigs {
  constructor() {
    this.outputConfigs = [];
  }

  addOutputConfig(state, targetLang, targetTool, targetText) {
    this.outputConfigs.push({
      state: state,
      targetLang: targetLang,
      targetTool: targetTool,
      targetText: targetText,
    });
  }

  getOutputConfigs() {
    return this.outputConfigs;
  }
}

const { supportedLangs, supportedTools } = require("./supported-languages");

//클라이언트가 담당하는 정보를 담은 Model.
class ClientModel {
  constructor() {
    this.userInfo = {}; //저장된 유저정보에 따라 변경될 예정.
    this.region = {}; //저장된 지역정보에 따라 변경될 예정.
    this.inputConfig = {};
    this.outputConfigs = [];
    this.initializeConfigs();
  }

  initializeConfigs() {
    //임시로 작성!!!!
    this.inputConfig = {
      srcLang: document.querySelector("#input-box .chosen-lang").textContent,
      srcText:
        document.querySelector("#input-box #input-box-textarea").value || "",
      //srcLang 지원 언어는 papago의 지원 언어로 고정
      supportedLangs: supportedLangs[papago].supportedPairs.map(
        (pair) => pair[0]
      ),
    };

    // 박스의 종류와 언어, 번역기를 저장
    const boxList = document.querySelectorAll(
      ".output-box-toggle-on, .output-box-toggle-off"
    );
    const targetLangs = document.querySelectorAll(
      ".output-box-toggle-on .chosen-lang, .output-box-toggle-off .chosen-lang"
    );
    const targetTools = document.querySelectorAll(
      ".output-box-toggle-on .chosen-tool, .output-box-toggle-off .chosen-tool"
    );
    targetLangs.forEach((lang, index) => {
      this.outputConfigs[index] = {
        state: boxList[index].classList.contains("output-box-toggle-on")
          ? "on"
          : "off",
        targetLang: lang.textContent,
        targetTool: targetTools[index].textContent,
        targetText: "",
      };
    });
    console.log(this.outputConfigs);
  }

  getConfigs() {
    return {
      inputConfig: this.inputConfig,
      outputConfigs: this.outputConfigs,
    };
  }

  setConfig(configIndex, key, newValue) {
    if (configIndex !== null && configIndex !== undefined) {
      // Create a new object for immutability
      this.outputConfigs[configIndex] = {
        ...this.outputConfigs[configIndex],
        [key]: newValue,
      };
    } else {
      // Create a new object for immutability
      this.inputConfig = { ...this.inputConfig, [key]: newValue };
    }
  }

  setOutputConfigTargetText(targetLang, targetTool, targetText) {
    this.outputConfigs.forEach((outputConfig) => {
      if (
        outputConfig.targetLang === targetLang &&
        outputConfig.targetTool === targetTool
      ) {
        outputConfig.targetText = targetText;
      }
    });
  }
}
module.exports = ClientModel;
