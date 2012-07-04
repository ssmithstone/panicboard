
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , xml2js = require('xml2js');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/weather/:city' , function(req, res){

	var weatherApi = "http://www.google.com/ig/api?weather=" + req.params.city;
	
	http.get(weatherApi, function(r){
		res.setHeader("Content-Type", "application/json");
		var result = "";
		r.on("data" , function(chunk){
			result += chunk;
		}).on("end" , function(){
			var parser = new xml2js.Parser();
			parser.parseString(result , function(err , xmlresult){
				res.end(JSON.stringify(xmlresult));
			});			
		});		
	}).on('error' , function(e){
		console.log(e.message);
	});
	
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
