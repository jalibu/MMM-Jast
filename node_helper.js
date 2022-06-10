/*! *****************************************************************************
  mmm-jast
  Version 2.7.0

  A minimalistic stock ticker based on Yahoo's finance API for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Jast/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),r=require("logger"),t=require("yahoo-finance2");function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var r=Object.create(null);return e&&Object.keys(e).forEach((function(t){if("default"!==t){var a=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,a.get?a:{enumerable:!0,get:function(){return e[t]}})}})),r.default=e,Object.freeze(r)}var o=n(e),i=n(r),s=a(t);
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
function c(e,r,t,a){return new(t||(t=Promise))((function(n,o){function i(e){try{c(a.next(e))}catch(e){o(e)}}function s(e){try{c(a.throw(e))}catch(e){o(e)}}function c(e){var r;e.done?n(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(i,s)}c((a=a.apply(e,r||[])).next())}))}const u=["regularMarketChange","regularMarketChangePercent","regularMarketPrice","currency","longName","regularMarketPreviousClose"];module.exports=o.create({start(){i.log(`${this.name} helper method started...`)},socketNotificationReceived(e,r){return c(this,void 0,void 0,(function*(){if("JAST_STOCKS_REQUEST"===e){let e=yield class{static requestStocks(e){var r;return c(this,void 0,void 0,(function*(){const t=[],a=[];for(const r of e.stocks)a.push(s.default.quoteSummary(r.symbol,{modules:["price"]}));const n=yield Promise.all(a.map((e=>e.catch((e=>e)))));for(const[a,o]of n.entries())if(o instanceof Error)i.warn(`API request for ${e.stocks[a].symbol} failed:`,o.message);else if(o.price){const n={symbol:e.stocks[a].symbol,name:e.stocks[a].name,quantity:e.stocks[a].quantity};if("GBp"===o.price.currency&&(o.price.regularMarketPrice/=100,o.price.regularMarketChange/=100,o.price.currency="GBP"),e.maxChangeAge>0){const t=(new Date).getTime()-e.maxChangeAge;try{t>Date.parse(o.price.regularMarketTime)&&(o.price.regularMarketPreviousClose=null===(r=o.price)||void 0===r?void 0:r.regularMarketPrice,o.price.regularMarketChange=0,o.price.regularMarketChangePercent=0)}catch(e){i.warn("Could not parse lastChange date",e)}}t.push({price:o.price,meta:n})}else i.warn(`Response for ${e.stocks[a].symbol} does not satisfy expected payload.`);return t}))}}.requestStocks(r);e=e.filter((e=>u.every((r=>!!Object.prototype.hasOwnProperty.call(e.price,r)||(i.warn(`Skipped symbol '${e.meta.symbol}' as it's response did not have required property '${r}'. This is usually the case when a symbol is misspelled`),!1)))));const t={lastUpdate:Date.now(),stocks:e};this.sendSocketNotification("JAST_STOCKS_RESPONSE",t)}else i.warn(`${e} is invalid notification`)}))}});
