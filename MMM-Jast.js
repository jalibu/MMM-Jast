"use strict";

Module.register("MMM-Jast", {
  result: {},
  defaults: {
    updateInterval: 300000,
    fadeSpeed: 5000,
    companies: [
      { name: "BASF", symbol: "BAS.DE" },
      { name: "SAP", symbol: "SAP.DE" },
      { name: "Henkel", symbol: "HEN3.DE" },
      { name: "Alibaba", symbol: "BABA" },
    ],
    currency: "usd",
    baseURL: "https://www.alphavantage.co/",
    apiKey: "IPWULBT54Y3LHJME",
  },

  getStyles: function () {
    return ["MMM-Jast.css"];
  },

  getTranslations: function () {
    return false;
  },

  start: function () {
    this.stockData = {};
    this.getStocks();
    this.scheduleUpdate();
  },

  getDom: function () {
    let app = document.createElement("div");
    const stockDataArray = Object.entries(this.stockData);
    let ticker = `<div class="ticker-wrap vticker">`;
    ticker += `<ul style="animation-duration: ${(stockDataArray.length * this.config.fadeSpeed) / 1000}s">`;
    stockDataArray.forEach(([key, value]) => {
      const company = this.config.companies.find((company) => company.symbol === key);
      ticker += `<li>${company.name} `;
      ticker += `<span class=${value.current < value.last ? "low" : "high"}>${value.current} USD (${(
        ((value.current - value.last) / value.last) *
        100
      ).toFixed(1)}%)</span>`;
      ticker += `</li>`;
    });
    ticker += `</ul>`;
    ticker += `</div>`;
    app.innerHTML = ticker;
    return app;
  },

  scheduleUpdate: function () {
    const self = this;
    setInterval(function () {
      self.getStocks();
    }, this.config.updateInterval);
  },

  getStocks: function () {
    this.sendSocketNotification("GET_STOCKS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "STOCK_RESULT") {
      let { name, current, last } = payload;
      this.stockData[name] = { current, last };
      this.updateDom();
    }
  },
});
