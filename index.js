const electron = require("electron");
const {
	app,
	BrowserWindow,
	dialog
} = electron;

app.on('ready', function() {
	var win = new BrowserWindow({
		width: 800,
		height: 600
	});
	win.loadURL('file://' + __dirname + '/main.html');
	//win.openDevTools();
});
/*app.on('browser-window-created', function(e, window) {
	window.setMenu(null);
});*/
