const { app, BrowserWindow, ipcMain } = require("electron");
const {
  startExternalProcess,
  stopExternalProcess,
} = require("./process-manager");

const path = require("node:path");
const electronReload = require("electron-reload");
electronReload(__dirname);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.openDevTools();

  ipcMain.on("start-process", async () => {
    console.log("Starting process");
    win.webContents.send("update-status", "Starting...");
    await startExternalProcess((status) => {
      win.webContents.send("update-status", status);
    });
  });

  ipcMain.on("stop-process", async () => {
    console.log("Stopping process");
    win.webContents.send("update-status", "Stopping...");
    await stopExternalProcess();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", async () => {
  console.log("app.will-quit");
  await stopExternalProcess();
});

app.on("window-all-closed", () => {
  console.log("app.window-all-closed");
  if (process.platform !== "darwin") app.quit();
});
