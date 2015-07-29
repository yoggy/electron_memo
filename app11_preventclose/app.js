var app = require('app');
var BrowserWindow = require('browser-window');

var ipc = require('ipc');
var dialog = require('dialog');

var client;
try {
  client = require('electron-connect').client
} catch(e) {}

var WebContentHash = require('./webcontenthash')
var hash = new WebContentHash();

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

  // ウインドウを閉じるボタンを押したときの挙動
  w.enable_close = false;
  w.on('close', function(evt) {
    if (w.enable_close == false) {
      evt.preventDefault();
      w.webContents.send('close-window-event', 'testargs');
	}
  });

  if (client != null) {
    client.create(w);
  }

  var webcontent = w.webContents;
  hash.push(webcontent, w);

  return w;
}

ipc.on('create-window', function(evt, arg) {
  createWindow();
});

// 閉じるかどうかを問い合わせるためのダイアログ表示関数
// RenderProcess側から呼び出される
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

// ダイアログでyesまたはnoを選択したときに
// RenderProcess側から呼び出される関数
ipc.on('close-window', function(evt, arg) {
  var webcontent = evt.sender;
  var w = hash.getWindow(webcontent);

  hash.delete(webcontent);

  // 閉じるフラグを立てておく
  w.enable_close = true;
  w.close();
});

app.on('window-all-closed', function() {
    console.log("window-all-closed");
    app.quit();
});

app.on('ready', function() {
  createWindow();
});
