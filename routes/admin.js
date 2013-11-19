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

// Story cate:
// 0: ngon tinh
// 1:

exports.login = function(req, res) {
  
};

exports.logout = function(req, res) {
  
};

exports.index = function(req, res) {
  res.render('admin/index', { 
    title: 'Full Truyện',
  });
};

exports.listManga = function(req, res) {
  Manga.find({}, '_id title author cover').sort( 'title', 1 ).exec(function(error, mangas) {
    if (error) {
      console.log(error);
    }
    res.render('admin/listManga', { 
      title: 'Full Truyện',
      error: '',
      mangas: mangas
    });
  });
}

exports.listAudio = function(req, res) {
  StoryAudio.find({}).sort( 'title', -1 ).exec(function(error, audios) {
    if (error) {
      console.log(error);
    }
    res.render('admin/listAudio', { 
      title: 'Full Truyện',
      error: '',
      audios: audios
    });
  });
};

exports.addAudioPage = function(req, res) {
  res.render('admin/addAudioPage', { 
    title: 'Full Truyện'
  });
};

exports.removeAudio = function(req, res) {
  StoryAudio.findById(req.query.id, function (err, audio) {
    if (!err) {
      if (audio != null) {
        audio.remove();
      }
    }
    res.json({ data: "success" });
  });
}

exports.addAudio = function(req, res) {
  StoryAudio.findOne({ fileName: req.body['audio_fileName'] }).exec(function(error, audio) {
    if (error) {
      console.log(error);
    }
    if (audio == null) {
      audio = new StoryAudio({});
      audio.title = req.body['audio_title'];
      audio.author = req.body['audio_author'];
      audio.reader = req.body['audio_reader'];
      audio.datePost = Date.now();
      audio.numView = 0;
      audio.cover = req.body['audio_cover'];
      audio.length = parseInt(req.body['audio_length']);
      audio.link = req.body['audio_link'];
      audio.fileName = req.body['audio_fileName'];
      audio.save(function(err) {
        console.log(err);
        res.render('admin/addAudioPage', { 
          title: 'Full Truyện',
          success: true
        });
      })
    } else {
      res.render('admin/addAudioPage', { 
        title: 'Full Truyện',
        error: 'Truyện đã có trong dữ liệu!'
      });
    }
  });
};

exports.updateAudios = function(req, res) {
  StoryAudio.find({}).exec(function(error, audios) {
    if (error) {
      console.log(error);
    }
    var count = 0;
    var tempTitle;
    var tempAuthor;
    var tempReader;
    var tempCoverLink;
    var tempLength;
    var tempDownloadLink;
    var tempFileName;
    for (var i = 0; i < audios.length; i++) {
      tempTitle = req.body["audio-title-" + audios[i]._id.toString()];
      tempAuthor = req.body["audio-author-" + audios[i]._id.toString()];
      tempReader = req.body["audio-reader-" + audios[i]._id.toString()];
      tempCoverLink = req.body["audio-cover-" + audios[i]._id.toString()];
      tempLength = req.body["audio-length-" + audios[i]._id.toString()];
      tempDownloadLink = req.body["audio-link-" + audios[i]._id.toString()];
      tempFileName = req.body["audio-fileName-" + audios[i]._id.toString()];
      if (tempTitle) {
        if (audios[i].title != tempTitle) {
          audios[i].title = tempTitle;
        }
        if (audios[i].author != tempAuthor) {
          audios[i].author = tempAuthor;
        }
        if (audios[i].reader != tempReader) {
          audios[i].reader = tempReader;
        }
        if (audios[i].cover != tempCoverLink) {
          audios[i].cover = tempCoverLink;
        }
        if (audios[i].length != tempLength) {
          if (checkInput(tempLength)) {
            audios[i].length = tempLength;
          }
        }
        if (audios[i].link != tempDownloadLink) {
          if (checkInput(tempDownloadLink)) {
            audios[i].link = tempDownloadLink;
          }
        }
        if (audios[i].fileName != tempFileName) {
          if (checkInput(tempFileName)) {
            audios[i].fileName = tempFileName;
          }
        }
        audios[i].save(function() {
          count++;
          if (count == audios.length) {
            adminRoute.listAudio(req, res);
          }
        });
      } else {
        count++;
        if (count == audios.length) {
          adminRoute.listAudio(req, res);
        }
      }
    }
  });
};

function checkInput(inputText) {
  return (inputText != undefined && inputText != "undefined" && inputText != "" && inputText != null);
}

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

exports.removeStory = function(req, res) {
  // Story.findByIdAndRemove(req.query.id, function(error) {
  //   console.log(error);
  // });
  if (req.query.accessToken == 'hgl4vs4oyk6b') {
    Story.findById(req.query.id, function (err, story) {
      if (!err) {
        story.remove();
      }
      res.json({ data: "success" });
    });
  } else {
    res.json({ data: "fail"});
  }
}

exports.addStoryChapter = function(req, res) {
  Story.findOne({'_id': req.body["chapter-id"]}).exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      story.title = req.body["story-title"];
      story.author = req.body["story-author"];
      story.cover = req.body["story-cover"];
      story.shortDes = req.body["story-shortDes"];
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
        if (error) {
          console.log(error);
        }
        console.log("########## Add Chapter " + story.title);
        adminRoute.index(req, res);
      });
    }
  });
}

exports.addStoryChapterPage = function(req, res) {
  Story.findOne({'_id': req.query.id}, '_id title author datePost numView shortDes cover type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    res.render('admin/addStoryChapterPage', { 
      title: 'Full Truyện',
      story: story
    });
  });
}

exports.listStoryChapters = function(req, res) {
  Story.findOne({'_id': req.query.id}, '_id title datePost type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    res.render('admin/storyListChaptersPage', { 
      title: 'Full Truyện',
      story: story
    });
  });
}

exports.removeStoryChapter = function(req, res) {
  Story.findOne({'_id': req.query.storyId}, '_id title datePost type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      var chapter = story.chapters.id(req.query.chapterId);
      if (chapter != null) {
        chapter.remove();
      }
      story.save(function() {
        res.render('admin/storyListChaptersPage', { 
          title: 'Full Truyện',
          story: story
        });
      });
    } else {
      adminRoute.index(req, res);
    }
  });
}

exports.updateStoryChapters = function(req, res) {
  Story.findOne({'_id': req.body.storyId}, '_id title datePost type chapters.chapter chapters.title chapters._id').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      for (var i = 0; i < story.chapters.length; i++) {
        var chapter = story.chapters[i];
        if (req.body['chapter-chapter-' + chapter._id]) {
          if (chapter.chapter != req.body['chapter-chapter-' + chapter._id]) {
            chapter.chapter = checkChapterNumber(req.body['chapter-chapter-' + chapter._id]);
          }
          if (chapter.title != req.body['chapter-title-' + chapter._id]) {
            chapter.title = req.body['chapter-title-' + chapter._id];
          }
        }
      }
      story.save(function(err) {
        res.render('admin/storyListChaptersPage', { 
          title: 'Full Truyện',
          story: story
        });
      });
    } else {
      adminRoute.index(req, res);
    }
  });
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
        adminRoute.index(req, res);
      }
    } else {
      adminRoute.index(req, res);
    }
  });
}

exports.editStoryChapter = function(req, res) {
  Story.findOne({'_id': req.body.storyId}, '_id title chapters.chapter chapters.title chapters._id chapters.content').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      var chapter = story.chapters.id(req.body.chapterId);
      if (chapter != null) {
        chapter.chapter = checkChapterNumber(req.body['chapter-chapter']);
        chapter.title = req.body['chapter-title'];
        chapter.content = req.body['msgpost'];
        story.save(function() {
          res.render('admin/storyListChaptersPage', { 
            title: 'Full Truyện',
            story: story,
          });
        })
      } else {
        adminRoute.index(req, res);
      }
    } else {
      adminRoute.index(req, res);
    }
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

function checkChapterNumber(chapterNum) {
  while (chapterNum.length < 3) {
    chapterNum = "0" + chapterNum;
  }
  console.log(chapterNum);
  return chapterNum.toString();
}