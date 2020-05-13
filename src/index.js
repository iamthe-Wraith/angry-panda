import _Main from 'windows/main';

const { app, ipcMain } = require('electron');

let _mainWindow = null;

app.on('ready', () => {
  createMainWindow();
});

const createMainWindow = () => {
  console.log('creating main window');
  _mainWindow = _Main.create();
};
