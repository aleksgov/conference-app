const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const appUrl = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../out/index.html')}`;

    mainWindow.loadURL(appUrl);
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
