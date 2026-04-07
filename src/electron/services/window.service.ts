import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  screen,
} from "electron";

declare const MAIN_WINDOW_VITE_PRELOAD: string;
declare const MAIN_WINDOW_VITE_HTML: string;

class WindowService {
  mainWindow: BrowserWindow;

  private centerWindow(window: BrowserWindow) {
    const { x, y } = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    window.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y);
    window.center();
  }

  createMainWindow(config: BrowserWindowConstructorOptions) {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      this.mainWindow = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        frame: false,
        transparent: true,
        webPreferences: {
          preload: MAIN_WINDOW_VITE_PRELOAD,
        },
        ...config,
      });

      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
          this.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      } else {
        this.mainWindow.loadFile(MAIN_WINDOW_VITE_HTML);
      }

      this.centerWindow(this.mainWindow);
    }
    this.mainWindow.show();
  }

  private exists() {
    return this.mainWindow && !this.mainWindow.isDestroyed();
  }

  emitEvent(event: string, ...args: any[]) {
    if (this.exists()) {
      this.mainWindow.webContents.send(event, ...args);
    }
  }

  resizeMainWindow(width: number, height: number) {
    if (this.mainWindow) {
      this.mainWindow.setResizable(true);
      this.mainWindow.setSize(width, height, true);
      this.mainWindow.setResizable(false);
    }
  }

  maximizeMainWindow() {
    if (this.exists()) {
      this.mainWindow.maximize();
    }
  }

  minimizeMainWindow() {
    if (this.exists()) {
      this.mainWindow.minimize();
    }
  }

  closeMainWindow() {
    if (this.exists()) {
      this.mainWindow.close();
    }
  }
}

export default new WindowService();
