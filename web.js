//include config file
var config = null;
try {
	config = require('./config');
}
catch (e) {
	config = {};
	config.BingAPI = {};
	config.BingAPI.key = process.env.BING_API_KEY; 
	config.BingAPI.url = process.env.BING_API_URL; //'https://api.datamarket.azure.com/Bing/SearchWeb/v1/Web?$format=json&Query=';
}

//include express
var express = require('express');
//var app = express();
var app = express.createServer(express.logger());
app.use(express.bodyParser());

//pull data from web
var request = require("request");

//open and read file
var fs = require("fs");

//templating
var Plates = require("plates");



//test a simple text output to make sure everything is working
//access at http://localhost:3000/test in a browser
app.get('/test', function (req, res) {
	res.send("Hello beautiful!");
});


//load the template which contains search form
app.get('/', function (req, res) {
	fs.readFile('./templates/template-search.html', 'utf8', function (err, html) {
		if (err) {
			return console.log(err);
		}

		res.send(html);
	});
});

//template post-back, calls Bing API, loops through results and outputs
app.post('/', function (req, res) {
	fs.readFile('./templates/template-search.html', 'utf8', function (err, html) {
		if (err) {
			return console.log(err);
		}

		var compile = "";
		var snip = "<p>(data)</p>";
		var searchTerm = req.param('txtSearchTerm', 'empty');

		
		GetSearchResults(searchTerm, function (jsonSearchResults) { 
			
			var jsonResults = JSON.parse(jsonSearchResults);
			var r = jsonResults.d.results;

			//var output = jsonResults.d.results[0].Description;

			for (var i = 0; i < r.length; i++) {
				//compile += snip.replace("(data)", i);
				compile += snip.replace('(data)', '<b><a href="' + r[i].Url + '">' + r[i].Title + '</a></b>'
						+ '<br>' + r[i].Description
						+ '<br><a href="' + r[i].Url + '">' + r[i].DisplayUrl + '</a>');
			}

			var compiled = { 'divResults': '<div class="row"><div class="span4">' + compile + '</div></div>' };
			var output = Plates.bind(html, compiled);

			res.send(output);
		});

	});
});


//call MS Web API
GetSearchResults = function (searchTerm, callback) {

	var apiRoot = config.BingAPI.url;
	var apiKey = config.BingAPI.key;
	searchTerm = encodeURIComponent("'" + searchTerm + "'");
	var callURI = apiRoot + searchTerm;

	var options = {
		'method': 'GET',
		'uri': callURI,
		'headers': {
			'Authorization': 'Basic ' + new Buffer(apiKey + ':' + apiKey).toString('base64')
		}
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//return body;
			callback(body);
		}
		else if (error) {
			console.log("error: " + error);
			//return 'error, check console log';
			callback('error, check console log');
		}
		else {
			console.log("Response code: " + response.statusCode + "\nContent: " + body);
			//return 'error, check console log';
			callback('error, check console log');
		}
	});

};



//listen on port 3000 for localhost or whatever for heroku deploy
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

