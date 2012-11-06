'use strict';

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/truyen');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/mangaList', routes.mangaList);
app.get('/manga', routes.manga);
app.get('/mangaReading', routes.mangaReading);
app.get('/addFavorite', routes.addFavorite);
app.get('/removeFavorite', routes.removeFavorite);
app.get('/getFavorites', routes.getFavorites);
app.get('/storyList', routes.storyList);
app.get('/getStory', routes.getStory);
app.get('/getStoryChapter', routes.getStoryChapter);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});