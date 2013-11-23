'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;
var StoryAudio = require('../models/models').StoryAudio;

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
   user:     "fulltruyen@gmail.com", 
   password: "fulltruyenthuquan", 
   host:     "smtp.gmail.com", 
   ssl:      true
});

var admobPublisher = {"android": "123456",
                      "iphone": "a15283aa0b43c3f",
											"ipad": "a15283aa5be9001"
										 };
var advPublisher = 0; // 0: iad, 1: admob
var appVersion = "1.2";
var iosLink = "itms-apps://itunes.apple.com/us/app/truyen/id718172153?ls=1&mt=8";
var androidLink = "http://www.google.com";
var forceUpdate = false;
// var facebookPostLink = 'https://www.facebook.com/pages/Truy%E1%BB%87n-tranh-Truy%E1%BB%87n-ng%E1%BA%AFn-Truy%E1%BB%87n-c%C6%B0%E1%BB%9Di/518980604798172';
var facebookPostLink = 'https://itunes.apple.com/us/app/full-truyen/id718172153?ls=1&mt=8';
var detectBrowserKey = "Appcelerator Titanium";
var audioType = ['truyện ngắn', 'truyện đêm khuya', ' truyện dài'];

exports.getAppVersion = function(req, res) {
  res.json({ 'version': appVersion, 'iosLink': iosLink, 'androidLink': androidLink, 'force': forceUpdate, 'facebookPostLink': facebookPostLink, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
};

exports.storyAudioList = function(req, res) {
  StoryAudio.find({}).sort( 'title', 1 ).exec(function(error, storyAudios) {
    if (error) {
      console.log(error);
    }
    res.json({ 'data': storyAudios, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
  });
}

exports.storyAudio = function(req, res) {
  StoryAudio.findOne({ '_id': req.query.id }, function(error, audio) {
    if (error) {
      console.log(error);
    }
    if (audio != null) {
      if (audio.numView) {
        audio.numView += 1;
      } else {
        audio.numView = 1;
      }
      console.log("getAudio - " + audio.title);
      audio.save();
    }
    res.json({ 'data': 'success', 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
  });
}

exports.storyList = function(req, res) {
  Story.find({}, '_id title author datePost numView type cover cate').sort( 'title', 1 ).exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    res.json({ 'data': stories, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
  });
};

exports.getStory = function(req, res) {
  Story.findOne({ '_id': req.query.id }, '_id author cover title datePost numView shortDes chapters.chapter chapters.title chapters._id', function(error, story) {
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
      for (var i = 0; i < story.chapters.length; i++) {
        if (story.chapters[i].chapter != story.chapters[i].title) {
          story.chapters[i].chapter = story.chapters[i].title;
        }
      }
      story.save(function() {
        console.log("getStory - " + story.title);
        User.findOne({ 'userId': req.query.userId }, function(error, user) {
          story.chapters.sort(Util.dynamicSort('chapter', -1));
          if (user == null) {
            res.json({ 'data': story, 'favorite': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
          } else {
            if (Util.contain(user.favorites, 'itemId', story._id)) {
              res.json({ 'data': story, 'favorite': true, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
            } else {
              res.json({ 'data': story, 'favorite': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
            }
          }
        });
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
      console.log("getStoryContent - " + story.title);
      if (req.query.type == 0) {
        res.json({ 'data': story, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
      } else {
        var chapter = story.chapters.id(req.query.chapter);
        res.json({ 'data': chapter, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
      }
    }
  });
};

exports.mangaList = function(req, res) {
  Manga.find({}, '_id title author cover datePost numView source folder').sort( 'title', 1 ).exec(function(error, mangas) {
    if (error) {
      console.log(error);
    }
    res.json({ 'data': mangas, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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
      console.log("manga - " + manga.title);
      User.findOne({ 'userId': req.query.userId }, function(error, user) {
        manga.chapters.sort(Util.dynamicSortNumber('chapter', -1));
        if (user == null) {
          res.json({ 'data': manga, 'favorite': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
        } else {
          if (Util.contain(user.favorites, 'itemId', manga._id)) {
            res.json({ 'data': manga, 'favorite': true, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
          } else {
            res.json({ 'data': manga, 'favorite': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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
      console.log("mangaReading - " + manga.title);
      manga.chapters.sort(Util.dynamicSortNumber('chapter', -1));
      var chapter = manga.chapters.id(req.query.chapter);
      chapter.pages.sort();
      res.json({ 'data': chapter, 'nextPrevChapters': getNextPrevChapter(manga.chapters, req.query.chapter), 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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

exports.checkUnlockFunction = function(req, res) {
  if (req.headers['user-agent'].indexOf(detectBrowserKey) > -1) {
    User.findOne({ 'userId': req.query.userId }, function(error, user) {
      if (error) {
        console.log(error);
      }
      if (user == null) {
        user = new User({ 'userId': req.query.userId });
        user.username = req.query.username;
        user.fullName = req.query.fullName;
        user.favorites = [];
        user.unlock = [];
      } else {
        user.fullName = req.query.fullName;
      }
      var check;
      if (user.unlock) {
        check = (user.unlock.indexOf(req.query.type) > -1);
      } else {
        user.unlock = [];
        check = false;
      }
      if (!check) {
        user.pTime = new Date().getTime() + "";
      }
      user.save(function(error) {
        if (error) {
          console.log(error);
          res.json({ 'data': error, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
        }
        res.json({ 'data': {isPurchased: check, time: user.pTime}, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
        //res.json({ 'data': {isPurchased: true, time: user.pTime}, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
      });
    });
  } else {
    console.log("Hacking!");
    res.json({'data': "Cant process request!"});
  }
};

exports.unlockFunction = function(req, res) {
  if (req.headers['user-agent'].indexOf(detectBrowserKey) > -1) {
    User.findOne({ 'userId': req.query.userId }, function(error, user) {
      if (error) {
        console.log(error);
      }
      if (user == null) {
        console.log("Cant find user " + req.query.userId);
      } else {
        if (user.unlock.indexOf(req.query.type) <= -1 && req.query.time && req.query.time != null && user.pTime == req.query.time) {
          user.unlock.push(req.query.type);
          user.pTime = "";
        } else {
          console.log("Cant purchase " + req.query.type);
        }
        user.save(function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
      res.json({ 'data': 'success', 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
    });
  } else {
    console.log("Hacking!");
    res.json({'data': "Cant process request!"});
  }
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
        res.json({ 'data': error, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
      }
      res.json({ 'data': 'success', 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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
        res.json({ 'data': 'success', 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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
      res.json({ 'data': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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
          res.json({ 'data': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
        }
        if (mangas != null) {
          favorites['manga'] = mangas;
        }
        Story.find({ '_id': { $in: storyIds }}, '_id author title datePost numView shortDes chapters.chapter chapters.title chapters._id type').sort('title', 1).exec(function(error, stories) {
          if (error) {
            console.log(error);
            res.json({ 'data': false, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
          }
          if (stories != null) {
            favorites['story'] = stories;
          }
          res.json({ 'data': favorites, 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
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
    from:    req.query.email, 
    to:      "fulltruyen@gmail.com",
    subject: "Full Truyện Support - " + req.query.email
  }, function(err, message) { 
    console.log(err || message);
    res.json({ 'data': 'success' });
  });
};

exports.adv = function(req, res) {
  res.json({ 'data': ADV_LINKS[req.query.type ], 'advPublisher': advPublisher, 'admobPublisher': admobPublisher });
}
