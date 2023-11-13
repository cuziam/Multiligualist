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
    this.inputConfig = {
      srcLang: document.querySelector("#input-box .chosen-lang").textContent,
      srcText:
        document.querySelector("#input-box #input-box-textarea").value || "",
      //srcLang 지원 언어는 deepL의 지원 언어로 임시로 고정
      supportedSrcLangs: supportedLangs.deepL.srcLangs.sort(),
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
        supportedTargetLangs: supportedLangs.deepL.targetLangs.sort(),
        supportedTargetTools: supportedTools.sort(),
      };
    });
    console.log(this.inputConfig, this.outputConfigs);
  }

  getConfigs() {
    return {
      inputConfig: this.inputConfig,
      outputConfigs: this.outputConfigs,
    };
  }

  getInputConfig() {
    return this.inputConfig;
  }

  getOutputConfigs() {
    return this.outputConfigs;
  }

  updateInputConfig(key, newValue) {
    if (!this.inputConfig[key]) {
      console.log("key not found");
      return;
    }
    this.inputConfig[key] = newValue;
  }
  updateOutputConfig(configIndex, key, newValue) {
    console.log(this.outputConfigs);
    if (!this.outputConfigs[configIndex][key]) {
      console.log("key not found");
      return;
    }
    this.outputConfigs[configIndex][key] = newValue;
  }
  setConfig(index, config) {
    if (!config) return;

    if (index === undefined || index === null) {
      this.inputConfig = config;
    } else {
      this.outputConfigs[index] = config;
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
