const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let window = null;

app.once('ready', function() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor:"#ffffff",
        show: false
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.once('ready-to-show', function() {
        window.show();
    });
});
