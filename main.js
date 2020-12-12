const {app, BrowserWindow} = require("electron");

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 100,
        width: 100,
        fullscreen: true,
        frame: false,
        minimizable: false,
        backgroundColor: "#222",
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`file://${__dirname}/dom/index.html`);
    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow === null) {
        createWindow();
    }
});