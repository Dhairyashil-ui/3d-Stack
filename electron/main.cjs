const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'NAKSHA V2.0 Desktop Workstation (3D Survey Edition) — Ministry of Rural Development',
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: false
  });

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Select State...', accelerator: 'CmdOrCtrl+S', click: () => { mainWindow.webContents.send('desktop-action', 'select-state'); } },
        { label: 'Import GDB Layer...', click: () => { mainWindow.webContents.send('desktop-action', 'import-gdb'); } },
        { label: 'Import TPK Image...', click: () => { mainWindow.webContents.send('desktop-action', 'import-tpk'); } },
        { type: 'separator' },
        { label: 'Exit', role: 'quit' }
      ]
    },
    {
      label: 'Geospatial Tools',
      submenu: [
        { label: 'Run Geometry Validation', click: () => { mainWindow.webContents.send('desktop-action', 'validate-geom'); } },
        { label: 'Verify Schema Conformity', click: () => { mainWindow.webContents.send('desktop-action', 'validate-schema'); } },
        { label: 'Inspect 3D Reconstruction', click: () => { mainWindow.webContents.send('desktop-action', 'open-3d'); } }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'User Manual (PDF)',
          click: async () => {
            const { shell } = require('electron');
            await shell.openPath(path.join(__dirname, '../public/downloads/NAKSHA_Desktop_User_Manual.pdf'));
          }
        },
        {
          label: 'About NAKSHA Desktop Suite',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About NAKSHA Desktop',
              message: 'NAKSHA Desktop Application v2.4.0\nDepartment of Land Resources (DoLR), Ministry of Rural Development\nDeveloped by MPSEDC\nFor Survey of India (SOI) & Empaneled Surveyors.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Load the desktop route
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173/desktop';
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
