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
    			companies: ['company1', 'company2'] (check each company ticker symbol in yahoo finance)
    		}
}
````

