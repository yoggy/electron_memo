var ipc = require('ipc');

function closeWindow() {
	console.log(rv);

	// 閉じるかどうかを確認
	var rv = ipc.sendSync('show-dialog');
	console.log(rv);

	// yesを選択した場合はウインドウを閉じる
	if (rv == 0) {
		ipc.send('close-window');
	}
}

function init() {
	d3.select("#button_create").on("click", function() {
		ipc.send('create-window');
	});

	// ウインドウを閉じるボタンを押したときにMain Process側から受信するイベント
	ipc.on('close-window-event', function(arg) {
		closeWindow();
	});
}
