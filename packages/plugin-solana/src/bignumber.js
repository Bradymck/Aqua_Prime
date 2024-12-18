"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BN = void 0;
exports.toBN = toBN;
var bignumber_js_1 = require("bignumber.js");
// Re-export BigNumber constructor
exports.BN = bignumber_js_1.default;
// Helper function to create new BigNumber instances
function toBN(value) {
    return new bignumber_js_1.default(value);
}
