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
var StoryAudio = require('../models/models').StoryAudio;

exports.listStory = function(req, res) {
  Story.find({}, '_id title author datePost numView shortDes cover type').sort( 'author', 1 ).exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    res.render('admin/listStory', { 
      title: 'Full Truyện',
      error: '',
      accessToken: req.query.accessToken,
      stories: stories
    });
  });
};

exports.addStoryPage = function(req, res) {
  res.render('admin/addStory', { 
    title: 'Full Truyện'
  });
}

exports.addStory = function(req, res) {
  var story = new Story({});
  story.title = req.body["story-title"];
  story.author = req.body["story-author"];
  story.cate = parseInt(req.body["story-cate"]);
  story.datePost = Date.now();
  story.updatedAt = Date.now();
  story.numView = 0;
  story.shortDes = req.body["story-shortDes"];
  story.type = 1;
  for (var i = 1; i <= parseInt(req.body["chapter-count"]); i++) {
    var inputChapter = {
      chapter: req.body["chapter-chapter-" + i],
      title: req.body["chapter-title-" + i],
      content: req.body["chapter-content-" + i],
      datePost: Date.now()
    }
    story.chapters.push(inputChapter);
  }
  story.save(function(error) {
    console.log("########## Add Story " + story.title);
    if (error) {
      console.log(error);
    }
    adminRoute.index(req, res);
  });
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
  Story.findOne({'_id': req.query.id}, '_id title author datePost cover cate type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      res.render('admin/editStory', { 
        title: 'Full Truyện',
        story: story
      });
    } else {
      adminRoute.listStory(req, res);
    }
  });
}

exports.editStory = function(req, res) {
  // Story.findOne({'_id': req.body.id}, '_id title author datePost cover cate type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
  //   if (error) {
  //     console.log(error);
  //   }
  //   if (story != null) {
  //     for (var i = 0; i < story.chapters.length; i++) {
  //       var chapter = story.chapters[i];
  //       if (req.body['chapter-chapter-' + chapter._id]) {
  //         if (chapter.chapter != req.body['chapter-chapter-' + chapter._id]) {
  //           chapter.chapter = Util.checkChapterNumber(req.body['chapter-chapter-' + chapter._id]);
  //         }
  //         if (chapter.title != req.body['chapter-title-' + chapter._id]) {
  //           chapter.title = req.body['chapter-title-' + chapter._id];
  //         }
  //       }
  //     }
  //     story.save(function(err) {
  //       res.render('admin/storyListChaptersPage', { 
  //         title: 'Full Truyện',
  //         story: story
  //       });
  //     });
  //   } else {
  //     // adminRoute.index(req, res);
  //   }
  // });
}

exports.updateStories = function(req, res) {
  Story.find({}, '_id title author shortDes cover type').sort( 'title', 1 ).exec(function(error, stories) {
    if (error) {
      console.log(error);
    }
    var count = 0;
    for (var i = 0; i < stories.length; i++) {
      if (req.body["story-title-" + stories[i]._id.toString()]) {
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
        });
      } else {
        count++;
        if (count == stories.length) {
          adminRoute.index(req, res);
        }
      }
    }
  });
}