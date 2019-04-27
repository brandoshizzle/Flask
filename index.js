/*jshint esversion: 6 */
const electron = require('electron');
const { app, BrowserWindow, dialog } = electron;
//var client = require('electron-connect').client;

app.on('ready', function() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    const options = {
        width: width,
        height: height,
        webPreferences: {
            nodeintegration: true
        },
        darkTheme: true
    };
    const win = new BrowserWindow(options);
    win.maximize();
    win.loadURL('file://' + __dirname + '/src/main.html');
    // Connect to server process
    //client.create(win);
    //win.openDevTools();
});

app.on('window-all-closed', function() {
    app.quit();
});
