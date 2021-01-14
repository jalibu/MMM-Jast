class JastUtils {
  static getCurrentValue(stock, exchangeData) {
    let currentValue = "-";
    if (stock.current) {
      currentValue = stock.current;
      if (
        exchangeData &&
        stock.tradeCurrency &&
        stock.displayCurrency &&
        stock.tradeCurrency !== stock.displayCurrency
      ) {
        const exchange = exchangeData.find(
          (exchange) =>
            exchange.from === stock.tradeCurrency &&
            exchange.to === stock.displayCurrency
        );
        if (exchange) {
          currentValue = currentValue * exchange.rate;
        }
      }
      currentValue = currentValue.toFixed(2);
    }
    return currentValue;
  }

  static getCurrency(stock, exchangeData, config) {
    let currency = config.defaultCurrency;
    if (stock.displayCurrency) {
      const exchange = exchangeData.find(
        (exchange) =>
          exchange.from === stock.tradeCurrency &&
          exchange.to === stock.displayCurrency
      );
      if (exchange) {
        currency = stock.displayCurrency;
      } else if (stock.tradeCurrency) {
        currency = stock.tradeCurrency;
      }
    }
    return currency;
  }

  static getStockChange(stock) {
    if (stock.current && stock.last) {
      return (((stock.current - stock.last) / stock.last) * 100).toFixed(1);
    } else {
      return 0;
    }
  }

  static getDepotGrowth(config, exchangeData) {
    let growth = 0;
    let errors = false;
    config.stocks.forEach((stock) => {
      if (stock.current && stock.last) {
        let change =
          stock.current * stock.quantity - stock.last * stock.quantity;

        if (
          stock.tradeCurrency &&
          stock.tradeCurrency !== config.defaultCurrency
        ) {
          const exchange = exchangeData.find(
            (exchange) =>
              exchange.from === stock.tradeCurrency &&
              exchange.to === stock.displayCurrency
          );
          if (exchange) {
            change = change * exchange.rate;
          } else {
            errors = true;
          }
        } else {
          errors = true;
        }
        growth = growth + change;
      }
    });

    return { value: growth.toFixed(2), errors };
  }
}
