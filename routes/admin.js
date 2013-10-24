'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');
var adminRoute = require('./admin');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;

exports.index = function(req, res) {
  if (req.query.type == "manga") {
    Manga.find({}, '_id title author cover').sort( 'title', 1 ).exec(function(error, mangas) {
      if (error) {
        console.log(error);
      }
      res.render('admin/listManga', { 
        title: 'Full Truyện',
        error: '',
        mangas: mangas
      });
    });
  } else {
    Story.find({}, '_id title author datePost numView shortDes cover type').sort( 'title', 1 ).exec(function(error, stories) {
      if (error) {
        console.log(error);
      }
      res.render('admin/index', { 
        title: 'Full Truyện',
        error: '',
        stories: stories
      });
    });
  }
};

exports.updateStories = function(req, res) {
  Story.find({}, '_id title author shortDes cover type').sort( 'title', 1 ).exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    var count = 0;
    for (var i = 0; i < stories.length; i++) {
      if (stories[i].title != req.body["story-title-" + stories[i]._id.toString()]) {
        stories[i].title = req.body["story-title-" + stories[i]._id.toString()];
      }
      if (stories[i].author != req.body["story-author-" + stories[i]._id.toString()]) {
        stories[i].author = req.body["story-author-" + stories[i]._id.toString()];
      }
      if (stories[i].cover != req.body["story-cover-" + stories[i]._id.toString()]) {
        stories[i].cover = req.body["story-cover-" + stories[i]._id.toString()];
      }
      stories[i].save(function() {
        count++;
        if (count == stories.length) {
          adminRoute.index(req, res);
        }
      })
    }
  });
}