var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log(this.name + ' helper method started...');
  },

  sendRequest: function (url) {
      var self = this;

      request({ url: url, method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            //console.log(result)
            self.sendSocketNotification('STOCK_RESULT', result);
          }
      });

  },

  sendExchangeRate: function (url) {
    var self = this;

      request({ url: url, method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            self.sendSocketNotification('EXCHANGE_RATE', result);
          }
      });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, url) {
    if (notification === 'GET_STOCKS') {
      //console.log(url)
      this.sendRequest(url);
    } else if(notification === 'GET_EXCHANGE_RATE'){
      this.sendExchangeRate(url);
    }
  }

});