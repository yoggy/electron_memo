function isElectron() {
	// requireの存在でElectron環境かどうかを判断している
	if (typeof(require) == 'undefined') {
		return false;
	}
	return true;
}

function setMessage(str) {
	var e = document.getElementById("message");
	e.innerText = str;
}

function init() {
	if (isElectron() == true) {
		setMessage("チェック結果 → Electronで表示しています。");
	}
	else {
		setMessage("チェック結果 → Electron環境ではありません。。。");
	}
}
