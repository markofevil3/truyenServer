'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;
var News = require('../models/models').News;

var NewsController = require('./newsController');

var mainCateList = {
  listStory: {
    text: "Sách truyện",
    subCate: [],
    link: "/danh-sach-truyen/1/4/des"
  },
  news: {
    text: "Điểm tin",
    subCate: [],
    link: "/diem-tin"
  },
  listManga: {
    text: "Truyện tranh",
    subCate: [],
    link: "/"
  },
  listAudio: {
    text: "Radio",
    subCate: [],
    link: "/"
  },
  shareEmotion: {
    text: "Góc nhỏ tâm hồn",
    subCate: ["poetry", "shortStory", "experience"],
    link: "/"
  },
  contactUs: {
    text: "Liên hệ",
    subCate: [],
    link: "/contactUs"
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
// page for paging story list
var numPage = 30;
var maxStoryPage;
var homePageBottomMaxBook = 10;

var sliderBooks;

var newBooks;

var listBooks;

var homePageNews;

updateCacheData();

setInterval(updateCacheData, 7200000);

function updateCacheData() {
  Story.find({}, '_id title author cover cate updatedAt datePost numView status').exec(function(error, stories) {
    listBooks = stories;
    maxStoryPage = Math.ceil(listBooks.length / numPage);
    sliderBooks = listBooks.slice(0).sort(Util.dynamicSort('datePost', -1)).slice(0, 30);
  });
  News.find({}, '_id title datePost shortDes').sort({'datePost': -1}).skip(0).limit(homePageBottomMaxBook).exec(function(error, news) {
    homePageNews = news;
  });
  // Story.find({}, '_id title author shortDes cover').skip(0).limit(30).exec(function(error, stories) {
  //   sliderBooks = stories;
  // });
}

function getBooksByCate(cateType, bookId) {
  var books = [];
  for (var i = 0; i < listBooks.length; i++) {
    if (listBooks[i].cate.indexOf(cateType) != -1 && listBooks[i]._id.toString() != bookId.toString()) {
      books.push(listBooks[i]);
    }
  }
  return books;
}

function getFullStatusBooks() {
  var books = [];
  for (var i = 0; i < listBooks.length; i++) {
    if (listBooks[i].status == 0) {
      books.push(listBooks[i]);
    }
  }
  return books;
}

exports.updateCacheDataNow = function() {
  updateCacheData();
};

exports.contactUs = function(req, res) {
  res.render('contactUs', { 
    title: 'Liên hệ | Full Truyện',
    error: '',
    category: category,
    allBooks: listBooks
  });
};

exports.homePage = function(req, res) {
  var newBooks = listBooks.slice(0).sort(Util.dynamicSort('updatedAt', -1)).slice(0, homePageBottomMaxBook);
  var hotBooks = listBooks.slice(0).sort(Util.dynamicSort('numView', -1)).slice(0, homePageBottomMaxBook);
  var fulledBooks = getFullStatusBooks().sort(Util.dynamicSort('datePost', -1)).slice(0, homePageBottomMaxBook);
  res.render('index', { 
    title: 'Full Truyện',
    error: '',
    category: category,
    sliderBooks: sliderBooks,
    newBooks: newBooks,
    hotBooks: hotBooks,
    fulledBooks: fulledBooks,
    allBooks: listBooks,
    homePageNews: homePageNews
  });
};

exports.listStories = function(req, res) {
  var stories;
  if (req.params.orderType == undefined) {
    req.params.orderType = "4";
  }
  if (req.params.orderStyle == undefined) {
    req.params.orderStyle = "des";
  }
  if (req.params.page == undefined) {
    req.params.page = "1";
  }
  switch(req.params.orderType) {
    case "0": // title
      stories = listBooks.slice(0).sort(Util.dynamicSort('title', req.params.orderStyle == "asc" ? 1 : -1));
    break;
    case "1": // author
      stories = listBooks.slice(0).sort(Util.dynamicSort('author', req.params.orderStyle == "asc" ? 1 : -1));
    break;
    case "2": // type
      stories = listBooks.slice(0).sort(Util.dynamicSort('cate', req.params.orderStyle == "asc" ? 1 : -1));
    break;
    case "3": // view
      stories = listBooks.slice(0).sort(Util.dynamicSort('numView', req.params.orderStyle == "asc" ? 1 : -1));
    break;
    case "4": // date post
    default: // datepost
      stories = listBooks.slice(0).sort(Util.dynamicSort('datePost', req.params.orderStyle == "asc" ? 1 : -1));
  }

  res.render('listStory', { 
    title: 'Danh sách truyện | Full Truyện',
    error: '',
    category: category,
    totalPage: 5,
    stories: stories.splice(numPage * (parseInt(req.params.page) - 1), numPage),
    orderType: req.params.orderType,
    orderStyle: req.params.orderStyle,
    maxStoryPage: maxStoryPage,
    currentPage: parseInt(req.params.page),
    storyTypes: Util.storyCate,
    allBooks: listBooks
  });
};

exports.getStory = function(req, res) {
  Story.findOne({ '_id': req.params.storyId }, '_id author cover source poster translator status title datePost cate numView shortDes chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    var suggestCate = story.cate.randomElement();
    var suggestBooks;
    if (suggestCate) {
      suggestBooks = getBooksByCate(suggestCate, story._id);
      suggestBooks.sort(Util.dynamicSort('datePost', -1));
      suggestBooks = suggestBooks.slice(0, 8);
    }
    story.chapters.sort(Util.dynamicSort('chapter', 1));
    res.render('story', { 
      title: story.title + ' | Full Truyện',
      error: '',
      category: category,
      story: story,
      suggestBooks: suggestBooks,
      allBooks: listBooks
    });
  });
};

function getNextPrevChapter(chapters, chapterId) {
  var next, prev, index;
  for (var i = 0; i < chapters.length; i++) {
    if (chapters[i]._id.toString() == chapterId.toString()) {
      index = i;
    }
  }
  if (chapters[index + 1]) {
    next = chapters[index + 1];
  }
  if (chapters[index - 1]) {
    prev = chapters[index - 1];
  }
  return {next: next, prev: prev};
}

exports.getStoryChapter = function(req, res) {
  Story.findOne({ '_id': req.params.storyId }).exec(function(error, story) {
    story.numView++;
    story.save();
    story.chapters.sort(Util.dynamicSort('chapter', 1));
    var chapter = story.chapters.id(req.params.storyChapterId);
    res.render('storyReading', { 
      title: chapter.title + ' | Full Truyện',
      error: '',
      category: category,
      story: story,
      chapter: chapter,
      nextPrevChapter: getNextPrevChapter(story.chapters, req.params.storyChapterId),
      allBooks: listBooks
    });
  });
}

exports.getListBooks = function() {
  return listBooks;
}

exports.getCategory = function() {
  return category;
}

exports.listNews = function(req, res) {
  NewsController.listNewsForWebsite(req, res);
}

exports.readingNews = function(req, res) {
  NewsController.readingNews(req, res);
};