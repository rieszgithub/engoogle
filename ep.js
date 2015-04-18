function decodeKeys(str) {
  var keys = str.split(",");
  for (var i = 0; i < 11; i++) {
    keys[i] = keys[i] ? unescape(keys[i]) : "";
  }
  return keys;
}
chrome.extension.onConnect.addListener(function(port) {
  var keys = null;
  if (localStorage) {
    keys = localStorage["keys"];
  }
  if (!keys) {
    keys = document.cookie;
  }
  port.postMessage(decodeKeys(keys));
});
