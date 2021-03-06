function Util() {
}

Util.newsCate = [{title: "List Truyện", route: "list-truyen"},
                 {title: "Cảm Nhận", route: "cam-nhan"},
                 {title: "Sự Kiện", route: "su-kien"}];

Util.storyCate = ["Truyện teen", "Ngôn tình", "Truyện ma", "Trinh thám", "Văn học việt nam", "Văn học nước ngoài", "Tiểu thuyết tình yêu", "Viễn tưởng - Siêu nhiên", "Thể loại khác", "Văn học nhật bản", "Văn học cổ điển", "Truyện Kiếm Hiệp - Tiên Hiệp", "Nghệ Thuật Sống", "Sách Kinh Tế", "Sách Thiếu Nhi", "Tiểu Sử- Hồi Ký"];

Util.storyCates = [
  {index: 0, title: "Truyện teen", route: "truyen-teen"},
  {index: 1, title: "Ngôn tình", route: "ngon-tinh"},
  {index: 2, title: "Truyện ma", route: "truyen-ma"},
  {index: 3, title: "Trinh thám", route: "trinh-tham"},
  {index: 4, title: "Văn học việt nam", route: "van-hoc-viet-nam"},
  {index: 5, title: "Văn học nước ngoài", route: "van-hoc-nuoc-ngoai"},
  {index: 6, title: "Tiểu thuyết tình yêu", route: "tieu-thuyet-tinh-yeu"},
  {index: 7, title: "Viễn tưởng - Siêu nhiên", route: "vien-tuong"},
  {index: 8, title: "Thể loại khác", route: "the-loai-khac"},
  {index: 9, title: "Văn học nhật bản", route: "van-hoc-nhat-ban"},
  {index: 10, title: "Văn học cổ điển", route: "van-hoc-co-dien"},
  {index: 11, title: "Truyện Kiếm Hiệp - Tiên Hiệp", route: "kiem-hiep"},
  {index: 12, title: "Nghệ Thuật Sống", route: "nghe-thuat-song"},
  {index: 13, title: "Sách Kinh Tế", route: "sach-kinh-te"},
  {index: 14, title: "Sách Thiếu Nhi", route: "sach-thieu-nhi"},
  {index: 15, title: "Tiểu Sử- Hồi Ký", route: "hoi-ky"},
];

Util.bookStatus = ["Full", "Update", "Drop"];

Util.accessable = {
  all: "Tất Cả",
  addRemoveAdmin: "Thêm và Xoá Admin",
  addEditStory: "Thêm và Sửa Sách Truyện",
  removeStory: "Xoá Sách Truyện",
  removeStoryChapter: "Xoá Chương Sách Truyện",
  addNews: "Thêm và Sửa Tin Tức",
  removeNews: "Xoá Tin Tức",
}

Util.contain = function(arr, key, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key].toString() == value.toString()) {
      return true;
    }
  }
  return false;
}

Util.getCloneOfArray = function(arr) {
  var tempClone = [];

  for (var index = 0; index < arr.length; index++) {
    if (typeof(arr[index]) == "object") {
      tempClone.push(Util.clone(arr[index]));
    } else {
      tempClone.push(arr[index]);
    }
  }
  for (var key in arr) {
    if (typeof(arr[key]) == "object") {
      tempClone[key] = Util.clone(arr[key]);
    } else {
      tempClone[key] = arr[key];
    }
  }

  return tempClone;
};

Util.clone = function(obj) {
  var tempClone = {};
  if (obj instanceof Array) {
    tempClone = [];
  }

  if (typeof(obj) == "object") {
    if (obj instanceof Array) {
      return Util.getCloneOfArray(obj);
    } else {
      for (var key in obj) {
        if (obj[key] instanceof Array) {
          tempClone[key] = Util.getCloneOfArray(obj[key]);
        } else if (typeof(obj[key]) == "object" && obj[key] != null) {
          tempClone[key] = Util.clone(obj[key]);
        } else {
          tempClone[key] = obj[key];
        }
      }
    }
  } else {
    return obj;
  }

  return tempClone;
};

Util.indexOf = function(arr, key, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] == value) {
      return i;
    }
  }
  return -1;
};

Util.randomNumber = 0;

Util.sortByProperties = function(properties) {
  return function (a, b) {
    var index = 0;
    while (index < properties.length && a[properties[index]] == b[properties[index]]) {
      index++;
    }
    if (index == properties.length) {
      return 0;
    } else {
      return a[properties[index]] < b[properties[index]] ? 1 : -1;
    }
  }
};

Util.dynamicSort = function(property, type) {
  return function (a,b) {
    return (a[property] < b[property]) ? (-1 * type) : (a[property] > b[property]) ? (1 * type) : 0;
  }
};

Util.dynamicSortNumber = function(property, type) {
  return function (a,b) {
    return (parseFloat(a[property]) < parseFloat(b[property])) ? (-1 * type) : (parseFloat(a[property]) > parseFloat(b[property])) ? (1 * type) : 0;
  };
};

Util.filter = function(arr, property, value) {
  var returnArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][property].trim() == value) {
      returnArr.push(arr[i]);
    }
  }
  return returnArr;
}

Util.setSeed = function(num) {
  Util.randomNumber = num;
};

Util.rand = function() {
  var m = 4294967296;
  var a = 1664525;
  var c = 1013904223;
  Util.randomNumber = ((a * Util.randomNumber) + c) % m;
  return Util.randomNumber;
};

Util.shuffle = function(arr) {
  var length = arr.length;

  for (var i = length - 1; i > 0; i--) {
    var rand = Util.rand() % (i + 1);
    var j = rand;
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  return arr;
};

Util.getRandomInt = function(range) {
  return Util.rand() % range;
};

Util.getRandomUniqueIndex = function(existingIndex, length) {
  return (existingIndex + Util.getRandomInt(length - 1) + 1) % length;
};

Util.getLineNumber = function() {
  var err = getErrorObject();
  var caller_line = err.stack.split("\n")[5];
  return caller_line.split(':')[1];
};

Util.removeUTF8 = function(str) {
  str = str.toLowerCase();  
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
  str = str.replace(/đ/g,"d");  
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-"); 
  str= str.replace(/-+-/g,"-");
  str= str.replace(/^\-+|\-+$/g,"");
  return str;  
};

Util.checkChapterNumber = function(chapterNum) {
  while (chapterNum.length < 3) {
    chapterNum = "0" + chapterNum;
  }
  return chapterNum.toString();
}
// reqAccess = string; userAccessRights= [string]
Util.checkAccessRight = function(reqAccess, userAccessRights) {
  if (userAccessRights && userAccessRights.length > 0) {
    if (Util.accessable[reqAccess] != undefined && Util.accessable[reqAccess] != "") {
      if (userAccessRights.indexOf('all') != -1) {
        return true;
      }
      return (userAccessRights.indexOf(reqAccess) != -1);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

Util.getFileExtension = function(urlString) {
	var detectKey = urlString.lastIndexOf(".");
	return urlString.substr(detectKey + 1, urlString.length);
};

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

module.exports = Util;