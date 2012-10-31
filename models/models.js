var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var favoriteSchema = new Schema({
  itemId: { type: ObjectId, index: true },
  itemType: Number,
});

var chapterSchema = new Schema({
  chapter: String,
  title: String,
  numPages: Number,
});

var userSchema = new Schema({
  userId: { type: Number, index: true },
  username: { type: String, index: true },
  fullName: String,
  favorites: [ favoriteSchema ],
});

var mangaSchema = new Schema({
  title: String,
  author: String,
  cover: String,
  datePost: Date,
  numView: String,
  chapters: [ chapterSchema ]
});

// var shipSchema = new Schema({
//   name: String,
//   hp: Number,
//   weaponAttSLot: Number,
//   weaponDefSLot: Number,
//   upgrade: Number,
//   using: Boolean
// });
// 
// var weaponSchema = new Schema({
//   name: String,
//   damage: Number,
//   slotType: String,
//   upgrade: Number,
//   effect: {},
//   anti: [String],
//   using: Boolean
// });
// 
// var gameSchema = new Schema({
//   target: String,
//   drawAuthor: ObjectId,
//   drawHistory: String,
//   drawComment: String,
//   solveAuthor: ObjectId,
//   solveHistory: String,
//   solveComment: String,
//   numNudges: Number,
//   lastNudgeAt: Date,
//   endedGame: Boolean
// });
// 
// var setSchema = new Schema({
//   games: [ gameSchema ],
// });
// 
// var matchSchema = new Schema({
//   player1: { type: ObjectId, index: true },
//   player2: { type: ObjectId, index: true },
//   sets: [ setSchema ],
//   longestSet: Number,
// });
// 
// var gallerySchema = new Schema({
//   startDate: Date,
//   startIndex: Number,
//   items: [galleryItemSchema]
// });
// 
// var galleryItemSchema = new Schema({
//   drawHistory: String,
//   drawAuthor: String,
//   target: String,
//   displayPos: Number,
//   thumbnailUrl: String  
// });
// 
// matchSchema.index({ player1: 1, player2: 1 });

module.exports = {
  'User': mongoose.model('User', userSchema),
  'Favorite': mongoose.model('Favorite', favoriteSchema),
  'Manga': mongoose.model('Manga', mangaSchema),
  'Chapter': mongoose.model('Chapter', chapterSchema)
};
