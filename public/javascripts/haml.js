function Haml() {
};

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,"");
};

Haml.compile = function() {
  var lines = arguments;
  var compiledLines = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var indentLevel = Haml.getIndentLevel(line);
    var compiledLine = Haml.compileLine(line);

    compiledLines.push([ indentLevel, compiledLine ]);
  }

  return Haml.format(Haml.buildText(compiledLines));
};

var IndentLevel = 0;
var CompiledLine = 1;

Haml.buildText = function(lines) {
  var savedLinesByIndentLevel = [];
  var previousIndentLevel = lines[lines.length - 1][IndentLevel];
  var text = '';

  for (var i = lines.length - 1; i >= 0; --i) {
    var line = lines[i];
    var indentLevel = line[IndentLevel];
    var compiledLine = line[CompiledLine];
    if (indentLevel < previousIndentLevel) {
      // Previous line was a child.
      compiledLine.splice(2, 0, text);
      text = compiledLine.join('');

      // Check for any saved siblings.
      if (savedLinesByIndentLevel[indentLevel]) {
        text += savedLinesByIndentLevel[indentLevel];
        savedLinesByIndentLevel[indentLevel] = null;
      }
    } else if (indentLevel == previousIndentLevel) {
      // Previous line was a sibling.
      text = compiledLine.join('') + text;
    } else {
      savedLinesByIndentLevel[previousIndentLevel] = text;
      text = compiledLine.join('');
    }

    previousIndentLevel = indentLevel;
  }

  return text;
};

Haml.getIndentLevel = function(haml) {
  for (var i = 0; i < haml.length; i++) {
    if (haml[i] != ' ') {
      return i;
    }
  }
};

Haml.compileLine = function(line) {
  if (line.trim()[0] == '|') {
    // Examples:
    //   | Hello world
    return [ line.trim().substr(1).trim() ];
  } else {
    var parts = line.split('(');

    if (parts.length == 1) {
      // Examples:
      //   div
      //   div Hello World
      parts = line.trim().split(' ');
      var tag = parts.shift();
      var text = parts.join(' ').trim();

      return [ '<' + tag + '>', text, '</' + tag + '>' ];
    } else {
      // Examples:
      //   div(id="test")
      //   div(id="test") Hello
      var tag = parts[0].trim();
      line = parts[1];
      parts = line.split(')');
      var attributesString = parts[0];
      var attributes = attributesString.split(',').join(' ');
      line = parts[1];

      var text = line.trim();

      return [ '<' + tag + ' ' + attributes + '>', text, '</' + tag + '>' ];
    }
  }
};

Haml.format = function(text) {
  var parts = text.split('#{');

  var textArray = [];
  textArray.push(parts[0]);

  for (var i = 1; i < parts.length; i++) {
    var part = parts[i];
    var subparts = part.split('}');
    textArray.push(new Token(subparts[0].trim()));
    textArray.push(subparts[1]);
  }

  return function(args) {
    args = args || {};
    var text = '';
    for (var i in textArray) {
      if (textArray[i].constructor == Token) {
        var value = args[textArray[i].name];
        if (value) {
          text += value;
        }
      } else {
        text += textArray[i];
      }
    }
    return text;
  };
};

function Token(name) {
  this.name = name;
};
