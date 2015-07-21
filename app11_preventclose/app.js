var app = require('app');
var BrowserWindow = require('browser-window');

var ipc = require('ipc');
var dialog = require('dialog');

var client = require('electron-connect').client

app.on('window-all-closed', function() {
    console.log("window-all-closed");
    app.quit();
});

//
// WebContentsからRenderWindowを取得するためのハッシュテーブル
//
var hash = new WebContentHash();

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

//
// ウインドウ操作用関数
//
function createWindow() {
	var w = new BrowserWindow({
		width: 400,
		height: 300
	});
	w.setMenu(null);

  w.loadUrl('file://' + __dirname + '/index.html');

  w.on('close', function(evt) {
    evt.preventDefault();
    w.webContents.send('close-window-event', 'testargs');
  });

  client.create(w);

  var webcontent = w.webContents;
  hash.push(webcontent, w);

	return w;
}

ipc.on('create-window', function(evt, arg) {
  createWindow();
});

ipc.on('show-dialog', function(evt, arg) {
  console.log("show-dialog");

  var webcontent = evt.sender;
  var w = hash.getWindow(webcontent);

  var rv = dialog.showMessageBox(w, {
      type: 'info',
      message: 'save changes?',
      buttons: ['Yes', 'No', 'Cancel']
  });

  evt.returnValue = rv;
});

ipc.on('close-window', function(evt, arg) {
  var webcontent = evt.sender;
  var w = hash.getWindow(webcontent);

  w.destroy();
  hash.delete(webcontent);
});

app.on('ready', function() {
  createWindow();
});
