import Utils from "./Utils";
import { Config } from "../models/Config";

Module.register("MMM-Jast", {
  defaults: {
    header: null,
    updateIntervalInSeconds: 600,
    fadeSpeedInSeconds: 3.5, // Higher value: vertical -> faster // horizontal -> slower
    stocks: [
      { name: "BASF", symbol: "BAS.DE", quantity: 1 },
      { name: "SAP", symbol: "SAP.DE", quantity: 2 },
      { name: "Henkel", symbol: "HEN3.DE" },
      { name: "AbbVie", symbol: "4AB.DE" },
      { name: "Bitcoin", symbol: "BTC-EUR" },
      {
        name: "Alibaba",
        symbol: "BABA",
        quantity: 10
      }
    ],
    scroll: "vertical",
    maxWidth: "300px",
    showDepotGrowth: false
  } as Config,

  getStyles() {
    return ["MMM-Jast.css"];
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
      stocks: this.stocks,
      error: this.error,
      utils: Utils
    };
  },

  getHeader() {
    return this.config.header;
  },

  start() {
    // Override defaults
    this.nunjucksEnvironment().loaders[0].async = false;
    this.nunjucksEnvironment().loaders[0].useCache = true;

    this.stocks = [];
    this.error = null;
    this.loadData();
    this.scheduleUpdate();
    this.updateDom();
  },

  scheduleUpdate() {
    const self = this;
    setInterval(() => {
      self.loadData();
    }, this.config.updateIntervalInSeconds * 1000);
  },

  loadData() {
    this.sendSocketNotification("GET_STOCKS", this.config);
  },

  socketNotificationReceived(notificationIdentifier: string, payload: any) {
    if (notificationIdentifier === "STOCKS_RESULT") {
      this.error = null;
      this.stocks = payload;
      this.updateDom();
      console.log(this.stocks);
    } else if (notificationIdentifier === "ERROR") {
      this.error = payload;
      this.updateDom();
    }
  }
});
