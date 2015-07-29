var ipc = require('ipc');

function closeWindow() {
	console.log(rv);

	// 閉じるかどうかを確認
	var rv = ipc.sendSync('show-dialog');
	console.log(rv);

	// yesまたはnoを選択した場合はウインドウを閉じる
	// cancelの場合はウインドウを閉じない
	if (rv == 0 || rv == 1) {
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
