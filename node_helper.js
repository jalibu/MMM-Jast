var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
  start: function () {
    console.log(`${this.name} helper method started...`);
  },

  sendStocksRequest: function (config) {
    const self = this;
    config.companies.forEach((company) => {
      const url = `${config.baseURL}query?function=TIME_SERIES_DAILY&outputsize=compact&apikey=${config.apiKey}&symbol=${company.symbol}`;
      request(url, { json: true }, (err, res, body) => {
        if (err) {
          console.error(err);
        }
        try {
          const name = body["Meta Data"]["2. Symbol"];
          const values = Object.values(body["Time Series (Daily)"]);
          const current = parseFloat(values[0]["4. close"]).toFixed(2);
          const last = parseFloat(values[1]["4. close"]).toFixed(2);

          self.sendSocketNotification("STOCK_RESULT", { name, current, last });
        } catch (err) {
          console.error(err);
        }
      });
      /* DEV DATA
      self.sendSocketNotification("STOCK_RESULT", { name: "BAS.DE", current: 20.0, last: 10.0 });
      self.sendSocketNotification("STOCK_RESULT", { name: "SAP.DE", current: 10.0, last: 8.0 });
      self.sendSocketNotification("STOCK_RESULT", { name: "HEN3.DE", current: 50, last: 100 });
      self.sendSocketNotification("STOCK_RESULT", { name: "BABA", current: 82.9, last: 72.01 });
   */
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_STOCKS") {
      this.sendStocksRequest(payload);
    } else {
      console.warn(`${notification} is invalid notification`);
    }
  },
});
