var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;

var Util = require('../lib/util');
var fs = require('fs');
var walk = require('walk');
var options = {
  followLinks: false,
};
var walker;

var mangaRoot = 'public/images/manga';
var mangaDir = [];
var clone;

exports.importManga = function(req, res) {
  walker = walk.walk(mangaRoot, options);

  walker.on("directories", function (root, dirStatsArray, next) {
    // dirStatsArray is an array of `stat` objects with the additional attributes
    // * type
    // * error
    // * name
    if (root == mangaRoot) {
      // console.log(dirStatsArray);
      for (var i = 0; i < dirStatsArray.length; i++) {
        mangaDir.push({'name': dirStatsArray[i].name, 'chapters': []});
      }
    }
    next();
  });
  walker.on("end", function () {
    console.log("done get manga");
    clone = Util.getCloneOfArray(mangaDir);
    getChapter(clone);
  });
};

function getChapter(mangaFolders) {
  var mangaFolder = mangaFolders.shift();
  var searchFolder = mangaRoot + '/' + mangaFolder.name;
  walker = walk.walk(searchFolder, options);

  walker.on("directories", function (root, dirStatsArray, next) {
    if (root == searchFolder) {
      // console.log(dirStatsArray);
      for (var j = 0; j < mangaDir.length; j++) {
        if (mangaDir[j].name == mangaFolder.name) {
          for (var i = 0; i < dirStatsArray.length; i++) {
            mangaDir[j].chapters.push({'chapter': parseFloat(dirStatsArray[i].name), 'pages': []});
          }
        }
      }
    }
    next();
  });
  walker.on("end", function () {
    console.log("##### " + mangaFolder.name);
    if (mangaFolders.length > 0) {
      getChapter(mangaFolders);
    } else {
      getPage();
    }
  });
};

function getPage() {
  walker = walk.walk(mangaRoot, options);

  walker.on("file", function (root, fileStats, next) {
    if (fileStats.name != '.DS_Store' && fileStats.name != 'cover.jpg') {
      var dirInfo = root.split('/');
      var indexOfManga = Util.indexOf(mangaDir, 'name', dirInfo[3]);
      var indexOfChapter = Util.indexOf(mangaDir[indexOfManga].chapters, 'chapter', parseFloat(dirInfo[4]));
      var dirToDb = root.replace('public', '');
      mangaDir[indexOfManga].chapters[indexOfChapter].pages.push(dirToDb + fileStats.name);
      console.log(root + '/' + fileStats.name);
      next();
    } else {
      next();
    }
  });
  
  walker.on("end", function () {
    console.log('DONE');
    importToDb();
  });
};

function importToDb() {
  var imageFolder = '/images/manga/';
  for (var i = 0; i < mangaDir.length; i++) {
    var mangaInfo = mangaDir[i];
    var title = mangaInfo.name;
    var source = 'Sưu Tầm';
    var author = 'Đang Cập Nhật';
    var numView = Util.getRandomInt(60);
    var folder = imageFolder + mangaInfo.name;
    var manga = new Manga({});
    manga.title = title;
    manga.source = source;
    manga.author = author;
    manga.numView = numView;
    manga.folder = folder;
    manga.chapters = [];
    for (var j = 0; j < mangaInfo.chapters.length; j++) {
      manga.chapters.push({
        'chapter': mangaInfo.chapters[j].chapter,
        'pages': mangaInfo.chapters[j].pages
      });
    }
    manga.save(function(err) {
      if (err) {
        console.log(err);
        console.log(manga.title);
      }
    })
  }
};

function getMangaName(title) {
  title = title.replace('-', ' ');
  return title;
}