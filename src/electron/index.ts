import { app } from "electron";
import mainService from "./services/main.service";
import path from 'node:path';

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

declare const global: any;

global.MAIN_WINDOW_VITE_PRELOAD = path.join(__dirname, 'preload.js');
global.MAIN_WINDOW_VITE_HTML = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);

app.on("ready", () => mainService.init());
