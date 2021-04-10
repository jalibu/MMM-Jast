/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/Server.ts":
/*!******************************!*\
  !*** ./src/server/Server.ts ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst NodeHelper = __webpack_require__(/*! node_helper */ \"node_helper\");\nconst yahoo_finance2_1 = __webpack_require__(/*! yahoo-finance2 */ \"yahoo-finance2\");\nmodule.exports = NodeHelper.create({\n    start() {\n        console.log(`${this.name} helper method started...`);\n    },\n    requestStocks(config) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let results = [];\n            for (const stock of config.stocks) {\n                try {\n                    const { summaryDetail, price } = yield yahoo_finance2_1.default.quoteSummary(stock.symbol);\n                    if (summaryDetail && price) {\n                        const meta = {\n                            symbol: stock.symbol,\n                            name: stock.name,\n                            quantity: stock.quantity\n                        };\n                        results.push({ summaryDetail, price, meta });\n                    }\n                }\n                catch (err) {\n                    console.error(\"There was an error requesting the API.\", err.message);\n                }\n            }\n            return results;\n        });\n    },\n    socketNotificationReceived(notification, config) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (notification) {\n                const stocks = yield this.requestStocks(config);\n                this.sendSocketNotification(\"STOCKS_RESULT\", stocks);\n            }\n            else {\n                console.warn(`${notification} is invalid notification`);\n            }\n        });\n    }\n});\n\n\n//# sourceURL=webpack://mmm-jast/./src/server/Server.ts?");

/***/ }),

/***/ "node_helper":
/*!******************************!*\
  !*** external "node_helper" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node_helper");;

/***/ }),

/***/ "yahoo-finance2":
/*!*********************************!*\
  !*** external "yahoo-finance2" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("yahoo-finance2");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/Server.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;