function Util() {
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

module.exports = Util;