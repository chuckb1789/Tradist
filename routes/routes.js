var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (app) {
  // our public static route for all our miscellaneous files
  app.use(express.static('./public'));

  // add our body-parser middleware to parse the pokemon API body response
  app.use(bodyParser.json());

  // GET: / (root route)
  app.get('/login', function (req, res) {
      res.sendFile('index.html', { root: './public' });
  });

  app.get('/signup', function(req, res) {
      res.sendFile("index.html", {root: './public'});
  });

}
