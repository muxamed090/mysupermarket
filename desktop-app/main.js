const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
    backgroundColor: '#1a5276',
  })

  // Frontend-ka build-gareeyay ka load garee
  mainWindow.loadFile(path.join(__dirname, 'frontend-build', 'index.html'))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Links-ka dibadda ah browser-ka furi, ee app-ka kuma furo
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Menu-ga app-ka nadiifi
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Dib u Cusbooneysii', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { type: 'separator' },
        { label: 'Ka Bax', role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'zoomIn', label: 'Sii weyneey' },
        { role: 'zoomOut', label: 'Sii yareey' },
        { role: 'resetZoom', label: 'Dib u celi' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Shaashadda Buuxa' },
      ]
    },
    {
      label: 'Caawimaad',
      submenu: [
        {
          label: 'Ku saabsan MySupermarket',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox(mainWindow, {
              title: 'MySupermarket',
              message: 'MySupermarket v1.0.0',
              detail: 'Nidaamka Maamulka Dukaanka\n© 2026',
            })
          }
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})