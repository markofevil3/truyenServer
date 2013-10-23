'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;

exports.index = function(req, res) {
  Story.find({}, '_id title author datePost numView shortDes type chapters.chapter').sort( 'title', 1 ).exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    res.render('admin/index', { 
      title: 'Full Truyện',
      error: '',
      stories: stories
    });
  });
};