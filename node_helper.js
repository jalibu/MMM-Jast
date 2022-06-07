/*! *****************************************************************************
  mmm-jast
  Version 2.7.0

  A minimalistic stock ticker based on Yahoo's finance API for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Jast/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),t=require("logger"),r=require("yahoo-finance2");function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var o=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,o.get?o:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var s=n(e),i=n(t),c=o(r);
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
function a(e,t,r,o){return new(r||(r=Promise))((function(n,s){function i(e){try{a(o.next(e))}catch(e){s(e)}}function c(e){try{a(o.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(i,c)}a((o=o.apply(e,t||[])).next())}))}const u=["regularMarketChange","regularMarketChangePercent","regularMarketPrice","currency","longName","regularMarketPreviousClose"];module.exports=s.create({start(){i.log(`${this.name} helper method started...`)},socketNotificationReceived(e,t){return a(this,void 0,void 0,(function*(){if("JAST_STOCKS_REQUEST"===e){let e=yield class{static requestStocks(e){return a(this,void 0,void 0,(function*(){const t=[],r=[];for(const t of e.stocks)r.push(c.default.quoteSummary(t.symbol,{modules:["price"]}));const o=yield Promise.all(r.map((e=>e.catch((e=>e)))));for(const[r,n]of o.entries())if(n instanceof Error)i.warn(`API request for ${e.stocks[r].symbol} failed:`,n.message);else if(n.price){const o={symbol:e.stocks[r].symbol,name:e.stocks[r].name,quantity:e.stocks[r].quantity};"GBp"===n.price.currency&&(n.price.regularMarketPrice/=100,n.price.regularMarketChange/=100,n.price.currency="GBP"),t.push({price:n.price,meta:o})}else i.warn(`Response for ${e.stocks[r].symbol} does not satisfy expected payload.`);return t}))}}.requestStocks(t);e=e.filter((e=>u.every((t=>!!Object.prototype.hasOwnProperty.call(e.price,t)||(i.warn(`Skipped symbol '${e.meta.symbol}' as it's response did not have required property '${t}'. This is usually the case when a symbol is misspelled`),!1)))));const r={lastUpdate:Date.now(),stocks:e};this.sendSocketNotification("JAST_STOCKS_RESPONSE",r)}else i.warn(`${e} is invalid notification`)}))}});
