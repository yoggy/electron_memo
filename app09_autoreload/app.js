var app = require('app');
var BrowserWindow = require('browser-window');
var client = require('electron-connect').client;  // ←ここを追加

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

function createWindow(title_string) {
	var w = new BrowserWindow({
		width: 1000,
		height: 600,
		title: title_string,
	});

	w.setMenu(null);
  w.openDevTools();

	return w;
}

app.on('ready', function() {
  var mainWindow = createWindow();
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // Connect to server process
  client.create(mainWindow);  // ←ここを追加
});
