/***
 * TODO - add data passing to newly created window
 ***/

export default class _Window {
  constructor (props) {
    const {
      display = 'primary',
      frame = false,
      x = 'center',
      y = 'center',
      width = 'full',
      height = 'full',
      backgroundColor = '#000',
      filename = '',
      data = {},
      onClose = () => {},
      onClosed = () => {}
    } = props;

    const { BrowserWindow, screen } = require('electron');

    this._onClose = onClose;
    this._onClosed = onClosed;

    this._display = this.getDisplay(display, screen);
    this._windowSize = this.getWindowSize(width, height);
    this._coords = this.getCoords(x, y);

    if (filename !== '') {
      this._window = new BrowserWindow({
        frame: frame,
        x: this._coords.x,
        y: this._coords.y,
        width: this._windowSize.width,
        height: this._windowSize.height,
        backgroundColor: backgroundColor,
        webPreferences: {
          nodeIntegration: true
        }
      });

      this._window.loadFile(filename);
      this._window.on('close', () => { this._onClose(); });
      this._window.on('closed', () => { this._onClosed(); });
    } else {
      throw new Error('no filename found');
    }
  }

  /***
   * triggers the close event on this window.
   ***/
  close () {
    this._window.close();
  }

  /***
   * triggers the focus event on this window
   ***/
  focus () {
    this._window.focus();
  }

  /***
   * gets the x and y coordinates of the top left corner of the window.
   *
   * @param {number|string} x - the desired x coordinate of the top
   * left corner of the window. allowed values include: 'left', 'center',
   * 'right', or a numerical pixel value.
   * @param {number|string} y - the desired y coordinate of the top
   * left corner of the window. allowed values include: 'top', 'center',
   * 'bottom', or a numberical pixel value.
   * @returns {Object} - the window coordinate object with properties
   * x and y.
   ***/
  getCoords (x, y) {
    const cords = { x: 0, y: 0 };

    const xRegex = /left|center|right|\d/;
    const yRegex = /top|center|bottom|\d/;

    if (xRegex.test(x.toString()) && yRegex.test(y.toString())) {
      if (x === 'left') {
        cords.x = this._display.bounds.x + 10;
      } else if (x === 'center') {
        cords.x = this._display.bounds.x + (Math.floor(this._display.bounds.width / 2) - Math.floor(this._windowSize.width / 2));
      } else if (x === 'right') {
        cords.x = this._display.bounds.x + (this._display.bounds.width - 12) - this._windowSize.width;
      } else {
        if (x < 0) {
          cords.x = this._display.bounds.x;
        } else if (x > this._display.bounds.width) {
          cords.x = this._display.bounds.x + this._display.bounds.width;
        } else {
          cords.x = this._display.bounds.x + x;
        }
      }

      if (y === 'top') {
        cords.y = this._display.workArea.y;
      } else if (y === 'center') {
        cords.y = this._display.workArea.y + (Math.floor(this._display.workArea.height / 2) - Math.floor(this._windowSize.height / 2));
      } else if (y === 'bottom') {
        cords.y = this._display.workArea.y + (this._display.workArea.height - 10 - this._windowSize.height);
      } else {
        if (y < 0) {
          cords.y = this._display.workArea.y;
        } else if (y > this._display.workArea.height) {
          cords.y = this._display.workArea.y + this._display.workArea.height;
        } else {
          cords.y = this._display.workArea.y + y;
        }
      }

      return cords;
    } else {
      throw new Error(`invalid window coordinates found: { x: ${x}, y: ${y} }`);
    }
  }

  /***
   * gets the display to show this window on
   *
   * @param {number|string} displayId - the ID of the
   * display. possible values include: 'primary', or the
   * numerical index of the display if is not the primary
   * display.
   * @returns {electron.Display} - the display to show the
   * window on.
   ***/
  getDisplay (displayId, screen) {
    if (displayId === 'primary' || typeof displayId === 'number') {
      const unorderedDisplays = screen;

      if (unorderedDisplays.getAllDisplays().length > 1) {
        const orderedDisplays = this.sortDisplays(unorderedDisplays, screen);

        if (typeof displayId === 'number' && orderedDisplays[displayId]) {
          return orderedDisplays[displayId];
        } else {
          return unorderedDisplays.getPrimaryDisplay();
        }
      } else {
        return unorderedDisplays.getPrimaryDisplay();
      }
    } else {
      throw new Error(`invalid display found: ${displayId}`);
    }
  }

  /***
   * gets the size of the window in pixels
   *
   * @param {number|string} width - the desired width of the
   * window. possible values include: 'full', or a specific
   * pixel value.
   * @param {number|string} height - the desired height of the
   * window. possible values include: 'full' or a specific
   * pixel value.
   * @returns {Object} - the window size object with properties
   * width and height.
   ***/
  getWindowSize (width, height) {
    if ((width === 'full' || typeof width === 'number') && (height === 'full' || typeof height === 'number')) {
      return {
        width: width === 'full' ? this._display.workArea.width : width,
        height: height === 'full' ? this._display.workArea.height : height
      };
    } else {
      throw new Error(`invalid window size found: { width: ${width}, height: ${height}}`);
    }
  }

  /***
   * sends data from the main process to the remote
   *
   * @param {string} event - the name of the event to be
   * sent to remote
   * @param {Object} data - the data object to be sent
   ***/
  send (name, data) {
    this._window.webContents.send(name, data);
  }

  /***
   * sorts the available displays from left to right
   *
   * @param {electron.Screen} displays - all the available
   * displays, in no particular order.
   * @return {electron.Display[]} - returns an array of all
   * displays (minus the primary display) in order from left
   * to right by the x coordinate.
   ***/
  sortDisplays (displays, screen) {
    const primaryDisplay = displays.getPrimaryDisplay();

    return displays.getAllDisplays().reduce((result, display) => {
      if (display.id !== primaryDisplay.id) {
        result.push(display);
      }

      return result;
    }, []).sort((x, y) => {
      if (x.bounds.x > y.bounds.x) {
        return -1;
      } else if (x.bounds.x < y.bounds.x) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
