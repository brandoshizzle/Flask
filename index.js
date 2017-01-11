/*jshint esversion: 6 */
const electron = require("electron");
const {
	app,
	BrowserWindow,
	dialog
} = electron;

if (require('electron-squirrel-startup')) return;

app.on('ready', function() {
	var win = new BrowserWindow({
		width: 800,
		height: 600
	});
	win.loadURL('file://' + __dirname + '/src/main.html');
	//win.openDevTools();
});
