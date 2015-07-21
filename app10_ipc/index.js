var ipc = require('ipc');

var message_str = null;
var st = 0;

function check() {
	if (now() - st > 1000) {
		d3.select('#message').text("");
	}
}

function now() {
	return new Date().getTime();
}

function message(str) {
	d3.select('#message').text(str);
	st = now();
}

function init() {
	setInterval(check, 500);

	d3.select("#button_sync").on('click', function () {
		var rv = ipc.sendSync('test_sync', '(sync)ping');
		message(rv);
	});

	d3.select("#button_async").on('click', function () {
		ipc.send('test_async', '(async)ping');
	});

	ipc.on('test_async_reply', function(arg) {
		message(arg);
	});

	// 間違えて(RenderWindow)同期send呼び出し -> (BrowserWindow)async返しすると
	// タイマーが止まるので注意
}
