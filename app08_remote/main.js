var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

function createWindow(title_string) {
	var w = new BrowserWindow({
		width: 800,
		height: 480,
		title: title_string,
	});

	w.setMenu(null);
  w.openDevTools();

	return w;
}

app.on('ready', function() {
  var w = createWindow();
  w.loadUrl('file://' + __dirname + '/index.html');
  w.on('closed', function() {
    mainWindow = null;
  });
});
