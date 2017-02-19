var express = require('express');
var app = express();


var logger = require('morgan');
app.use(logger('dev'));

var request = require('request');

var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/authdemo');

var bodyParser = require("body-parser");

var HTTP = require('http');
var HTTPS = require('https');
fs = require('fs');

var bcrypt = require('bcryptjs');

var sessionsModule = require('client-sessions')

//Middleware so we can see our req object info.
app.use(function(req, res, next){

	var requestInfo = {
		method  : req.method, // What kind of request is this? GET, PUT, POST or DELETE
		path    : req.path,   // URL the request is going to
		query   : req.query,  // Info from GET requests
		body    : req.body,   // Info from POST requests
		params  : req.params, // Info from dynamic / paramaterized URLs

		// ip       : req.ip,       // IP address
		// protocol : req.protocol, // HTTP / HTTPS
		// headers  : req.headers,  // Headers from request
		// hostname : req.hostname  // Hostname
	};

	// console.log(req);
	console.log(requestInfo);
	next(); // Let the middleware chain continue

});

require('./routes/routes.js')(app);


//=============ENVIRONMENT VARIABLES==================
var APP_DIR=process.env.APP_DIR
var APIKEY =process.env.APIKEY

// ports = {
//   http: process.env.PORT || 8080,
//   https: process.env.PORT_SSL || 443
// };


//MIDDLEWARE THAT WILL REDIRECT ALL TRAFFIC TO HTTPS
// app.all('*', ( req, res, next ) => {
//     if( req.protocol === 'http' ) {
//         res.set('X-Forwarded-Proto','https');
//         res.redirect('https://'+ req.headers.host + req.url);
//         console.log("MIDDLEWARE HTTP TO HTTPS:", req);
//     } else {
//         next();
//     }
// });

console.log(APP_DIR);


//================REQUIRE ROUTES========================
// var router = require('./routes/routes.js');
// router(app);

// start an http server listening on the default port

// HTTP.createServer(app).listen(ports.http);

// start an https server listening on the default port

var PORT = process.env.PORT || 8080

app.listen(PORT, function(err) {
  if (err) {
    console.log("There was an error connecting:", err);
  } else {
    console.log("Connection up and running on port", PORT);
  }
});

// try {
//     var httpsConfig = { // https://nodejs.org/api/https.html
//          key:  fs.readFileSync(''),
//          cert: fs.readFileSync('')
//     };
//     HTTPS.createServer( httpsConfig, app ).listen( ports.https );
//     console.log("Server up and running via HTTPS");
// } catch (e) {
//     console.error('Could not HTTPS server:', e);
// }
