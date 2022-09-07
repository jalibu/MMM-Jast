/*! *****************************************************************************
  mmm-jast
  Version 2.8.0

  A minimalistic stock ticker based on Yahoo's finance API for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Jast/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),t=require("logger"),r=require("yahoo-finance2");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function o(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var s=o(e),a=o(t),i=n(r);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function c(e,t,r,n){return new(r||(r=Promise))((function(o,s){function a(e){try{c(n.next(e))}catch(e){s(e)}}function i(e){try{c(n.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,i)}c((n=n.apply(e,t||[])).next())}))}const l=["regularMarketChange","regularMarketChangePercent","regularMarketPrice","currency","longName","regularMarketPreviousClose"];module.exports=s.create({start(){a.log(`${this.name} helper method with debugging output started...`)},socketNotificationReceived(e,t){return c(this,void 0,void 0,(function*(){if(e.includes("JAST_STOCKS_REQUEST")){a.log("Backend received JAST_STOCKS_REQUEST from frontend");const r=e.substring("JAST_STOCKS_REQUEST".length+1);let n=yield class{static requestStocks(e){var t;return c(this,void 0,void 0,(function*(){const r=[],n=[];for(const t of e.stocks)n.push(i.default.quoteSummary(t.symbol,{modules:["price"]}));const o=yield Promise.all(n.map((e=>e.catch((e=>e)))));for(const[n,s]of o.entries())if(s instanceof Error)a.warn(`API request for ${e.stocks[n].symbol} failed:`,s.message);else if(s.price){const o={symbol:e.stocks[n].symbol,name:e.stocks[n].name,quantity:e.stocks[n].quantity,hidden:e.stocks[n].hidden};if("GBp"===s.price.currency&&(s.price.regularMarketPrice/=100,s.price.regularMarketChange/=100,s.price.currency="GBP"),e.maxChangeAge>0){const r=(new Date).getTime()-e.maxChangeAge;try{r>Date.parse(s.price.regularMarketTime)&&(s.price.regularMarketPreviousClose=null===(t=s.price)||void 0===t?void 0:t.regularMarketPrice,s.price.regularMarketChange=0,s.price.regularMarketChangePercent=0)}catch(e){a.warn("Could not parse lastChange date",e)}}r.push({price:s.price,meta:o})}else a.warn(`Response for ${e.stocks[n].symbol} does not satisfy expected payload.`);return r}))}}.requestStocks(t);a.log(`BackendUtils finished Yahoo request with ${n.length} stocks`),n=n.filter((e=>l.every((t=>!!Object.prototype.hasOwnProperty.call(e.price,t)||(a.warn(`Skipped symbol '${e.meta.symbol}' as it's response did not have required property '${t}'. This is usually the case when a symbol is misspelled`),!1))))),a.log(`Finished sanitizing stocks. ${n.length} passed the test.`);const o={lastUpdate:Date.now(),stocks:n};this.sendSocketNotification(`JAST_STOCKS_RESPONSE-${r}`,o),a.log("Backend is sending JAST_STOCKS_RESPONSE to frontend",`JAST_STOCKS_RESPONSE-${r}`,o)}else a.warn(`${e} is invalid notification`)}))}});
