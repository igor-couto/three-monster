var express = require("express");
var http = require("http");
var morgan = require("morgan");
var fs = require("fs");

module.exports = function() {
    var app = express();
    var server = http.Server(app);
    
    // set loggers
    var logFile = fs.createWriteStream("./acesso.log", {flags: 'a'});
    app.use(morgan('combined', {stream: logFile}));
    app.use(morgan('dev'));
    // set views
    app.use(express.static('./public'));
	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	// set routes
	require("./../app/routes/router")(app);
    
    return server;
}