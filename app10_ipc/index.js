var ipc = require('ipc');

var message_str = null;
var st = 0;

function check() {
	console.log("check()");
}

function message(str) {
	d3.select('#message').text(str);
}

function init() {
	setInterval(check, 1000);

	d3.select("#button_sync").on('click', function () {
		var rv = ipc.sendSync('test_sync', '(sync)ping');
		message(rv);
	});

	d3.select("#button_async").on('click', function () {
		ipc.sendSync('test_async', '(async)ping');
	});

	ipc.on('test_async_reply', function(arg) {
		message(arg);

		// なぜかここでsetIntervalしているタスクが止まる??
	});
}
