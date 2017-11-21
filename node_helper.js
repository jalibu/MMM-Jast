var NodeHelper = require("node_helper");
var request = require("request");
var async = require("async");

module.exports = NodeHelper.create({
	start: function () {
		console.log(this.name + " helper method started...");
	},

	sendRequest: function (urls) {
		var self = this;

		var results = {};

		async.eachSeries(urls, function(url, done) {
			request({ url: url, method: "GET" }, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var result = JSON.parse(body);
					if(result["Error Message"]) {
						console.log("No such symbol!");
					} else {
						var meta = result["Meta Data"];
						if(!meta){
							return;
						}
						var data = result["Time Series (Daily)"];
						var compName = meta["2. Symbol"];
						var count = 0;
						for (var key in data) {
							if (!data.hasOwnProperty(key)) {continue;}
							var obj = data[key];
							if(!results[compName]){
								results[compName] = [];
							}
							results[compName].push(obj);
							count++;
							if(count == 2) {
								break;
							}
						}
					}
				}
				done();
			});

		}, function(err) {
			if (err) {
				throw err;
			}
			self.sendSocketNotification("STOCK_RESULT", results);
		});
	},

	sendExchangeRate: function (url) {
		var self = this;

		request({ url: url, method: "GET" }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				self.sendSocketNotification("EXCHANGE_RATE", result);
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, url) {
		if (notification === "GET_STOCKS") {
			this.sendRequest(url);
		} else if(notification === "GET_EXCHANGE_RATE"){
			this.sendExchangeRate(url);
		}
	}
});