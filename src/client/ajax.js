const managers = require("./managers");
const axios = require("axios");

const stateManager = new managers.StateManager();
const states = stateManager.getState();
console.log(states);
