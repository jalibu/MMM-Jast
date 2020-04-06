# MMM-JaST - **J**ust ***a**nother **S**tock **T**icker (Beta)
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

If you want to use vertical scrolling, manual adjustments in the CSS file are unfortunately necessary.  
By default, scrolling is done through 4 levels.  
Open the `modules/MMM-Jast/MMM-Jast.css` to and change the **tickerv** keyframe.  
i.e. 4 stocks -> 100/4=25% for each item

```css
@keyframes tickerv {
	0%   {margin-top: 0}
	25%  {margin-top: -26px}
	50%  {margin-top: -52px}
	75%  {margin-top: -78px}
	100% {margin-top: 0}
}
```
