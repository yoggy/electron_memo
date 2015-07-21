var app = require('app');
var BrowserWindow = require('browser-window');
var client = require('electron-connect').client
var ipc = require('ipc');

var mainWindow = null;

ipc.on('test_sync', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = '(sync)pong';
});

ipc.on('test_async', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.sender.send('test_async_reply', '(async)pong');
});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

function createWindow(title_string) {
	var w = new BrowserWindow({
		width: 400,
		height: 300,
		title: title_string,
	});

	w.setMenu(null);
//  w.openDevTools();

	return w;
}

app.on('ready', function() {
  var mainWindow = createWindow("app10_ipc");
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  client.create(mainWindow);
});
