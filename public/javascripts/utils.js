function Utils() {
};

function createNode(html) {
  var tempDiv = document.createElement('div');

  tempDiv.innerHTML = html;
  return tempDiv.firstChild;
};

function getStatusString(statusIndex) {
  switch (statusIndex) {
    case 0:
      return "Full";
    break;
  }
}