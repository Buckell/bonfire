import { app, BrowserWindow } from 'electron';
import path from 'path';
import GADE from './gade';
import { resolveHtmlPath } from './util';

export const windows: { [id: string]: BrowserWindow } = {};

export type WindowOptions = {
    hideOverlay?: boolean;
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
        width: 1000,
        height: 700,
        minWidth: 500,
        minHeight: 500,
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
    });

    if (windowPath) {
        window.loadURL(resolveHtmlPath(`index.html/${windowPath}`));
    }

    window.on('ready-to-show', () => {
        if (!window) {
            throw new Error('"window" is not defined');
        }

        window.show();
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
