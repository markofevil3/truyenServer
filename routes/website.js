'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;

exports.contactUs = function(req, res) {
  res.render('contactUs', { 
    title: 'Full Truyện',
    error: '',
  });
};