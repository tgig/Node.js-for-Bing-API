Use node.js and express and request to call Bing API
====================================================

* Node.js is the language
* Express displays the web page
* Request gets the data
* Plates handles template

Just a simple example to call the (new) Bing API at 

https://api.datamarket.azure.com/Bing/SearchWeb/v1/Web

------------------------

*Config.js* is not included in this repo, but it looks like this:

    var config = {};
    config.BingAPI = {};
    
    config.BingAPI.url = 'https://api.datamarket.azure.com/Bing/SearchWeb/v1/Web?$format=json&Query=';
    config.BingAPI.key = '[account key goes here]';
    
    module.exports = config;


