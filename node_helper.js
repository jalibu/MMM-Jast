/*! *****************************************************************************
  mmm-jast
  Version 2.9.0

  A minimalistic stock ticker based on Yahoo's finance API for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Jast/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),r=require("logger"),t=require("yahoo-finance2");function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var r=Object.create(null);return e&&Object.keys(e).forEach((function(t){if("default"!==t){var a=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,a.get?a:{enumerable:!0,get:function(){return e[t]}})}})),r.default=e,Object.freeze(r)}var o=n(e),s=n(r),i=a(t);
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
function c(e,r,t,a){return new(t||(t=Promise))((function(n,o){function s(e){try{c(a.next(e))}catch(e){o(e)}}function i(e){try{c(a.throw(e))}catch(e){o(e)}}function c(e){var r;e.done?n(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(s,i)}c((a=a.apply(e,r||[])).next())}))}class u{static requestStocks(e){var r;return c(this,void 0,void 0,(function*(){const t=[],a=[];for(const r of e.stocks)a.push(i.default.quoteSummary(r.symbol,{modules:["price"]}));const n=yield Promise.all(a.map((e=>e.catch((e=>e)))));for(const[a,o]of n.entries())if(o instanceof Error)s.warn(`API request for ${e.stocks[a].symbol} failed:`,o.message);else if(o.price){const n={symbol:e.stocks[a].symbol,name:e.stocks[a].name,quantity:e.stocks[a].quantity,hidden:e.stocks[a].hidden,purchasePrice:e.stocks[a].purchasePrice};if("GBp"===o.price.currency&&(o.price.regularMarketPrice/=100,o.price.regularMarketChange/=100,o.price.currency="GBP"),e.maxChangeAge>0){const t=(new Date).getTime()-e.maxChangeAge;try{t>Date.parse(o.price.regularMarketTime)&&(o.price.regularMarketPreviousClose=null===(r=o.price)||void 0===r?void 0:r.regularMarketPrice,o.price.regularMarketChange=0,o.price.regularMarketChangePercent=0)}catch(e){s.warn("Could not parse lastChange date",e)}}t.push({price:o.price,meta:n})}else s.warn(`Response for ${e.stocks[a].symbol} does not satisfy expected payload.`);return t}))}}const l=["regularMarketChange","regularMarketChangePercent","regularMarketPrice","currency","longName","regularMarketPreviousClose"];module.exports=o.create({start(){s.log(`${this.name} helper method started...`)},socketNotificationReceived(e,r){return c(this,void 0,void 0,(function*(){if(e.includes("JAST_STOCKS_REQUEST")){const t=e.substring(20);let a=yield u.requestStocks(r);a=a.filter((e=>l.every((r=>!!Object.prototype.hasOwnProperty.call(e.price,r)||(s.warn(`Skipped symbol '${e.meta.symbol}' as it's response did not have required property '${r}'. This is usually the case when a symbol is misspelled`),!1)))));const n={lastUpdate:Date.now(),stocks:a};this.sendSocketNotification(`JAST_STOCKS_RESPONSE-${t}`,n)}else s.warn(`${e} is invalid notification`)}))}});
