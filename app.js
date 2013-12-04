'use strict';

var express = require('express');
var routes = require('./routes');
var tools = require('./routes/tools');
var adminRoute = require('./routes/admin');
var websiteRoute = require('./routes/website');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(express);
var app = express();

mongoose.connect('mongodb://localhost/truyen');
// mongoose.connect('mongodb://www.fulltruyen.com/truyen');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());  
  app.use(express.session({
    secret: '076ee61d63aa10a125ea872411e433b9',
    cookie: {maxAge: 43200000},
    store: new MongoStore({db: 'truyen', clear_interval: 1})
  }));
  // app.use(express.cookieParser('your secret here'));
  // app.use(express.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function check_auth(req, res, next) {
  if(!req.session.authenticated) {
    res.redirect("/login");
    return;
  }
  next();
}

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', null);
  // res.header('Content-Type', null);
  
  next();
});

app.get('/mangaList', routes.mangaList);
app.get('/manga', routes.manga);
app.get('/mangaReading', routes.mangaReading);
app.get('/checkUnlockFunction', routes.checkUnlockFunction);
app.get('/unlockFunction', routes.unlockFunction);
app.get('/unlockFunction', routes.unlockFunction);
app.get('/storyAudio', routes.storyAudio);
app.get('/addFavorite', routes.addFavorite);
app.get('/removeFavorite', routes.removeFavorite);
app.get('/getFavorites', routes.getFavorites);
app.get('/storyList', routes.storyList);
app.get('/getStory', routes.getStory);
app.get('/getStoryContent', routes.getStoryContent);
app.get('/storyAudioList', routes.storyAudioList)
app.get('/support', routes.support);
app.get('/adv', routes.adv);
app.get('/appVersion', routes.getAppVersion);

//render
app.get('/facebook', routes.facebook);

// ## website
app.get('/contactUs', websiteRoute.contactUs);
app.get('/', websiteRoute.contactUs);

//## import manga
app.get('/import', tools.importManga);
app.get('/resize', tools.resizeImages);

//# ADMIN ############
app.get('/login', adminRoute.login);
app.get('/logout', adminRoute.logout);
app.get('/userInfo', check_auth, adminRoute.userInfo);
app.get('/listUser', check_auth, adminRoute.listUser);
app.get('/addUser', check_auth, adminRoute.addUserPage);
app.get('/editUser', check_auth, adminRoute.editUserPage);
app.post('/editUser', check_auth, adminRoute.editUser);
app.post('/addUser', check_auth, adminRoute.addUser);

app.get('/admin', check_auth, adminRoute.index);
app.get('/listManga', check_auth, adminRoute.listManga);
app.get('/listAudio', check_auth, adminRoute.listAudio);
app.get('/addAudio', check_auth, adminRoute.addAudioPage);
app.get('/removeAudio', check_auth, adminRoute.removeAudio);
app.get('/addStory', check_auth, adminRoute.addStoryPage);
app.get('/editStory', check_auth, adminRoute.editStoryPage);
app.get('/checkStory', check_auth, adminRoute.checkStory);
app.get('/removeStory', check_auth, adminRoute.removeStory);
app.get('/addStoryChapter', check_auth, adminRoute.addStoryChapterPage);
app.get('/removeStoryChapter', check_auth, adminRoute.removeStoryChapter);
app.get('/editStoryChapter', check_auth, adminRoute.editStoryChapterPage);
app.get('/listStory', check_auth, adminRoute.listStory);

app.post('/authenticate', adminRoute.authenticate);
app.post('/updateUserInfo', check_auth, adminRoute.updateUserInfo);
app.post('/addStory', check_auth, adminRoute.addStory);
app.post('/editStory', check_auth, adminRoute.editStory);
app.post('/addStoryChapter', check_auth, adminRoute.addStoryChapter);
app.post('/updateStories', check_auth, adminRoute.updateStories);
app.post('/editStoryChapter', check_auth, adminRoute.editStoryChapter);
app.post('/updateAudios', check_auth, adminRoute.updateAudios);
app.post('/addAudio', check_auth, adminRoute.addAudio);
app.post('/updateMangas', check_auth, adminRoute.updateMangas);
//###################

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});