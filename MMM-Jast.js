/* global Class, JastUtils */
"use strict";

Module.register("MMM-Jast", {
  defaults: {
    debug: false,
    header: null,
    updateIntervalInSeconds: 0,
    requestIntervalInSeconds: 62,
    fadeSpeedInSeconds: 3.5, // Higher value: vertical -> faster // horizontal -> slower
    stocks: [
      { name: "BASF", symbol: "BAS.DE" },
      { name: "SAP", symbol: "SAP.DE" },
      { name: "Henkel", symbol: "HEN3.DE" },
      { name: "AbbVie", symbol: "4AB.DE" },
      {
        name: "Alibaba",
        symbol: "BABA",
        tradeCurrency: "USD",
        displayCurrency: "EUR",
        quantity: 10
      }
    ],
    crypto: [{ name: "BTC", symbol: "BTC" }],
    defaultCurrency: "EUR",
    baseURL: "https://www.alphavantage.co/",
    apiKey: "",
    scroll: "vertical",
    maxWidth: "300px",
    showDepotGrowth: false
  },

  getStyles() {
    return ["MMM-Jast.css"];
  },

  getScripts() {
    return [this.file("JastUtils.js")];
  },

  getTranslations() {
    return {
      en: "translations/en.json",
      de: "translations/de.json"
    };
  },

  getTemplate() {
    return "templates/MMM-Jast.njk";
  },

  getTemplateData() {
    return {
      config: this.config,
      exchangeData: this.exchangeData,
      utils: JastUtils
    };
  },

  getHeader() {
    return this.config.header;
  },

  start() {
    // Override defaults
    this.nunjucksEnvironment().loaders[0].async = false;
    this.nunjucksEnvironment().loaders[0].useCache = true;

    this.exchangeData = [];
    this.getExchangeRate();
    this.getStocks();
    this.getCrypto();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    const self = this;
    setInterval(function () {
      self.getExchangeRate();
      self.getStocks();
      self.getCrypto();
    }, this.config.requestIntervalInSeconds * 1000);
  },

  getStocks() {
    this.sendSocketNotification("GET_STOCKS", this.config);
  },

  getCrypto() {
    this.sendSocketNotification("GET_CRYPTO", this.config);
  },

  getExchangeRate() {
    this.sendSocketNotification("GET_EXCHANGE", {
      config: this.config,
      rates: this.exchangeData
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "STOCK_RESULT") {
      const { symbol, current, last } = payload;
      const currentStock = this.config.stocks.find(
        (stock) => stock.symbol === symbol
      );
      if (currentStock) {
        currentStock.current = current;
        currentStock.last = last;
        currentStock.lastUpdate = Date.now();
        this.updateDom();
      }
    } else if (notification === "CRYPTO_RESULT") {
      const { symbol, current, last } = payload;
      const currentCrypto = this.config.crypto.find(
        (crypto) => crypto.symbol === symbol
      );
      if (currentCrypto) {
        currentCrypto.current = current;
        currentCrypto.last = last;
        currentCrypto.lastUpdate = Date.now();
        this.updateDom();
      }
    } else if (notification === "EXCHANGE_RESULT") {
      let { from, to, rate } = payload;
      this.exchangeData.push({ from, to, rate, lastUpdate: Date.now() });

      this.updateDom();
    }
  },

  setVerticalScrollingKeyframes() {
    if (this.config.scroll !== "vertical") return;

    let offset = this.config.showDepotGrowth ? 1 : 0;

    let vkf = document.getElementById("vkf");
    if (!vkf) {
      vkf = document.createElement("style");
      vkf.type = "text/css";
      vkf.setAttribute("id", "vkf");
      document.head.appendChild(vkf);
    }
    let innerText = `@keyframes tickerv {`;
    const itemCount =
      this.config.stocks.length > 0 ? this.config.stocks.length + offset : 1; // avoid divition by zero
    const percentPerItem = 100 / itemCount;
    for (let i = 0; i <= itemCount; i++) {
      innerText += `  ${i * percentPerItem}% { margin-top: ${
        i === 0 || i === itemCount ? "0" : i * -26 + "px"
      }; }`;
    }
    innerText += `}`;
    vkf.innerText = innerText;
  }
});
