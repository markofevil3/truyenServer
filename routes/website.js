'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;

var mainCateList = {
  listStory: {
    text: "Sách truyện",
    subCate: [],
  },
  listManga: {
    text: "Truyện tranh",
    subCate: [],
  },
  listAudio: {
    text: "Radio",
    subCate: [],
  },
  news: {
    text: "Điểm tin",
    subCate: [],
  },
  shareEmotion: {
    text: "Góc nhỏ tâm hồn",
    subCate: ["poetry", "shortStory", "experience"]
  },
  contactUs: {
    text: "Liên hệ",
    subCate: [],
  }
}

var subCateList = {
  poetry: {
    text: "Thơ",
    link: "#"
  },
  shortStory: {
    text: "Truyện ngắn",
    link: "#"
  },
  experience: {
    text: "Trải nghiệm",
    link: "#"
  }
}

var category = {
  mainCateList: mainCateList,
  subCateList: subCateList
}
var sliderBooks;
Story.find({}, '_id title author shortDes cover').skip(0).limit(30).exec(function(error, stories) {
  sliderBooks = stories;
});

var newBooks;

exports.contactUs = function(req, res) {
  res.render('contactUs', { 
    title: 'Full Truyện',
    error: '',
    category: category
  });
};

exports.homePage = function(req, res) {
  res.render('index', { 
    title: 'Full Truyện',
    error: '',
    category: category,
    sliderBooks: sliderBooks
  });
}