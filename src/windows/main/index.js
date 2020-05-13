import _Window from 'lib/window';
import path from 'path';

const create = () => {
  const mainWindow = new _Window({
    display: 'primary',
    width: 800,
    height: 600,
    filename: path.resolve('.', 'dist', 'main.html'),
    backgroundColor: '#fff',
    onClosed: () => console.log('main window closed')
  });

  return mainWindow;
};

export default { create };
