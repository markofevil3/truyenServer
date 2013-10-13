var User = require('../models/models').User;
var Chapter = require('../models/models').Chapter;
var Favorite = require('../models/models').Favorite;
var Manga = require('../models/models').Manga;
var Story = require('../models/models').Story;
var exec = require('child_process').exec;

var Util = require('../lib/util');
var fs = require('fs');
var schedule = require('node-schedule');
var walk = require('walk');
var options = {
  followLinks: false,
};
var walker;

var mangaRoot = 'public/images/manga';
// var mangaRoot = '../manga';
var mangaDir = [];
var clone;


function autoDownloadChapters(startIndex, callback) {
  var autoDownloadLink = 'http://truyentranhtuan.com/moi-cap-nhat/' + startIndex + '/index.html';
  deleteFolderRecursive("public/downloadNewChapter");
  var child = exec("wget " + autoDownloadLink + " --directory-prefix=/Users/rongxanh2052004/Super/Project/iosApp/truyenServer/public/downloadNewChapter/",
  function (error, stdout, stderr) {
    if (error !== null) {
      console.log("ERROR: " + autoDownloadLink + "/index.html");
    }
    else {
      console.log("DOWNLOADED LIST NEW CHAPTERS FILE");
      // inspect file and download newest chapter
      var chapterList = getChapterListFromString(fs.readFileSync("public/downloadNewChapter/index.html", 'utf8'));
      console.log(chapterList);
      downloadAndSaveChapter(chapterList, callback);
    }
  });
}

// schedule.scheduleJob('0 */8 * * *', function(){
  autoDownloadChapters(1, function() {
    autoDownloadChapters(2, function() {
      autoDownloadChapters(3, function() {
        console.log("FINISH DOWNLOAD 3 NEW CHAPTER PAGES!!");
      });
    });
  });
// });

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function downloadAndSaveChapter(chapterList, callback) {
  if (chapterList.length > 0) {
    var mangaData = chapterList.pop();
    Manga.findOne({ 'title': mangaData.mangaName }, function(error, manga) {
      if (error) {
        console.log(error);
      }
      if (manga == null) {
        console.log("Cant Find Manga------------------------ " + mangaData.mangaName);
        downloadAndSaveChapter(chapterList, callback);
        return;
      } else {
        for (var i = 0; i < manga.chapters.length; i++) {
          if (manga.chapters[i].chapter == mangaData.chapter.toString()) {
            console.log("Chapter exist " + mangaData.mangaName + " -- " + mangaData.chapter);
            downloadAndSaveChapter(chapterList, callback);
            return;
          }
        }
        // start download
        var root = "truyentranhtuan.com/" + mangaData.link;
        var child = exec("wget http://" + root + "doc-truyen/index.html --directory-prefix=/Users/rongxanh2052004/Super/Project/iosApp/truyenServer/public/downloadNewChapter/" + root + "/",
         function (error, stdout, stderr) {
           if (error !== null) {
             console.log("ERROR: " + root + "/doc-truyen/index.html");
             downloadAndSaveChapter(chapterList, callback);
           } else {
             var contents = fs.readFileSync("public/downloadNewChapter/" + root + "index.html", 'utf8');
             inspectFile(contents, function(imageLinks) {
               if (imageLinks.length > 0) {
                 manga.chapters.push({
                   'chapter': mangaData.chapter.toString(),
                   'pages': imageLinks
                 });
                 manga.updatedAt = Date.now();
                 manga.save(function(error) {
                   console.log("SAVED " + root + "index.html");
                   downloadAndSaveChapter(chapterList, callback);
                 });
               } else {
                 console.log("NO IMAGES FOUND " + root + "index.html");
                 downloadAndSaveChapter(chapterList, callback);
               }
             })
             // downloadAndSaveChapter(chapterList);
           }
         });
      }
    });
  } else {
    callback();
  }
}

// get images link from content
function inspectFile(contents, callback) {
  // is reading managa page
  if (contents.indexOf('slides2=[') != -1) {
    // get image links 
    var start = contents.indexOf('slides2=[');
    var end = contents.indexOf('];', start);
    var n = contents.substr(start + 9, end - start - 9);
    n = n.replace(/"/g, '');
    var arr = n.split(',');
    callback(arr);
  } else {
    callback([]);
  }
}

function getChapterListFromString(contents) {
  var chapterList = [];
  // get image links
  var startIndex = contents.indexOf('Chap mới nhất:');
  while(contents.indexOf('Chap mới nhất:', startIndex) != -1) {
    // get download link
    var start = contents.indexOf('<a href="', startIndex);
    var end = contents.indexOf('">', start + 9);
    var chapterLink = contents.substr(start + 10, end - start - 10);
    // get manga name
    var nameEnd = contents.indexOf('</a>', end);
    var mangaNameChapter = contents.substr(end + 2, nameEnd - end - 2);
    var mangaName = mangaNameChapter.substr(0, mangaNameChapter.lastIndexOf(" "));
    var chapter = mangaNameChapter.substr(mangaNameChapter.lastIndexOf(" ") + 1, mangaNameChapter.length);
    chapterList.push({link: chapterLink, chapter: chapter, mangaName: mangaName});
    startIndex = end;
  }
  return chapterList;
}

exports.importManga = function(req, res) {
  walker = walk.walk(mangaRoot, options);

  walker.on("directories", function (root, dirStatsArray, next) {
    if (root == mangaRoot) {
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
    if (fileStats.name != '.DS_Store' && fileStats.name.indexOf('cover.jpg') == -1) {
      var dirInfo = root.split('/');
      var indexOfManga = Util.indexOf(mangaDir, 'name', dirInfo[3]);
      var indexOfChapter = Util.indexOf(mangaDir[indexOfManga].chapters, 'chapter', parseFloat(dirInfo[4]));
      var dirToDb = root.replace('public', '');
      mangaDir[indexOfManga].chapters[indexOfChapter].pages.push(dirToDb + '/' + fileStats.name);
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
  var count = 0;
  // for (var z = 0; z < 20; z++) {
    for (var i = 0; i < mangaDir.length; i++) {
      var mangaInfo = mangaDir[i];
      var title = mangaInfo.name;
      var source = 'Sưu Tầm';
      var author = 'Đang Cập Nhật';
      var numView = Util.getRandomInt(60);
      var folder = imageFolder + mangaInfo.name;
      var manga = new Manga({});
      
      manga.title = title.replace(/-/g, ' ');
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
        count++;
        console.log(count);
      });
    }
  // }
};

function getMangaName(title) {
  title = title.replace('-', ' ');
  return title;
}