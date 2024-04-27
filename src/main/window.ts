import { app, BrowserWindow } from 'electron';
import path from 'path';
import GADE from './gade';
import { resolveHtmlPath } from './util';

const windows: any = {};

const openWindow = (windowPath: string) => {
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
        titleBarOverlay: {
            color: '#1e2024',
            symbolColor: '#ffffffaa',
            height: 40,
        },
    });

    window.loadURL(resolveHtmlPath(`index.html/${windowPath}`));

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

GADE.register('Window.Open', openWindow);
