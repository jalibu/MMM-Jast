"use strict";

Module.register("MMM-Stock", {
	result: {},
	defaults: {
		updateInterval: 60000,
		fadeSpeed: 1000,
		companies: ["GOOGL", "YHOO"],
		currency: "usd",
		baseURL: "https://www.alphavantage.co/",
		apikey: "IPWULBT54Y3LHJME"
	},

	getStyles: function() {
		return ["MMM-Stock.css"];
	},

	getTranslations: function() {
		return false;
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

		for (var key in data) {
			if (!data.hasOwnProperty(key)) {continue;}
			var symbol = key;
			var obj = data[key];
			var current = obj[0];
			var prev = obj[1];
			var price = current["4. close"];
			var change = prev["4. close"] - current["4. close"];

			var html = "";
			var priceClass = "greentext", priceIcon="up_green";
			if(change < 0) {
				priceClass = "redtext";
				priceIcon="down_red";
			}
			html = html + "<span class='" + priceClass + "'>";
			html = html + "<span class='quote'> (" + symbol + ")</span> ";
			html = html + parseFloat(price).toFixed(2) + " USD";
			html = html + "<span class='" + priceIcon + "'></span>" + parseFloat(Math.abs(change)).toFixed(2);

			var stock = document.createElement("span");
			stock.className = "stockTicker";
			stock.innerHTML = html;

			var listItem = document.createElement("li");
			listItem.innerHTML = html;
			list.appendChild(listItem);
		}

		wrapper.appendChild(list);
		return wrapper;

		/*
		for (var i = 0; i < count; i++) {
			var stockData = data.query.results.quote[i];
			var symbol = stockData.symbol;
			var change = stockData.Change;
			var name = stockData.Name;
			var price = stockData.LastTradePriceOnly;
			var pChange = stockData.PercentChange;
			// var priceClass = "greenText", priceIcon="up_green";
			// if(change < 0) {
			// 	priceClass = "redText";
			// 	priceIcon="down_red";
			// }

			var html = "";
			var priceClass = "greentext", priceIcon="up_green";
			if(change < 0) {
				priceClass = "redtext";
				priceIcon="down_red";
			}
			html = html + "<span class='" + priceClass + "'>";
			html = html + "<span class='quote'>" + name + " (" + symbol + ")</span> ";
			if(differentCurrency){
				//convert between currencies
				var exchangeRate = this.rate.query.results.rate;
				if(exchangeRate.Bid && exchangeRate.Bid != "N/A"){
					price = parseFloat(price) * parseFloat(exchangeRate.Bid);
				}
				html = html + parseFloat(price).toFixed(2) + " " + requiredCurrency;
			} else {
				html = html + parseFloat(price).toFixed(2) + " " + stockData.Currency;
			}
			html = html + "<span class='" + priceIcon + "'></span>" + parseFloat(Math.abs(change)).toFixed(2) + " (";
			html = html + parseFloat( Math.abs(pChange.split("%")[0])).toFixed(2) + "%)</span>";

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
    */
	},

	scheduleUpdate: function(delay) {
		var loadTime = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			loadTime = delay;
		}

		var that = this;
		setInterval(function() {
			that.getStocks();
			if(this.config.currency.toLowerCase() != "usd"){
				that.getExchangeRate();
			}
		}, loadTime);
	},

	getStocks: function () {
		var allCompanies = this.config.companies;
		var urls = [];
		for(var company in allCompanies){
			var url = this.config.baseURL + "query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=" + allCompanies[company] + "&apikey=" + this.config.apikey;
			urls.push(url);
		}
		this.sendSocketNotification("GET_STOCKS", urls);
	},

	getExchangeRate: function () {
		var url = this.config.baseURL + "?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20('USD" + this.config.currency + "')&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
		this.sendSocketNotification("GET_EXCHANGE_RATE", url);
	},
	socketNotificationReceived: function(notification, payload) {
		if (notification === "STOCK_RESULT") {
			this.result = payload;
			this.updateDom(self.config.fadeSpeed);
		} else if(notification === "EXCHANGE_RATE"){
			this.rate = payload;
		}
	}
});