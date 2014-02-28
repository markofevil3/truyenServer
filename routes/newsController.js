'use strict';

var Util = require('../lib/util');
var request = require('request');
var adminRoute = require('./admin');
var fs = require('fs');

var User = require('../models/models').User;
var News = require('../models/models').News;

exports.listNews = function(req, res) {
  News.find({}, '_id title poster datePost cover').sort({'datePost': -1}).exec(function(error, news) {
    if (error) {
      console.log(error);
    }
    res.render('admin/listNews', { 
      title: 'Full Truyện',
      error: '',
      news: news,
      oType: req.query.oType,
      orderBy: 'datePost'
    });
  });
};

exports.addNewsPage = function(req, res) {
  res.render('admin/addNews', { 
    title: 'Full Truyện',
    newsCates: Util.newsCate
  });
};

exports.addNews = function(req, res) {
  if (Util.checkAccessRight("addNews", req.session.user.accessable)) {
    var news = new News({});
    news.title = req.body["newsTitle"];
    news.source = req.body["newsSource"];
    news.datePost = Date.now();
    news.shortDes = req.body["newsShortDes"];
    news.type = parseInt(req.body["newsCategory"]);
    news.poster = req.session.user.username;
    news.content = req.body["msgpost"];
    if (req.files.newsCoverUpload.size > 0) {
      var data = fs.readFileSync(req.files.newsCoverUpload.path);
      var coverFileName = news.title + "." + Util.getFileExtension(req.files.newsCoverUpload.name);
      var newPath = __dirname + "/../public/images/news/cover/" + coverFileName;
      fs.writeFileSync(newPath, data);
      news.cover = "/images/news/cover/" + coverFileName;
    }
    news.save(function(error) {
      if (error) {
        console.log(error);
      }
      adminRoute.addNewsPage(req, res);
    });
  } else {
    res.render('admin/addNews', { 
      title: 'Full Truyện',
      newsCates: Util.newsCate,
      error: "Không Có Quyền!"
    });
  }
};

exports.editNewsPage = function(req, res) {
  if (Util.checkAccessRight("addNews", req.session.user.accessable)) {
    News.findOne({"_id": req.query.id}, function(error, news) {
      if (news != null) {
        res.render('admin/editNewsPage', { 
          title: 'Full Truyện',
          news: news,
          newsCates: Util.newsCate,
        });
      }
    });
  } else {
    res.render('admin/editNewsPage', { 
      title: 'Full Truyện',
      error: 'Không có quyền!',
    });
  }
};

exports.editNews = function(req, res) {
  News.findOne({"_id": req.body.newsId}, function(error, news) {
    if (news != null) {
      news.title = req.body["newsTitle"];
      news.source = req.body["newsSource"];
      news.shortDes = req.body["newsShortDes"];
      news.type = parseInt(req.body["newsCategory"]);
      news.content = req.body["msgpost"];
      if (req.files.newsCoverUpload.size > 0) {
        var data = fs.readFileSync(req.files.newsCoverUpload.path);
        var coverFileName = news.title + "." + Util.getFileExtension(req.files.newsCoverUpload.name);
        var newPath = __dirname + "/../public/images/news/cover/" + coverFileName;
        fs.writeFileSync(newPath, data);
        news.cover = "/images/news/cover/" + coverFileName;
      }
      news.save(function(error) {
        if (error) {
          console.log(error);
        }
        adminRoute.listNews(req, res);
      });
    }
  });
};

exports.removeNews = function(req, res) {
  if (Util.checkAccessRight("removeNews", req.session.user.accessable)) {
    News.findById(req.query.id, function (err, news) {
      if (news.cover && news.cover != null && news.cover != "") {
        var coverDir = __dirname + "/../public" + news.cover;
        if (fs.existsSync(coverDir)) {
          fs.unlinkSync(coverDir);
        }
      }
      if (!err) {
        news.remove();
      }
      res.json({ data: "success" });
    });
  } else {
    res.json({ data: "error" });
  }
};