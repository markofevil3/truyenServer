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

var StoryController = require('./storyController');

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

exports.updateMangas = function(req, res) {
  Manga.find({}, '_id title author cover').exec(function(error, mangas) {
    if (error) {
      console.log(error);
    }
    var count = 0;
    for (var i = 0; i < mangas.length; i++) {
      if (mangas[i].cover != req.body["manga-cover-" + mangas[i]._id]) {
        mangas[i].cover = req.body["manga-cover-" + mangas[i]._id];
        mangas[i].save(function() {
          count++;
          if (count == mangas.length) {
            adminRoute.listManga(req, res);
          }
        });
      } else {
        count++;
        if (count == mangas.length) {
          adminRoute.listManga(req, res);
        }
      }
    }
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
  StoryController.listStory(req, res);
};

exports.updateStories = function(req, res) {
  StoryController.updateStories(req, res);
}

exports.addStoryPage = function(req, res) {
  StoryController.addStoryPage(req, res);
}

exports.editStoryPage = function(req, res) {
  StoryController.editStoryPage(req, res);
}

exports.editStory = function(req, res) {
  StoryController.editStory(req, res);
}

exports.addStory = function(req, res) {
  StoryController.addStory(req, res);
}

exports.removeStory = function(req, res) {
  StoryController.removeStory(req, res);
}

exports.addStoryChapter = function(req, res) {
  StoryController.addStoryChapter(req, res);
}

exports.addStoryChapterPage = function(req, res) {
  StoryController.addStoryChapterPage(req, res);
}

exports.removeStoryChapter = function(req, res) {
  StoryController.removeStoryChapter(req, res);
}

exports.editStoryChapterPage = function(req, res) {
  StoryController.editStoryChapterPage(req, res);
}

exports.editStoryChapter = function(req, res) {
  Story.findOne({'_id': req.body.storyId}, '_id title chapters.chapter chapters.title chapters._id chapters.content').exec(function(error, story) {
    if (error) {
      console.log(error);
    }
    if (story != null) {
      var chapter = story.chapters.id(req.body.chapterId);
      if (chapter != null) {
        chapter.chapter = Util.checkChapterNumber(req.body['chapter-chapter']);
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
  StoryController.checkStory(req, res);
};