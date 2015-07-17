var BrowserWindow;

function isElectron() {
	if (typeof(require) == 'undefined') return false;
	return true;
}

function reload() {
	if (isElectron() == true) {
		// reload index.html
		BrowserWindow.getFocusedWindow().reloadIgnoringCache();
	}
	else {
		location.reload();
	}
}

function init() {
	if (isElectron() == true) {
		var remote = require('remote');
		BrowserWindow = remote.require('browser-window')
	}

	d3.select("#button_reload").on("click", function() {
		console.log("click #button_reload")
		reload();
	});
}
