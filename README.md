# MMM-JaST - **J**ust **a**nother **S**tock **T**icker

[![dependencies Status](https://status.david-dm.org/gh/jalibu/MMM-Jast.svg)](https://david-dm.org/jalibu/MMM-Jast) [![Known Vulnerabilities](https://snyk.io/test/github/jalibu/MMM-Jast/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jalibu/MMM-Jast?targetFile=package.json)

This is a minimalistic stock ticker based on Yahoo's finance API for the [MagicMirror²](https://magicmirror.builders/) platform.  
Click here for the Magic Mirror [Forum Thread](https://forum.magicmirror.builders/topic/12507/mmm-jast-just-another-stock-ticker).

Contribution welcome.

#### Support

If you like this module and want to thank, please rate this repository with a star or buy me a coffee :-)

<a href="https://www.buymeacoffee.com/jalibu" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Beer" style="height: 45px !important;width: 180px !important;" ></a>

## Features

- Uses Yahoo Finance API to collect current
  - stock values
  - indexes
  - cryptocurrencies
- No API Key required
- Vertical or horizontal scrolling or static list
- Share Portfolio value and growth summary
- Very customizable
- Easy to use

Horizontal  
<img src="docs/horizontal.gif">

Vertical  
<img src="docs/vertical.gif" height="40px">

Static  
<img src="docs/static.png" height="140px">

## Installing the Module

1. Navigate to the `MagicMirror/modules` directory and execute the following command

   ```sh
   git clone https://github.com/jalibu/MMM-Jast.git
   ```

2. Change into the MMM-Jast module folder and install runtime dependencies with

   ```sh
   cd MMM-Jast
   npm install --only=production
   ```

3. Add the module configuration into the `MagicMirror/config/config.js` file (sample configuration):

   ```javascript
   {
   	module: "MMM-Jast",
   	position: "top_left",
   	config: {
   		maxWidth: "100%",
   		updateIntervalInSeconds: 300,
   		fadeSpeedInSeconds: 3.5, // Higher value: vertical -> faster // horizontal -> slower
   		scroll: "vertical", // One of ["none", "vertical", "horizontal"]
   		useGrouping: false,
   		currencyStyle: "code", // One of ["code", "symbol", "name"]
   		showColors: true,
   		showCurrency: true,
   		showChangePercent: true,
   		showChangeValue: false,
   		showChangeValueCurrency: false,
   		showPortfolioValue: false,
   		showPortfolioGrowthPercent: false,
   		showPortfolioGrowth: false,
   		numberDecimalsValues: 2,
   		numberDecimalsPercentages: 1,
   		virtualHorizontalMultiplier: 2,
   		stocks: [
   			{ name: "BASF", symbol: "BAS.DE", quantity: 10 },
   			{ name: "SAP", symbol: "SAP.DE", quantity: 15 },
   			{ name: "Henkel", symbol: "HEN3.DE" },
   			{ name: "Alibaba", symbol: "BABA"}
   		]
   	}
   }
   ```

### Options

| Field                       | Description                                                                                    | Default    |
| --------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| updateIntervalInSeconds     | (Integer) Interval to refresh stock data from server. (min. 120)                               | 300        |
| fadeSpeedInSeconds          | (Integer) Animation speed for ticker. Higher value: vertical -> faster // horizontal -> slower | 3.5        |
| stocks                      | (Array<Stock>) Array of stocks to be displayed                                                 | Sample set |
| scroll                      | (String) Animation direction for ticker. Values: none, vertical or horizontal                  | "vertical" |
| maxWidth                    | (String) CSS style to limit ticker width for vertical styles                                   | "100%"     |
| numberDecimalsValues        | (Number) Number of decimals for stock values                                                   | 2          |
| numberDecimalsPercentages   | (Number) Number of decimals for percentages                                                    | 1          |
| currencyStyle               | (String) Style of currency. Possible values: "code" (EUR), "symbol" (€), "name" (Euro)         | "code"     |
| showColors                  | (Boolean) Colorize positive numbers in green, negatives in red                                 | true       |
| showCurrency                | (Boolean) Show stocks currency                                                                 | true       |
| showChangePercent           | (Boolean) Show stocks change against last close in percent                                     | true       |
| showChangeValue             | (Boolean) Show stocks change against last close in absolute value                              | false      |
| showChangeValueCurrency     | (Boolean) Show currency for change value                                                       | false      |
| showPortfolioValue          | (Boolean) Show portfolio value                                                                 | false      |
| showPortfolioGrowth         | (Boolean) Show portfolio value growth summary                                                  | false      |
| showPortfolioGrowthPercent  | (Boolean) Show portfolio value growth summary in percent                                       | false      |
| useGrouping                 | (Boolean) Add grouping to high value numbers (i.e. BTC 60,000.00 EUR)                          | false      |
| virtualHorizontalMultiplier | (Number) Virtually repeats the stocklist in horizontal mode to avoid whitespaces               | 2          |

### Stock Object

| Field    | Description                                                | Example   |
| -------- | ---------------------------------------------------------- | --------- |
| symbol   | (String) Stock's symbol/key                                | "BABA"    |
| name     | (String) Optional: Stock's display name                    | "Alibaba" |
| quantity | (Number) Optional: To calculate portfolio value and growth | 500       |

### Where the hack do I get the symbol for my favorite stocks?!

The easiest way to get the symbol for your stock is to open [finance.yahoo.com](https://finance.yahoo.com) and use the search field on the top. You'll find the symbol either in the search preview or in the result page's URL (i.e. https://finance.yahoo.com/quote/BMW.DE?p=BMW.DE where BMW.DE would be the symbol).

## Contribution and Development

This module is written in TypeScript and compiled with Rollup.  
The source files are located in the `/src` folder.
Compile target files with `npm run build`.

Contribution for this module is welcome!
