"use strict";

Module.register("MMM-Jast", {
  result: {},
  defaults: {
    debug: false,
    updateIntervalInSeconds: 1800,
    requestIntervalInSeconds: 62,
    fadeSpeed: 2500,
    stocks: [
      { name: "BASF", symbol: "BAS.DE" },
      { name: "SAP", symbol: "SAP.DE" },
      { name: "Henkel", symbol: "HEN3.DE" },
      { name: "AbbVie", symbol: "4AB.DE" },
      { name: "Alibaba", symbol: "BABA", tradeCurrency: "USD", displayCurrency: "EUR", quantity: 10 },
    ],
    defaultCurrency: "EUR",
    baseURL: "https://www.alphavantage.co/",
    apiKey: "IPWULBT54Y3LHJME",
    scroll: "vertical",
    maxWidth: "300px",
    showDepotGrowth: true,
  },

  getStyles: function () {
    return ["MMM-Jast.css"];
  },

  getTranslations: function () {
    return {
      en: "translations/en.json",
      de: "translations/de.json",
    };
  },

  start: function () {
    this.exchangeData = {};
    this.getExchangeRate();
    this.getStocks();
    this.scheduleUpdate();
  },

  getDom: function () {
    this.setVerticalScrollingKeyframes();
    let app = document.createElement("div");
    let depotChange = 0;
    let entryCount = this.config.showDepotGrowth ? this.config.stocks.length + 1 : this.config.stocks.length;
    let ticker = `<div class="ticker-wrap ${
      this.config.scroll === "horizontal" || this.config.scroll === "vertical" ? this.config.scroll : ""
    }" style="max-width: ${this.config.maxWidth}" >`;
    ticker += `<ul style="animation-duration: ${(entryCount * this.config.fadeSpeed) / 1000}s">`;
    this.config.stocks.forEach((stock) => {
      let currentValue = "-";
      if (stock.current) {
        currentValue = stock.current;
        if (stock.tradeCurrency && stock.DisplayCurrency && stock.tradeCurrency !== stock.DisplayCurrency) {
          const exchange = this.exchangeData.find(
            (exchange) => exchange.from === stock.tradeCurrency && exchange.to === stock.displayCurrency
          );
          if (exchange) {
            currentValue = currentValue * exchange.rate;
          }
        }
        currentValue = currentValue.toFixed(2);
      }
      const currency = stock.displayCurrency || this.config.defaultCurrency;

      ticker += `<li>${stock.name} `;
      ticker += `<span class=${this.getColorClass(stock.current - stock.last)}>${currentValue} ${currency} (${
        stock.current ? (((stock.current - stock.last) / stock.last) * 100).toFixed(1) : ""
      }%)</span>`;
      ticker += `</li>`;
      if (stock.current && stock.quantity) {
        depotChange = depotChange + (stock.current - stock.last) * stock.quantity;
      }
    });
    if (this.config.showDepotGrowth) {
      ticker += `<li>${this.translate("depotGrowth")} <span class=${this.getColorClass(
        depotChange
      )}>${depotChange.toFixed(2)} EUR</span></li>`;
    }
    ticker += `</ul>`;
    ticker += `</div>`;
    app.innerHTML = ticker;
    return app;
  },

  scheduleUpdate: function () {
    const self = this;
    setInterval(function () {
      self.getExchangeRate();
      self.getStocks();
    }, this.config.requestIntervalInSeconds * 1000);
  },

  getStocks: function () {
    this.sendSocketNotification("GET_STOCKS", this.config);
  },

  getExchangeRate: function () {
    this.sendSocketNotification("GET_EXCHANGE", { config: this.config, rates: this.exchangeData });
  },

  getColorClass: function (depotChange) {
    if (depotChange > 0) {
      return "high";
    } else if (depotChange < 0) {
      return "low";
    } else {
      return "neutral";
    }
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "STOCK_RESULT") {
      let { symbol, current, last } = payload;
      let stockIndex = this.config.stocks.findIndex((stock) => stock.symbol === symbol);
      if (stockIndex >= 0) {
        this.config.stocks[stockIndex].current = current;
        this.config.stocks[stockIndex].last = last;
        this.config.stocks[stockIndex].lastUpdate = Date.now();
        this.updateDom();
      }
    } else if (notification === "EXCHANGE_RESULT") {
      let { from, to, rate } = payload;
      this.exchangeData[from + to] = { from, to, rate };
      this.exchangeData[from + to].lastUpdate = Date.now();
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
    const itemCount = this.config.stocks.length > 0 ? this.config.stocks.length + offset : 1; // avoid divition by zero
    const percentPerItem = 100 / itemCount;
    for (let i = 0; i <= itemCount; i++) {
      innerText += `  ${i * percentPerItem}% { margin-top: ${i == 0 || i == itemCount ? "0" : i * -26 + "px"}; }`;
    }
    innerText += `}`;
    vkf.innerText = innerText;
  },
});
