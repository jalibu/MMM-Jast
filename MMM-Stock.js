'use strict';

Module.register("MMM-Stock", {

  result: {},
  defaults: {
    updateInterval: 60000,
    fadeSpeed: 1000,
    companies: ['GOOG', 'YHOO'],
    baseURL: 'https://query.yahooapis.com/v1/public/yql',
  },

  getStyles: function() {
    return ["MMM-Stock.css"];
  },

  start: function() {
    this.getStocks();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "quotes";
    var list = document.createElement("ul");

    var data = this.result;
    // the data is not ready
    if(Object.keys(data).length === 0 && data.constructor === Object){
      return wrapper;
    }
    var count =  data.query.count;
    //console.log(count)
    
    for (var i = 0; i < count; i++) {
      var stockData = data.query.results.quote[i];
      var symbol = stockData.symbol;
      var change = stockData.Change;
      var name = stockData.Name;
      var price = stockData.LastTradePriceOnly;
      var pChange = stockData.PercentChange;
      var priceClass = "greenText", priceIcon="up_green";
      if(change < 0) {
         priceClass = "redText";
         priceIcon="down_red";
      }

      var html = "";
      var priceClass = "greentext", priceIcon="up_green";
      if(change < 0) { 
        priceClass = "redtext";
        priceIcon="down_red"; 
      }
      html = html + "<span class='" + priceClass + "'>";
      html = html + "<span class='quote'>" + name + " (" + symbol + ")</span> ";
      
      html = html + parseFloat(price).toFixed(2) + " ";
      html = html + "<span class='" + priceIcon + "'></span>" + parseFloat(Math.abs(change)).toFixed(2) + " (";
      html = html + parseFloat( Math.abs(pChange.split('%')[0])).toFixed(2) + "%)</span>";

      var stock = document.createElement("span");
      stock.className = "stockTicker";
      stock.innerHTML = html;

      var listItem = document.createElement("li");
      //listItem.appendChild(stock);
      listItem.innerHTML = html;
      list.appendChild(listItem);
    }
    wrapper.appendChild(list);

    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var loadTime = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      loadTime = delay;
    }

    var that = this;
    setInterval(function() {
      that.getStocks();
    }, loadTime);
  },

  getStocks: function () {
    var url = this.config.baseURL + "?q=env%20'store%3A%2F%2Fdatatables.org%2Falltableswithkeys'%3B%20select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('" + this.config.companies.join(', ') + "')&format=json&diagnostics=true&callback=";
    this.sendSocketNotification('GET_STOCKS', url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "STOCK_RESULT") {
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});