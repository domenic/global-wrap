"use strict";

module.exports = function () {
    window.testData = require("./helper") + "; typeof process is: " + typeof process;
};
