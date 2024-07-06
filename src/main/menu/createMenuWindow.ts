import { app, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../util';

export const createMenuWindow = (level: number = 0) => {
    const menuWindow = new BrowserWindow({
        minWidth: 10,
        minHeight: 10,
        width: 10,
        height: 10,
        resizable: true,
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, '../preload.js')
                : path.join(__dirname, '../../../.erb/dll/preload.js'),
        },
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        skipTaskbar: true,
        alwaysOnTop: true,
    });

    menuWindow
        .loadURL(resolveHtmlPath(`index.html/menu_frame?${level}`))
        .then(() => menuWindow.webContents.closeDevTools())
        // eslint-disable-next-line no-console
        .catch(console.error);

    menuWindow.setBackgroundColor('#00FFFFFF');
    menuWindow.setBackgroundMaterial('none');

    menuWindow.setOpacity(0);
    menuWindow.hide();

    return menuWindow;
};
