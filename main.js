const {app, BrowserWindow, ipcMain, dialog} = require("electron");
const child_process = require("child_process");

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


    ipcMain.on("system.shutdown", function() {
        if (process.platform == "win32") {
            dialog.showMessageBox(mainWindow, {
                message: "System has shutdown",
                title: "System",
                buttons: ["ok"]
            })
        } else if (process.platform == "linux") {
            child_process.exec("sudo shutdown +0", (error, stdout, stderr) => {
                if (error) throw error;
                if (stderr) throw stderr;
                console.log(stdout);
            });
        }
    });

    ipcMain.on("system.restart", function() {
        if (process.platform == "win32") {
            dialog.showMessageBox(mainWindow, {
                message: "System has reboot",
                title: "System",
                buttons: ["ok"]
            })
        } else if (process.platform == "linux") {
            child_process.exec("sudo reboot", (error, stdout, stderr) => {
                if (error) throw error;
                if (stderr) throw stderr;
                console.log(stdout);
            });
        }
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