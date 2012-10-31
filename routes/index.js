'use strict';

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;

exports.mangaList = function(req, res) {
  // for (var i = 0; i < 30; i++) {
  //   var manga = new Manga({});
  //   manga.title = 'Doraemon ' + i;
  //   manga.author = 'Quan';
  //   manga.cover = '/images/manga/sample/cover2.jpg';
  //   manga.datePost = Date.now();
  //   manga.chapters = [];
  //   var chapter = null;
  //   for (var j = 0; j < 25; j++) {
  //     chapter = {
  //       'chapter': 'Chapter ' + (j+1),
  //       'title': 'Begin ' + (j+1),
  //       'numPages': 14
  //     }
  //     manga.chapters.push(chapter);
  //   }
  //   console.log(i);
  //   manga.save();
  // }
  Manga.find({}, function(error, mangas) {
    if (error) {
      console.log(error);
    }
    res.json({ 'data': mangas });
  });
};

exports.manga = function(req, res) {
  Manga.findOne({ '_id': req.query.id }, function(error, manga) {
    if (error) {
      console.log(error);
    }
    if (manga == null) {
      console.log(error);
    } else {
      if (manga.numView) {
        manga.numView++;
      } else {
        manga.numView = 1;
      }
      manga.save();
      res.json({ 'data': manga })
    }
  });
};

exports.mangaReading = function(req, res) {
  Manga.findOne({ 'chapter.i._id': req.query.id }, function(error, chapter) {
    if (error) {
      console.log(error);
    }
    if (chapter == null) {
      console.log(error);
    } else {
      res.json({ 'data': chapter })
    }
  });
  // var data = {
  //   'numPages': 14,
  //   '_id': 1,
  //   'nameIphone': 'sample'
  // };
  // res.json({ 'data': data });
};