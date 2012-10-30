'use strict';

exports.mangaList = function(req, res) {
  // var data = [];
  // for (var i = 0; i < 2000; i++) {
  //   data.push({
  //     '_id': i + 1,
  //     'title': 'Teset',
  //     'cover': '/images/manga/sample/cover2.jpg',
  //     'datePost': Date.now() + i + 1000,
  //     'numView': Math.random()
  //   });
  // }
  var data = [
      {
        '_id': 1,
        'title': 'Chien Tranh Giua Cac Vi Sao',
        'cover': '/images/manga/sample/cover1.jpg',
        'datePost': Date.now() + 1000,
        'numView': Math.random()
      },
      {
        '_id': 2,
        'title': 'Doraemon',
        'cover': '/images/manga/sample/cover2.jpg',
        'datePost': Date.now() + 2000,
        'numView': Math.random()
      },
      {
        '_id': 3,
        'title': '7 Vien Ngoc Rong',
        'cover': '/images/manga/sample/cover3.jpg',
        'datePost': Date.now() + 3000,
        'numView': Math.random()    
      },
      {
        '_id': 4,
        'title': 'Chien Tranh Giua Cac Vi Sao',
        'cover': '/images/manga/sample/cover1.jpg',
        'datePost': Date.now() + 4000,
        'numView': Math.random()
      },
      {
        '_id': 5,
        'title': 'Doraemon',
        'cover': '/images/manga/sample/cover3.jpg',
        'datePost': Date.now() + 5000,
        'numView': Math.random()
      },
      {
        '_id': 6,
        'title': '7 Vien Ngoc Rong',
        'cover': '/images/manga/sample/cover2.jpg',
        'datePost': Date.now() + 6000,
        'numView': Math.random()  
      },
      {
        '_id': 7,
        'title': 'Chien Tranh Giua Cac Vi Sao',
        'cover': '/images/manga/sample/cover3.jpg',
        'datePost': Date.now() + 7000,
        'numView': Math.random()
      },
      {
        '_id': 8,
        'title': 'Doraemon',
        'cover': '/images/manga/sample/cover3.jpg',
        'datePost': Date.now() + 8000,
        'numView': Math.random()
      },
      {
        '_id': 9,
        'title': '7 Vien Ngoc Rong',
        'cover': '/images/manga/sample/cover2.jpg',
        'datePost': Date.now() + 9000,
        'numView': Math.random() 
      },
      {
        '_id': 10,
        'title': 'Chien Tranh Giua Cac Vi Sao',
        'cover': '/images/manga/sample/cover1.jpg',
        'datePost': Date.now() + 10000,
        'numView': Math.random()
      },
      {
        '_id': 11,
        'title': 'Doraemon',
        'cover': '/images/manga/sample/cover2.jpg',
        'datePost': Date.now() + 11999,
        'numView': Math.random()
      },
      {
        '_id': 12,
        'title': '7 Vien Ngoc Rong',
        'cover': '/images/manga/sample/cover1.jpg',
        'datePost': Date.now() + 12900,
        'numView': Math.random()
      },
      {
        '_id': 13,
        'title': 'Chien Tranh Giua Cac Vi Sao',
        'cover': '/images/manga/sample/cover2.jpg',
        'datePost': Date.now() + 13000,
        'numView': Math.random()
      },
      {
        '_id': 14,
        'title': 'Doraemon',
        'cover': '/images/manga/sample/cover3.jpg',
        'datePost': Date.now() + 14000,
        'numView': Math.random()
      },
    ];
  res.json({ 'data': data });
};

exports.manga = function(req, res) {
  var data = [
    {
      '_id': 1,
      'chapter': 'Chapter 1',
      'title': 'Mo dau truyen'
    },
    {
      '_id': 2,
      'chapter': 'Chapter 2',
      'title': 'Gap nhau'
    },
    {
      '_id': 3,
      'chapter': 'Chapter 3',
      'title': 'Danh nhau'
    },
    {
      '_id': 4,
      'chapter': 'Chapter 4',
      'title': 'Chem nhau asd asdasd asd asd asdasd asda sda sdasd asd asd asd asd asdasd asd asd'
    },
    {
      '_id': 5,
      'chapter': 'Chapter 5',
      'title': 'ABC XYZ'
    },
    {
      '_id': 6,
      'chapter': 'Chapter 6',
      'title': 'Return'
    },
    {
      '_id': 7,
      'chapter': 'Chapter 7',
      'title': 'Fight'
    },
    {
      '_id': 8,
      'chapter': 'Chapter 8',
      'title': 'King King'
    },
    {
      '_id': 9,
      'chapter': 'Chapter 9',
      'title': 'Warrior'
    },
    {
      '_id': 10,
      'chapter': 'Chapter 10',
      'title': 'The End'
    },
    {
      '_id': 11,
      'chapter': 'Chapter 11',
      'title': 'Mo dau truyen'
    },
    {
      '_id': 12,
      'chapter': 'Chapter 12',
      'title': 'Gap nhau'
    },
    {
      '_id': 13,
      'chapter': 'Chapter 13',
      'title': 'Danh nhau'
    },
    {
      '_id': 14,
      'chapter': 'Chapter 14',
      'title': 'Chem nhau asd asdasd asd asd asdasd asda sda sdasd asd asd asd asd asdasd asd asd'
    },
    {
      '_id': 15,
      'chapter': 'Chapter 15',
      'title': 'ABC XYZ'
    },
    {
      '_id': 16,
      'chapter': 'Chapter 16',
      'title': 'Return'
    },
    {
      '_id': 17,
      'chapter': 'Chapter 17',
      'title': 'Fight'
    },
    {
      '_id': 18,
      'chapter': 'Chapter 18',
      'title': 'King King'
    },
    {
      '_id': 19,
      'chapter': 'Chapter 19',
      'title': 'Warrior'
    },
    {
      '_id': 20,
      'chapter': 'Chapter 20',
      'title': 'The End'
    },
    {
      '_id': 21,
      'chapter': 'Chapter 21',
      'title': 'Fight'
    },
    {
      '_id': 22,
      'chapter': 'Chapter 22',
      'title': 'King King'
    },
    {
      '_id': 23,
      'chapter': 'Chapter 23',
      'title': 'Warrior'
    },
    {
      '_id': 24,
      'chapter': 'Chapter 24',
      'title': 'The End'
    },
  ];
  res.json({ 'data': data });
};

exports.mangaReading = function(req, res) {
  var data = {
    'numPages': 14,
    '_id': 1,
    'nameIphone': 'sample'
  };
  res.json({ 'data': data });
};