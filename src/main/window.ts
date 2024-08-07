import { app, BrowserWindow } from 'electron';
import path from 'path';
import GADE from './gade';
import { resolveHtmlPath } from './util';

export const windows: { [id: string]: BrowserWindow } = {};

export type WindowOptions = {
    hideOverlay?: boolean;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    resizable?: boolean;
    noDevTools?: boolean;
};

export const openWindow = (
    windowPath?: string,
    options: WindowOptions = {},
) => {
    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    const window = new BrowserWindow({
        show: false,
        width: options.width || 1000,
        height: options.height || 700,
        minWidth: options.minWidth || 500,
        minHeight: options.minHeight || 500,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, 'preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: options.hideOverlay
            ? false
            : {
                  color: '#1e2024',
                  symbolColor: '#ffffffaa',
                  height: 40,
              },
        resizable: options.resizable || true,
    });

    if (windowPath) {
        window.loadURL(resolveHtmlPath(`index.html/${windowPath}`));
    }

    window.on('ready-to-show', () => {
        if (!window) {
            throw new Error('"window" is not defined');
        }

        window.show();

        if (options.noDevTools) {
            window.webContents.closeDevTools();
        }
    });

    const keys = Object.keys(windows);
    let index = 0;

    while (keys.includes(`${index}`)) ++index;

    windows[`${index}`] = window;

    return index;
};

export const closeWindow = (id: number) => {
    windows[id].close();
    delete windows[id];
};

GADE.register('Window.Open', openWindow);
GADE.register('Window.Close', closeWindow);
