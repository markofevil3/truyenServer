'use strict';

var Util = require('../lib/util');

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
  Manga.find({}).sort( 'title', 1 ).exec(function(error, mangas) {
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
      User.findOne({ 'userId': req.query.userId }, function(error, user) {
        if (user == null) {
          res.json({ 'data': manga, 'favorite': false });
        } else {
          if (Util.contain(user.favorites, 'itemId', manga._id)) {
            res.json({ 'data': manga, 'favorite': true });
          } else {
            res.json({ 'data': manga, 'favorite': false });
          }
        }
      });
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
};

exports.addFavorite = function(req, res) {
  User.findOne({ 'userId': req.query.userId }, function(error, user) {
    if (error) {
      console.log(error);
    }
    if (user == null) {
      user = new User({ 'userId': req.query.userId });
      user.username = req.query.username;
      user.fullName = req.query.fullName;
      user.favorites = [];
    } else {
      user.fullName = req.query.fullName;
    }
    if (!Util.contain(user.favorites, 'itemId', req.query.itemId )) {
      user.favorites.push({ 'itemId': req.query.itemId, 'itemType': req.query.itemType });
    }
    user.save(function(error) {
      if (error) {
        console.log(error);
        res.json({ 'data': error });
      }
      res.json({ 'data': 'success' });
    })
  });
};

exports.removeFavorite = function(req, res) {
  User.findOne({ 'userId': req.query.userId }, function(error, user) {
    if (error) {
      console.log(error);
    }
    if (user == null) {
      res.json({ 'data': false });
    } else {
      var favorite = user.favorites.id(req.query.itemId);
      if (favorite != null) {
        favorite.remove(function() {
          user.save();
        });
      }
      res.json({ 'data': 'success' });
    }
  });
};

exports.getFavorites = function(req, res) {
  User.findOne({ 'userId': req.query.userId }, function(error, user) {
    if (error) {
      console.log(error);
    }
    if (user == null) {
      res.json({ 'data': false });
    } else {
      var favorites = {};
      var mangaIds = [];
      var storyIds = [];
      var funnyIds = [];
      for (var i = 0; i < user.favorites.length; i++) {
        var itemType = user.favorites[i].itemType;
        switch(itemType.toString()) {
          case '0':
            mangaIds.push(user.favorites[i].itemId);
            break;
          case '1':
            storyIds.push(user.favorites[i].itemId);
            break;
          case '2':
            funnyIds.push(user.favorites[i].itemId);
            break;
        }
      }
      Manga.find({ '_id': { $in: mangaIds }}).sort('title', 1).exec(function(error, mangas) {
        if (error) {
          console.log(error);
          res.json({ 'data': false });
        }
        if (mangas != null) {
          favorites['manga'] = mangas;
        }
        res.json({ 'data': favorites });
      });
    }
  });
}