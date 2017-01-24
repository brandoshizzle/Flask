/*jshint esversion: 6 */
const electron = require("electron");
const {app, BrowserWindow, dialog} = electron;

//if (require('electron-squirrel-startup')) return;

app.on('ready', function() {
	var win = new BrowserWindow();
	win.maximize();
	win.loadURL('file://' + __dirname + '/src/main.html');
	win.openDevTools();
});

app.on('window-all-closed', function() {
	app.quit();
});
