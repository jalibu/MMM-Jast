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
}
