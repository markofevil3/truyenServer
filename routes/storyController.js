'use strict';

var Util = require('../lib/util');
var email   = require('emailjs/email');
var request = require('request');
var adminRoute = require('./admin');
var fs = require('fs');

var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;
var StoryAudio = require('../models/models').StoryAudio;

exports.listStory = function(req, res) {
  Story.find({}, '_id title author datePost numView shortDes cover type').exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    if (req.query.orderBy) {
      switch(req.query.orderBy) {
        case "title":
          stories.sort(Util.dynamicSort('title', req.query.oType == "asc" ? 1 : -1));
        break;
        case "author":
          stories.sort(Util.dynamicSort('author', req.query.oType == "asc" ? 1 : -1));
        break;
        case "numView":
          stories.sort(Util.dynamicSortNumber('numView', req.query.oType == "asc" ? 1 : -1));
        break;
        case "datePost":
          stories.sort(Util.dynamicSort('datePost', req.query.oType == "asc" ? 1 : -1));
        break;
      }
    } else {
      req.query.orderBy = 'title';
      req.query.oType = 'title';
      stories.sort(Util.dynamicSort('title', 1));
    }
    res.render('admin/listStory', { 
      title: 'Full Truyện',
      error: '',
      accessToken: req.query.accessToken,
      stories: stories,
      orderBy: req.query.orderBy,
      oType: req.query.oType
    });
  });
};

exports.addStoryPage = function(req, res) {
  res.render('admin/addStory', { 
    title: 'Full Truyện',
    storyCates: Util.storyCate
  });
}

exports.addStory = function(req, res) {
  if (Util.checkAccessRight("addEditStory", req.session.user.accessable)) {
    var story = new Story({});
    story.title = req.body["storyTitle"];
    story.author = req.body["storyAuthor"];
    story.source = req.body["storySource"];
    story.translator = req.body["storyTranslator"];
    story.cate = parseInt(req.body["storyCate"]);
    story.cover = req.body["storyCover"];
    story.datePost = Date.now();
    story.updatedAt = Date.now();
    story.numView = 0;
    story.shortDes = req.body["storyShortDes"];
    story.type = 1;
    story.cate = req.body.storyCategory;
    if (req.files.storyCoverUpload.size > 0) {
      var data = fs.readFileSync(req.files.storyCoverUpload.path);
      var coverFileName = story.title + "." + Util.getFileExtension(req.files.storyCoverUpload.name);
      var newPath = __dirname + "/../public/images/story/cover/" + coverFileName;
      fs.writeFileSync(newPath, data);
      story.cover = "/images/story/cover/" + coverFileName;
    }
    for (var i = 1; i <= parseInt(req.body["chapter-count"]); i++) {
      var inputChapter = {
        chapter: Util.checkChapterNumber(req.body["chapter-chapter-" + i]),
        title: req.body["chapter-title-" + i],
        content: req.body["chapter-content-" + i],
        datePost: Date.now(),
        poster: req.session.user.username
      }
      story.chapters.push(inputChapter);
    }
    story.save(function(error) {
      // console.log("########## Add Story " + story.title);
      if (error) {
        console.log(error);
      }
      // adminRoute.addStoryPage(req, res);
      req.query.id = story._id;
      adminRoute.addStoryChapterPage(req, res);
    });
  } else {
    res.render('admin/addStory', { 
      title: 'Full Truyện',
      storyCates: Util.storyCate,
      error: "Không Có Quyền!"
    });
  }
}

exports.checkStory = function(req, res) {
  Story.find({}, '_id title author').exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    var returnData = [];
    for (var i = 0; i < stories.length; i++) {
      if (Util.removeUTF8(stories[i].title).indexOf(Util.removeUTF8(req.query.title)) != -1) {
        returnData.push(stories[i]);
      }
    }
    res.json({ data: returnData });
  });
};

exports.editStoryPage = function(req, res) {
  Story.findOne({'_id': req.query.id}, '_id title source translator shortDes author datePost numView cover cate type chapters.poster chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    story.chapters.sort(Util.dynamicSort('chapter', 1));
    if (story != null) {
      res.render('admin/editStory', { 
        title: 'Full Truyện',
        story: story,
        storyCates: Util.storyCate
      });
    } else {
      adminRoute.listStory(req, res);
    }
  });
}

exports.editStory = function(req, res) {
  if (Util.checkAccessRight("addEditStory", req.session.user.accessable)) {
    Story.findOne({'_id': req.body.id}, '_id title source translator shortDes author numView datePost cover cate type chapers.poster chapters.chapter chapters.title chapters._id').exec(function(error, story) {
      if (error) {
        console.log(error);
      }
      if (story != null) {
        story.title = req.body.storyTitle;
        story.author = req.body.storyAuthor;
        story.cover = req.body.storyCover;
        story.cate = req.body.storyCategory;
        story.shortDes = req.body.storyShortDes;
        story.source = req.body.storySource;
        story.translator = req.body.storyTranslator;
        story.numView = parseInt(req.body.storyNumView);
        if (req.files.storyCoverUpload.size > 0) {
          var data = fs.readFileSync(req.files.storyCoverUpload.path);
          var coverFileName = story.title + "." + Util.getFileExtension(req.files.storyCoverUpload.name);
          var newPath = __dirname + "/../public/images/story/cover/" + coverFileName;
          fs.writeFileSync(newPath, data);
          story.cover = "/images/story/cover/" + coverFileName;
        }
        for (var i = 0; i < story.chapters.length; i++) {
          var chapter = story.chapters[i];
          if (req.body['chapter-chapter-' + chapter._id]) {
            var tempChapter = Util.checkChapterNumber(req.body['chapter-chapter-' + chapter._id]);
            var tempChapterTitle = req.body['chapter-title-' + chapter._id];
            if (tempChapter) {
              if (chapter.chapter != tempChapter) {
                chapter.chapter = Util.checkChapterNumber(tempChapter);
              }
            }
            if (tempChapterTitle) {
              if (chapter.title != tempChapterTitle) {
                chapter.title = tempChapterTitle;
              }
            }
          }
        }
        story.save(function(err) {
          adminRoute.listStory(req, res);
          // res.render('admin/listStory', { 
          //   title: 'Full Truyện'
          //   // story: story,
          //   // storyCates: Util.storyCate
          // });
        });
      } else {
        adminRoute.listStory(req, res);
      }
    });
  } else {
    res.render('admin/editStory', { 
      title: 'Full Truyện',
      error: 'Không Có Quyền!',
      storyCates: Util.storyCate
    });
  }
}

exports.removeStory = function(req, res) {
  if (Util.checkAccessRight("removeStory", req.session.user.accessable)) {
    Story.findById(req.query.id, function (err, story) {
      if (story.cover && story.cover != null && story.cover != "") {
        var coverDir = __dirname + "/../public" + story.cover;
        if (fs.existsSync(coverDir)) {
          fs.unlinkSync(coverDir);
        }
      }
      if (!err) {
        story.remove();
      }
      res.json({ data: "success" });
    });
  } else {
    res.json({ data: "error" });
  }
}

exports.removeStoryChapter = function(req, res) {
  if (Util.checkAccessRight("removeStoryChapter", req.session.user.accessable)) {
    Story.findOne({'_id': req.query.storyId}, '_id title author numView datePost cover cate type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
      if (error) {
        console.log(error);
      }
      if (story != null) {
        var chapter = story.chapters.id(req.query.chapterId);
        if (chapter != null) {
          chapter.remove();
        }
        story.save(function() {
          res.render('admin/editStory', { 
            title: 'Full Truyện',
            story: story,
            storyCates: Util.storyCate
          });
        });
      } else {
        adminRoute.listStory(req, res);
      }
    });
  } else {
    res.render('admin/editStory', { 
      title: 'Full Truyện',
      error: 'Không Có Quyền',
      storyCates: Util.storyCate
    });
  }
}

exports.addStoryChapterPage = function(req, res) {
  Story.findOne({'_id': req.query.id}, '_id title chapters.chapter chapters.title chapters._id chapters.poster').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    res.render('admin/addStoryChapterPage', { 
      title: 'Full Truyện',
      story: story
    });
  });
}

exports.addStoryChapter = function(req, res) {
  if (Util.checkAccessRight("addEditStory", req.session.user.accessable)) {
    Story.findOne({'_id': req.body["storyId"]}).exec(function(error, story) {
      if (error) {
        console.log(error);
      }
      if (story != null) {
        for (var i = 1; i <= parseInt(req.body["chapter-count"]); i++) {
          if (req.body["chapter-content-" + i] != null && req.body["chapter-content-" + i] != "") {
            console.log(req.session.user.username);
            var inputChapter = {
              chapter: Util.checkChapterNumber(req.body["chapter-chapter-" + i]),
              title: req.body["chapter-title-" + i],
              content: req.body["chapter-content-" + i],
              datePost: Date.now(),
              poster: req.session.user.username
            }
            story.chapters.push(inputChapter);
          }
        }
        story.save(function(error) {
          if (error) {
            console.log(error);
          }
          console.log("########## Add Chapter " + story.title);
          req.query.id = story._id;
          adminRoute.addStoryChapterPage(req, res);
        });
      }
    });
  } else {
    res.render('admin/addStoryChapterPage', { 
      title: 'Full Truyện',
      error: 'Không Có Quyền!'
    });
  }
}

exports.editStoryChapterPage = function(req, res) {
  Story.findOne({'_id': req.query.storyId}, '_id title chapters.chapter chapters.title chapters._id chapters.content').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      var chapter = story.chapters.id(req.query.chapterId);
      if (chapter != null) {
        res.render('admin/storyEditChapter', { 
          title: 'Full Truyện',
          story: story,
          chapter: chapter
        });
      } else {
        req.query.id = req.query.storyId;
        adminRoute.editStoryPage(req, res);
      }
    } else {
      adminRoute.listStory(req, res);
    }
  });
}
