/*! *****************************************************************************
  mmm-jast
  Version 2.5.2

  A minimalistic stock ticker based on Yahoo's finance API for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Jast/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),t=require("yahoo-finance2");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function o(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var o=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,o.get?o:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var n=o(e),i=r(t);
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
function s(e,t,r,o){return new(r||(r=Promise))((function(n,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function a(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))}const a=["regularMarketChange","regularMarketChangePercent","regularMarketPrice","currency","longName","regularMarketPreviousClose"];module.exports=n.create({start(){console.log(`${this.name} helper method started...`)},requestStocks(e){return s(this,void 0,void 0,(function*(){const t=[];for(const r of e.stocks)try{const{price:e}=yield i.default.quoteSummary(r.symbol);if(e){const o={symbol:r.symbol,name:r.name,quantity:r.quantity};t.push({price:e,meta:o})}else console.warn(`Response for ${r.symbol} does not satisfy expected payload.`)}catch(e){console.error("There was an error requesting the API.",e.message)}return t}))},socketNotificationReceived(e,t){return s(this,void 0,void 0,(function*(){if(e){let e=yield this.requestStocks(t);e=e.filter((e=>a.every((t=>!!Object.prototype.hasOwnProperty.call(e.price,t)||(console.warn(`Skipped symbol '${e.meta.symbol}' as it's response did not have required property '${t}'. This is usually the case when a symbol is misspelled`),!1))))),this.sendSocketNotification("STOCKS_RESULT",e)}else console.warn(`${e} is invalid notification`)}))}});
