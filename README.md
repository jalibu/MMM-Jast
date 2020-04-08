# MMM-JaST - **J**ust **a**nother **S**tock **T**icker (Beta)
This is just another stock ticker for [Magic Mirror](https://magicmirror.builders/).  
It supports vertical and horizontal scrolling.

## Installing the Module
Navigate to the MagicMirror subfolder "modules" and execute the following command  
`git clone https://github.com/jalibu/MMM-Jast.git`

## Using the module
First, get your personal API Key for [Alphavantage here](https://www.alphavantage.co/support/#api-key)

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
{
	module: "MMM-Jast",
	position: "top_left",
	config: {
		updateInterval: 120000,
		fadeSpeed: 5000,
		stocks: [
		{ name: "BASF", symbol: "BAS.DE" },
		{ name: "SAP", symbol: "SAP.DE" },
		{ name: "Henkel", symbol: "HEN3.DE" },
		{ name: "Alibaba", symbol: "BABA", tradeCurrency: "USD", displayCurrency: "EUR" },
		],
		defaultCurrency: "EUR",
		apiKey: "<Insert your API Key>",
		scroll: "<none, vertical, horizontal>",
		maxWidth: "100%",
	}
}
```