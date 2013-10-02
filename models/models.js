var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var favoriteSchema = new Schema({
  itemId: { type: ObjectId, index: true },
  itemType: Number,
});

var chapterSchema = new Schema({
  // chapter: String,
  chapter: String,
  title: String,
  numPages: Number,
  datePost: Date,
  pages: []
});

var userSchema = new Schema({
  userId: { type: Number, index: true },
  username: { type: String, index: true },
  fullName: String,
  favorites: [ favoriteSchema ],
});

var mangaSchema = new Schema({
  title: { type: String, index: true },
  author: String,
  cover: String,
  datePost: Date,
  updatedAt: Date,
  numView: Number,
  folder: String,
  source: String,
  chapters: [ chapterSchema ]
});

var chapterStorySchema = new Schema({
  chapter: Number,
  title: String,
  content: String,
  datePost: Date,
});

var storySchema = new Schema({
  title: String,
  author: String,
  datePost: Date,
  updatedAt: Date,
  numView: Number,
  type: Number,
  shortDes: String,
  content: String,
  chapters: [ chapterStorySchema ]
});

module.exports = {
  'User': mongoose.model('User', userSchema),
  'Favorite': mongoose.model('Favorite', favoriteSchema),
  'Manga': mongoose.model('Manga', mangaSchema),
  'Chapter': mongoose.model('Chapter', chapterSchema),
  'Story': mongoose.model('Story', storySchema),
};
