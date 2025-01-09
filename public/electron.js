const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const isDev = require("electron-is-dev");

const ipc = ipcMain;

let win;

const createWindow = () => {
  const nonce = crypto.randomBytes(16).toString("base64"); // Genera el nonce único
  console.log(nonce);

  win = new BrowserWindow({
    width: 1200,
    height: 680,
    minWidth: 940,
    minHeight: 560,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: isDev,
      sandbox: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          `default-src 'self'; 
          script-src 'self'; 
          style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; 
          font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com data:; 
          connect-src 'self' https://api.shakarzr.com http://localhost:4000; 
          img-src 'self' data:; 
          media-src 'self' blob: data:;`,
        ],
        "X-Content-Type-Options": ["nosniff"],
        "X-Frame-Options": ["DENY"],
      },
    });
  });

  win.setIcon(path.join(__dirname, "./img/logo/icon.png"));

  win.loadURL(
    isDev
      ? `http://localhost:3000?nonce=${encodeURIComponent(nonce)}`
      : `file://${path.join(
          __dirname,
          "../build/index.html"
        )}?nonce=${encodeURIComponent(nonce)}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }

  const splash = new BrowserWindow({
    width: 700,
    height: 500,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
  });

  splash.loadFile(path.join(__dirname, "./splash-screen.html"));
  splash.center();
  setTimeout(function () {
    splash.close();
    win.center();
    win.show();
  }, 6300);

  ipc.on("purchase-app", async (event, { productId, userId, userEmail }) => {
    try {
      const response = await axios.post(
        `https://api.shakarzr.com/api/payments/create-checkout-session`,
        { productId, userId, email: userEmail }
      );
      const { url } = response.data;

      require("electron").shell.openExternal(url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  });

  ipc.on("closeApp", () => {
    win.close();
  });

  ipc.on("minimizeApp", () => {
    win.minimize();
  });

  var handleRedirect = (e, url) => {
    if (url !== win.webContents.getURL()) {
      e.preventDefault();
      require("electron").shell.openExternal(url);
    }
  };

  win.webContents.on("will-navigate", handleRedirect);
  win.webContents.on("new-window", handleRedirect);
};

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

ipc.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

ipc.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("error", (message) => {
  console.error("There was a problem updating the application");
  console.error(message);
});

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
