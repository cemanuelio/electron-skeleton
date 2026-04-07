import { app, ipcMain } from "electron";
import eventService from "./event.service";
import windowService from "./window.service";

class MainService {
  globalActionsRegistered = false;

  relaunch() {
    app.relaunch();
    app.exit();
  }

  async init() {
    await eventService.registerControllers();
    this.registerGlobalActions();
    windowService.createMainWindow({
      width: 720,
      height: 600,
      frame: true,
      transparent: false,
    });
  }

  close() {
    windowService.closeMainWindow();
  }

  registerGlobalActions() {
    if (!this.globalActionsRegistered) {
      ipcMain.on("getControllerActions", (e) => {
        e.returnValue = eventService.getControllerActions();
      });

      ipcMain.on("isPackaged", (e) => {
        e.returnValue = app.isPackaged;
      });

      this.globalActionsRegistered = true;
    }
  }
}

export default new MainService();
