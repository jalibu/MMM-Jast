const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
  start() {
    console.log(`${this.name} helper method started...`);
  },

  sendStocksRequest(config) {
    const self = this;
    if (config.debug) {
      self.sendSocketNotification("STOCK_RESULT", {
        symbol: "BAS.DE",
        current: 50.2,
        last: 44.9
      });
      self.sendSocketNotification("STOCK_RESULT", {
        symbol: "SAP.DE",
        current: 100.2,
        last: 100.9
      });
      self.sendSocketNotification("STOCK_RESULT", {
        symbol: "HEN3.DE",
        current: 66.2,
        last: 70.9
      });
      self.sendSocketNotification("STOCK_RESULT", {
        symbol: "BABA",
        current: 180.2,
        last: 188.9
      });
      return;
    }

    config.stocks.forEach((stock) => {
      if (
        !stock.lastUpdate ||
        Date.now() - stock.lastUpdate >= config.updateIntervalInSeconds * 1000
      ) {
        const url = `${config.baseURL}query?function=TIME_SERIES_DAILY&outputsize=compact&apikey=${config.apiKey}&symbol=${stock.symbol}`;
        request(url, { json: true }, (err, _res, body) => {
          if (err) {
            console.error(`Error requesting Stock data`);
          }
          try {
            const symbol = body["Meta Data"]["2. Symbol"];
            const values = Object.values(body["Time Series (Daily)"]);
            const current = parseFloat(values[0]["4. close"]);
            const last = parseFloat(values[1]["4. close"]);

            console.log("Sending Stock result:", { symbol, current, last });
            self.sendSocketNotification("STOCK_RESULT", {
              symbol,
              current,
              last
            });
          } catch (err) {
            console.error(`Error processing Stock response`, body);
          }
        });
      }
    });
  },

  sendExchangeRequest(payload) {
    const self = this;
    const { config, rates } = payload;
    if (config.debug) {
      self.sendSocketNotification("EXCHANGE_RESULT", {
        from: "USD",
        to: "EUR",
        rate: 0.923
      });
      return;
    }
    config.stocks.forEach((stock) => {
      if (
        stock.tradeCurrency &&
        stock.displayCurrency &&
        stock.tradeCurrency !== stock.displayCurrency
      ) {
        const currentChange = rates.find(
          (rate) =>
            rate.from === stock.tradeCurrency &&
            rate.to === stock.displayCurrency
        );

        if (
          !currentChange ||
          !currentChange.lastUpdate ||
          Date.now() - currentChange.lastUpdate >=
            config.updateIntervalInSeconds * 1000
        ) {
          const url = `${config.baseURL}query?function=CURRENCY_EXCHANGE_RATE&from_currency=${stock.tradeCurrency}&to_currency=${stock.displayCurrency}&apikey=${config.apiKey}`;
          request(url, { json: true }, (err, res, body) => {
            if (err) {
              console.error(`Error requesting Exchange rate`);
            }
            try {
              const from =
                body["Realtime Currency Exchange Rate"][
                  "1. From_Currency Code"
                ];
              const to =
                body["Realtime Currency Exchange Rate"]["3. To_Currency Code"];
              const rate = parseFloat(
                body["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
              );

              console.log("Sending Exchange result:", { from, to, rate });
              self.sendSocketNotification("EXCHANGE_RESULT", {
                from,
                to,
                rate
              });
            } catch (err) {
              console.error(`Error processing Exchange response`, body);
            }
          });
        }
      }
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_STOCKS") {
      this.sendStocksRequest(payload);
    } else if (notification === "GET_EXCHANGE") {
      this.sendExchangeRequest(payload);
    } else {
      console.warn(`${notification} is invalid notification`);
    }
  }
});
