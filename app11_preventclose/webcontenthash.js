//
// WebContentsからRenderWindowを取得するためのハッシュテーブル
//
function WebContentHash() {
  this.webcontents = [];
  this.windows     = [];
}

WebContentHash.prototype.push = function(webcontent, window) {
  this.webcontents.push(webcontent);
  this.windows.push(window);
}

WebContentHash.prototype.getWindow = function(webcontent) {
  var idx = this.webcontents.indexOf(webcontent);
  if (idx < 0) return null;
  return this.windows[idx];
}

WebContentHash.prototype.delete = function(webcontent) {
  var idx = this.webcontents.indexOf(webcontent);
  if (idx < 0) return;

  this.webcontents.splice(idx, 1);
  this.windows.splice(idx, 1);
}

module.exports = WebContentHash;
