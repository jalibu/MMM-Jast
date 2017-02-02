# MMM-Stock
Stock prices third party module for Magic Mirror

##Installing the Module
Navigate into your MagicMirror's modules folder and execute <br>
`git clone https://github.com/hakanmhmd/MMM-Stock.git`
## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
{
    		module: 'MMM-Stock',
    		position: position,
    		config: {
    			companies: ['MSFT', 'GOOG', 'ORCL', 'FB'] (check each company ticker symbol in yahoo finance)
			currency: 'gbp' (dont use this if you need the currency to be USD)
    		}
}
````


````css

@keyframes ticker {
	0%   {margin-top: 0}
	25%  {margin-top: -30px}
	50%  {margin-top: -60px}
	75%  {margin-top: -90px}
	100% {margin-top: 0}
}

Make sure to play with these in case you change the number to stocks shown.
If there are 4 companies -> 100/4=25% for each of them
````
