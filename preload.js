const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  startProcess: () => ipcRenderer.send("start-process"),
  stopProcess: () => ipcRenderer.send("stop-process"),
  onUpdateStatus: (callback) =>
    ipcRenderer.on("update-status", (_event, value) => callback(value)),
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
