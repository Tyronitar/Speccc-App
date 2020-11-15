const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
   win = new BrowserWindow({show: false})
   win.maximize()
   win.show()
   win.setMinimumSize(960, 600)
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))
   win.webContents.openDevTools() // use this line to see dev console
}

app.on('ready', createWindow)