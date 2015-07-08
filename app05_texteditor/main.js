var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var MenuItem = require('menu-item');
var dialog = require('dialog');

var menu_template = [
	{
	    label: 'File',
	    submenu: [
	    	{
	    		label: 'new',
	    		click: function(menuItem, w) { createNewDocument(); }
	    	},
	    	{
	    		label: 'open',
	    		click: function(menuItem, w) { onOpenDocument(); }
	      	},
	      	{
	        	label: 'save',
	        	click: function(menuItem, w) { onSaveDocument(w); }
	      	},
	      	{
	        	label: 'save as ...',
	        	click: function(menuItem, w) { onSaveAsDocument(w); }
	      	},
			{
	        	type: 'separator'
	      	},
	      	{
	        	label: 'close',
	        	click: function(menuItem, w) { w.close(); }
	      	},
			{
	        	type: 'separator'
	      	},
	      	{
	        	label: 'Quit',
	        	accelerator: 'Command+Q',
	        	click: function() { app.quit(); }
	      	},
	    ]
	},
	{
		label: 'Edit',
		submenu: [
			{
	        	label: 'Cut',
	        	accelerator: 'Command+X',
	      	},
	      	{
		      	label: 'Copy',
		      	accelerator: 'Command+C',
	      	},
	      	{
	      		label: 'Paste',
	      		accelerator: 'Command+V',
	      	},
	      	{
	      		label: 'Select All',
	      		accelerator: 'Command+A',
	      	},
		]
  	},
  	{
    	label: 'Help',
    	submenu: [
    		{
			    label: 'About',
			    click: function() { showAboutWindow(); }
			},
    	]
  	},
];

var menu = Menu.buildFromTemplate(menu_template);
Menu.setApplicationMenu(menu);

var ws = [];
var count = 1;

function addWindow(w) {
	ws.push(w);
}

function removeWindow(w) {
	for (var i = 0; i < ws.length; ++i) {
		if (ws[i] === w) {
			ws.splice(i, 1);
			break;
		}
	}
	if (ws.length == 0) {
		app.quit();
	}
}

function showAboutWindow() {
	var w = new BrowserWindow({
		width: 320,
		height: 240,
		resizable: false,
  		title: "appp04_menu"
	});

	w.loadUrl('file://' + __dirname + '/' + 'about.html');
}

function createNewDocument() {
	var filename = "newdocument" + count + ".xml";
	var w = new BrowserWindow({
		width: 600,
		height: 600,
		title: filename
	});
	addWindow(w);
	w.filename = filename;
	w.first_save_flag = true;
	w.unsaved_flag = true;

	count ++;

	w.loadUrl('file://' + __dirname + '/' + filename);

	w.on('close', function(evt) {
		if (onCloseWindow(w) == false) {
			console.log("evt.preventDefault()");
			evt.preventDefault();
		}
	});
}

function openDocument(filename) {
	var w = new BrowserWindow({
		width: 600,
		height: 600,
		title: filename
	});
	addWindow(w);
	w.filename = filename;
	w.first_save_flag = false;
	w.unsaved_flag = false;

	w.loadUrl('file://' + __dirname + '/' + filename);

	w.on('close', function(evt) {
		if (onCloseWindow(w) == false) {
			console.log("evt.preventDefault()");
			evt.preventDefault();
		}
	});
}

function onOpenDocument() {
	var filename = dialog.showOpenDialog(w, {
		properties: ['openFile'],
		filters: [{ name: 'xml', extensions: ['xml'] }]
		});
	console.log(filename);
	if (filename != null) {
		openDocument(filename);
	}
}

function onSaveDocument(w) {
	if (w.first_save_flag == true) {
		return onSaveAsDocument(w);
	}
	else {
		// save action
		w.unsaved_flag = false;
	}
	return true;
}

function onSaveAsDocument(w) {
	var filename = dialog.showSaveDialog(w, {
		defaultPath: w.filename,
		filters: [{ name: 'xml', extensions: ['xml'] }]
		});
	console.log(filename);

	if (filename == null) {
		return false;
	}

	w.filename = filename;
	w.first_save_flag = false;
	w.unsaved_flag = false;
	w.setTitle(filename);
	return true;
}

function onCloseWindow(w) {
	if (w.close_flag == true) return true; // app.quit()...?
	if (w.unsaved_flag == true) {
		var rv = dialog.showMessageBox(w, {
			type: 'info',
			message: w.filename + 'is modified. save changes?',
			buttons: ['Yes', 'No', 'Cancel']
  		});
  		console.log(rv);
  		if (rv == 2) {
	  		return false;
  		}
  		else if (rv == 0) {
  			if (onSaveDocument(w) == false) {
  				return false;
  			}
  		}
	}
	w.close_flag = true;
	removeWindow(w);
	return true;
}

app.on('ready', function() {
	createNewDocument();
});
