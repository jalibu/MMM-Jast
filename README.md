# MMM-JaST - **J**ust **a**nother **S**tock **T**icker
This is just another stock ticker for [Magic Mirror](https://magicmirror.builders/).
Click here for the Magic Mirror [Forum Thread](https://forum.magicmirror.builders/topic/12507/mmm-jast-just-another-stock-ticker)

## Features
- Uses Yahoo Finance API to collect current stock values
- Vertical scrolling
- Horizontal scrolling
- Depot value growth summary

## Installing the Module
Navigate to the MagicMirror subfolder "modules" and execute the following command
`git clone https://github.com/jalibu/MMM-Jast.git`

Install dependencies with  
`npm i`

To use this module, add it to the modules array in the `config/config.js` file:

### Sample
```javascript
{
	module: "MMM-Jast",
	position: "top_left",
	config: {
		maxWidth: "100%",
		updateIntervalInSeconds: 300,
		fadeSpeedInSeconds: 3.5, // Higher value: vertical -> faster // horizontal -> slower
		scroll: "<none, vertical, horizontal>",
		showDepotGrowth: true,
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
| Field    					| Description 																	| Default 				|
| -------- 					| -------- 																		| -------- 				|
| updateIntervalInSeconds   | (Integer) Interval to refresh stock data from server.							| 300   	|
| fadeSpeedInSeconds		| (Integer) Animation speed for ticker.	Higher value: vertical -> faster // horizontal -> slower										| 3.5   				|
| stocks					| (Array<Stock>) Array of stocks to be displayed								| Sample set			|
| scroll					| (String) Animation direction for ticker. Values: none, vertical or horizontal	| "vertical"  			|
| maxWidth					| (String) CSS style to limit ticker width										| "100%"   				|
| showDepotGrowth			| (Boolean) Show depot value growth summary in ticker							| false   				|

### Stock Object
| Field    			| Description 														| Example 	|
| -------- 			| -------- 															| -------- 	|
| name   			| (String) Stock's display name   									| "Alibaba"	|
| symbol   			| (String) Stock's symbol/key   									| "BABA"   	|
| quantity   		| (Integer) Optional: To calculate depotGrowth   					| 500   	|
