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

/***/ "./src/client/Client.ts":
/*!******************************!*\
  !*** ./src/client/Client.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/client/Utils.ts\");\nModule.register(\"MMM-Jast\", {\n    defaults: {\n        header: null,\n        updateIntervalInSeconds: 600,\n        fadeSpeedInSeconds: 3.5,\n        stocks: [\n            { name: \"BASF\", symbol: \"BAS.DE\", quantity: 100 },\n            { name: \"SAP\", symbol: \"SAP.DE\", quantity: 200 },\n            { name: \"Henkel\", symbol: \"HEN3.DE\" },\n            { name: \"AbbVie\", symbol: \"4AB.DE\" },\n            { name: \"Bitcoin\", symbol: \"BTC-EUR\" },\n            { name: \"Alibaba\", symbol: \"BABA\" }\n        ],\n        scroll: \"vertical\",\n        maxWidth: \"100%\",\n        numberDecimalsValues: 2,\n        numberDecimalsPercentages: 1,\n        showCurrency: true,\n        showChangePercent: true,\n        showChangeValue: false,\n        showChangeValueCurrency: false,\n        showDepotGrowth: false\n    },\n    getStyles() {\n        return [\"MMM-Jast.css\"];\n    },\n    getTranslations() {\n        return {\n            en: \"translations/en.json\",\n            de: \"translations/de.json\"\n        };\n    },\n    getTemplate() {\n        return \"templates/MMM-Jast.njk\";\n    },\n    getTemplateData() {\n        return {\n            config: this.config,\n            stocks: this.stocks,\n            utils: Utils_1.default\n        };\n    },\n    getHeader() {\n        return this.config.header;\n    },\n    start() {\n        // Override defaults\n        this.nunjucksEnvironment().loaders[0].async = false;\n        this.nunjucksEnvironment().loaders[0].useCache = true;\n        this.stocks = [];\n        this.loadData();\n        this.scheduleUpdate();\n        this.updateDom();\n    },\n    scheduleUpdate() {\n        const self = this;\n        this.config.updateIntervalInSeconds = this.config.updateIntervalInSeconds < 120 ? 120 : this.config.updateIntervalInSeconds;\n        setInterval(() => {\n            self.loadData();\n        }, this.config.updateIntervalInSeconds * 1000);\n    },\n    loadData() {\n        this.sendSocketNotification(\"GET_STOCKS\", this.config);\n    },\n    socketNotificationReceived(notificationIdentifier, payload) {\n        if (notificationIdentifier === \"STOCKS_RESULT\") {\n            this.stocks = payload;\n            this.updateDom();\n            console.log(\"Stock results\", this.stocks);\n        }\n    }\n});\n\n\n//# sourceURL=webpack://mmm-jast/./src/client/Client.ts?");

/***/ }),

/***/ "./src/client/Utils.ts":
/*!*****************************!*\
  !*** ./src/client/Utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass JastUtils {\n    static getStockChange(stock, config) {\n        var _a;\n        return Number(((_a = stock.price) === null || _a === void 0 ? void 0 : _a.regularMarketChange).toFixed(config.numberDecimalsValues)) || 0;\n    }\n    static getStockChangePercent(stock, config) {\n        var _a;\n        return Number((((_a = stock.price) === null || _a === void 0 ? void 0 : _a.regularMarketChangePercent) * 100).toFixed(config.numberDecimalsPercentages)) || 0;\n    }\n    static getCurrentValue(stock, config) {\n        var _a, _b;\n        return Number((_b = (_a = stock.price) === null || _a === void 0 ? void 0 : _a.regularMarketPrice) === null || _b === void 0 ? void 0 : _b.toFixed(config.numberDecimalsValues)) || 0;\n    }\n    static getCurrency(stock) {\n        var _a;\n        return ((_a = stock.summaryDetail) === null || _a === void 0 ? void 0 : _a.currency) || \"?\";\n    }\n    static getStockName(stock) {\n        return stock.meta.name || stock.price.longName;\n    }\n    static getDepotGrowth(stocks, config) {\n        var _a, _b;\n        let depotGrowth = [];\n        for (const stock of stocks) {\n            try {\n                const configStock = (_a = config.stocks) === null || _a === void 0 ? void 0 : _a.find(current => { var _a; return current.symbol === ((_a = stock.meta) === null || _a === void 0 ? void 0 : _a.symbol); });\n                if (configStock === null || configStock === void 0 ? void 0 : configStock.quantity) {\n                    const growthForStock = ((_b = stock.price) === null || _b === void 0 ? void 0 : _b.regularMarketChange) * configStock.quantity;\n                    const existingCurrency = depotGrowth.find(growth => growth.currency === stock.price.currency);\n                    if (existingCurrency) {\n                        existingCurrency.value = existingCurrency.value + growthForStock;\n                    }\n                    else {\n                        depotGrowth.push({ value: growthForStock, currency: stock.price.currency });\n                    }\n                }\n            }\n            catch (err) {\n                console.warn('There was a problem calculating the detpot growth', err);\n            }\n        }\n        depotGrowth.forEach(growth => {\n            growth.value = Number(growth.value.toFixed(config.numberDecimalsValues));\n        });\n        return depotGrowth;\n    }\n}\nexports.default = JastUtils;\n\n\n//# sourceURL=webpack://mmm-jast/./src/client/Utils.ts?");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/Client.ts");
/******/ 	
/******/ })()
;