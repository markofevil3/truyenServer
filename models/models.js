var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var favoriteSchema = new Schema({
  itemId: { type: ObjectId, index: true },
  itemType: Number,
});

var chapterSchema = new Schema({
  // chapter: String,
  chapter: { type: String, index: true },
  title: String,
  numPages: Number,
  datePost: Date,
  pages: [String],
  poster: String
});

var userSchema = new Schema({
  userId: { type: Number, index: true },
  username: { type: String, index: true },
  fullName: String,
  favorites: [ favoriteSchema ],
  unlock: [String],
  pTime: String //purchase time
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
  chapter: { type: String, index: true },
  title: String,
  content: String,
  datePost: Date,
  folder: String,
  poster: String,
});

var newsSchema = new Schema({
  title: { type: String, index: true },
  poster: String,  
  datePost: {type: Date, index: true},
  type: Number,
  shortDes: String,
  content: String,
  source: String,
  cover: String
});

var storySchema = new Schema({
  title: { type: String, index: true },
  author: { type: String, index: true },
  datePost: Date,
  updatedAt: Date,
  numView: { type: Number, default: 0 },
  type: Number,
  cate: [String],
  shortDes: String,
  content: String,
  source: String,
  translator: String,
  cover: String,
  status: { type: Number, default: 0 },
  poster: String,
  chapters: [ chapterStorySchema ]
});

var storyAudioSchema = new Schema({
  title: { type: String, index: true },
  author: String,
  reader: String,
  datePost: Date,
  numView: Number,
  cover: String,
  length: Number,
  link: String,
  fileName: String,
  type: Number,
  poster: String
});

var adminSchema = new Schema({
  username: { type: String, index: true },
  password: String,
  accessable: [String]
})

module.exports = {
  'User': mongoose.model('User', userSchema),
  'Admin': mongoose.model('Admin', adminSchema),
  'Favorite': mongoose.model('Favorite', favoriteSchema),
  'Manga': mongoose.model('Manga', mangaSchema),
  'Chapter': mongoose.model('Chapter', chapterSchema),
  'Story': mongoose.model('Story', storySchema),
  'StoryAudio': mongoose.model('StoryAudio', storyAudioSchema),
  'News': mongoose.model('News', newsSchema),
};
