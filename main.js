const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const os = require('os');
if(require('electron-squirrel-startup')) return;

const platforms = {
  WINDOWS: 'WINDOWS',
  MAC: 'MAC',
  LINUX: 'LINUX',
  SUN: 'SUN',
  OPENBSD: 'OPENBSD',
  ANDROID: 'ANDROID',
  AIX: 'AIX',
};

const platformsNames = {
  win32: platforms.WINDOWS,
  darwin: platforms.MAC,
  linux: platforms.LINUX,
  sunos: platforms.SUN,
  openbsd: platforms.OPENBSD,
  android: platforms.ANDROID,
  aix: platforms.AIX,
};

const currentPlatform = platformsNames[os.platform()];

let win

function createWindow() {
   options = {
      show: false,
      icon: 'assets/icon.ico'
   }
   if (currentPlatform === 'MAC') {
      options.icon = "assets/icon.icns"
   }
   else if (currentPlatform === 'LINUX') {
      options.icon = "assets/icon.png"
   }
   win = new BrowserWindow(options)
   win.maximize()
   win.show()
   win.setMinimumSize(960, 600)
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
   }))
   // win.webContents.openDevTools() // use this line to see dev console
}

app.on('ready', createWindow)

// makes app stay open with unopen windows on macOS
app.on(
   "window-all-closed",
   () => process.platform !== "darwin" && app.quit() // "darwin" targets macOS only.
);