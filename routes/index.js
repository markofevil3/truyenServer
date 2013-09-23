'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;

var ADV_LINKS = [
  'http://google.com',
  'http://google.com',
  'http://google.com',
  'http://google.com',
  'http://google.com',
  'http://google.com',
  'http://google.com',
  'http://google.com',
];

var APP_KEY = 'rlui03MfFtEXzOr9HooyAfDnze0lQb0u';
var PUSH_NOTIFICATION_TYPE = 'ios';

var emailServer  = email.server.connect({
   user:     "bpquan205@gmail.com", 
   password: "Strawberry205", 
   host:     "smtp.gmail.com", 
   ssl:      true
});

exports.storyList = function(req, res) {
  // for (var i = 0; i < 5; i++) {
  //   var story = new Story({});
  //   story.title = 'Full story ' + i;
  //   story.author = 'Phi Quan';
  //   story.datePost = Date.now();
  //   story.type = 1;
  //   for (var j = 0; j < 5; j++) {
  //     var chapter = {
  //       chapter: j + 1,
  //       title: 'Chua co Title',
  //     }
  //     story.chapters.push(chapter);
  //   }
  //   story.save();
  // }
  Story.find({}, '_id title author datePost numView shortDes type chapters.chapter').sort( 'title', 1 ).exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    res.json({ 'data': stories });
  });
};

exports.getStory = function(req, res) {
  Story.findOne({ '_id': req.query.id }, '_id author title datePost numView shortDes chapters.chapter chapters.title chapters._id', function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story == null) {
      console.log(error);
    } else {
      if (story.numView) {
        story.numView++;
      } else {
        story.numView = 1;
      }
      story.save();
      User.findOne({ 'userId': req.query.userId }, function(error, user) {
        story.chapters.sort(Util.dynamicSortNumber('chapter', -1));
        if (user == null) {
          res.json({ 'data': story, 'favorite': false });
        } else {
          if (Util.contain(user.favorites, 'itemId', story._id)) {
            res.json({ 'data': story, 'favorite': true });
          } else {
            res.json({ 'data': story, 'favorite': false });
          }
        }
      });
    }
  });
};

exports.getStoryContent = function(req, res) {
  Story.findOne({ '_id': req.query.id }, function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story == null) {
      console.log(error);
    } else {
      if (req.query.type == 0) {
        res.json({ 'data': story });
      } else {
        var chapter = story.chapters.id(req.query.chapter);
        res.json({ 'data': chapter });
      }
    }
  });
};

exports.mangaList = function(req, res) {
  Manga.find({}, '_id title author cover datePost numView source folder').sort( 'title', 1 ).exec(function(error, mangas) {
    if (error) {
      console.log(error);
    }
    res.json({ 'data': mangas });
  });
};

exports.manga = function(req, res) {
  Manga.findOne({ '_id': req.query.id }, '_id title folder author cover datePost numView source chapters._id chapters.chapter chapter.title', function(error, manga) {
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
        manga.chapters.sort(Util.dynamicSortNumber('chapter', -1));
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
  Manga.findOne({ '_id': req.query.id }, function(error, manga) {
    if (error) {
      console.log(error);
    }
    if (manga == null) {
      console.log(error);
    } else {
      manga.chapters.sort(Util.dynamicSortNumber('chapter', -1));
      var chapter = manga.chapters.id(req.query.chapter);
      res.json({ 'data': chapter, 'nextPrevChapters': getNextPrevChapter(manga.chapters, req.query.chapter) });
    }
  });
};

function getNextPrevChapter(chapters, chapterId) {
  var next, prev, index;
  for (var i = 0; i < chapters.length; i++) {
    if (chapters[i]._id.toString() == chapterId.toString()) {
      index = i;
    }
  }
  if (chapters[index - 1]) {
    next = chapters[index - 1]._id;
  }
  if (chapters[index + 1]) {
    prev = chapters[index + 1]._id;
  }
  return {next: next, prev: prev};
}

// function subscribeNotification(channel, deviceToken) {
//   request.post(
//       'https://api.cloud.appcelerator.com/v1/push_notification/subscribe.json?key=' + APP_KEY,
//       { form: { type: PUSH_NOTIFICATION_TYPE,
//                 channel: channel,
//                 device_token: deviceToken
//               }       
//       },
//       function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//               console.log(body)
//           }
//           console.log(error);
//       }
//   );
// };
// 
// function unsubscribeNotification(channel, deviceToken) {
//   
// };

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
      for (var i = 0; i < user.favorites.length; i++) {
        if (user.favorites[i].itemId.toString() == req.query.itemId.toString()) {
          user.favorites[i].remove();
        }
      }
      user.save(function() {
        res.json({ 'data': 'success' });
      });
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
      Manga.find({ '_id': { $in: mangaIds }}, '_id author folder cover title datePost numView chapters.chapter chapters.title chapters._id').sort('title', 1).exec(function(error, mangas) {
        if (error) {
          console.log(error);
          res.json({ 'data': false });
        }
        if (mangas != null) {
          favorites['manga'] = mangas;
        }
        Story.find({ '_id': { $in: storyIds }}, '_id author title datePost numView shortDes chapters.chapter chapters.title chapters._id type').sort('title', 1).exec(function(error, stories) {
          if (error) {
            console.log(error);
            res.json({ 'data': false });
          }
          if (stories != null) {
            favorites['story'] = stories;
          }
          res.json({ 'data': favorites });
        });
      });
    }
  });
};

exports.facebook = function(req, res) {
  if (req.query.type == 0) {
    res.render('facebook', { 
      title: 'STruyen Facebook Page',
      type: 'handheld',
      height: 100
    });
  } else {
    res.render('facebook', { 
      title: 'STruyen Facebook Page',
      type: 'tablet',
      height: 200
    });
  }
};

exports.support = function(req, res) {
  emailServer.send({
    text:    req.query.content, 
    from:    "bpquan205@gmail.com", 
    to:      "bpquan205@gmail.com",
    subject: "STruyen Support"
  }, function(err, message) { 
    console.log(err || message); 
    res.json({ 'data': 'success' });
  });
};

exports.adv = function(req, res) {
  res.json({ 'data': ADV_LINKS[req.query.type ]});
}