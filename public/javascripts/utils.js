function Utils() {
};

function createNode(html) {
  var tempDiv = document.createElement('div');

  tempDiv.innerHTML = html;
  return tempDiv.firstChild;
};