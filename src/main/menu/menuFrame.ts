import { app, BrowserWindow } from 'electron';
import GADE from '../gade';
import { createMenuWindow } from './createMenuWindow';
import { mainWindow } from '../main';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type MenuItem = {
    label: string | undefined;
    shortcut: string | undefined;
    divider: boolean | undefined;
    dropdown: MenuItem[] | undefined;
    icon: IconDefinition | undefined;
};

type MenuData = {
    x: number;
    y: number;
    level: number;

    items: MenuItem[];
};

let mainMenuWindow: BrowserWindow;
let menuWindows: BrowserWindow[] = [];

let block = false;

app.whenReady().then(() => {
    mainMenuWindow = createMenuWindow();

    mainMenuWindow.on('blur', () => {
        closeMenu(0);

        if (mainWindow) {
            GADE.send("Menu.Blur", mainWindow);
        }
    });

    menuWindows.push(createMenuWindow());
    menuWindows.push(createMenuWindow());
});

const calculateHeight = (items: MenuItem[]) => {
    let height = 0;

    items.forEach((item) => {
        if (item.divider) {
            height += 5;
        } else {
            height += 31;
        }
    });

    return height;
};

const openMenu = (data: MenuData) => {
    let selectedMenu : BrowserWindow | undefined;

    if (data.level == 0) {
        selectedMenu = mainMenuWindow;
    } else {
        selectedMenu = menuWindows[data.level - 1];
    }

    closeMenu(data.level + 1);

    GADE.call("Menu.DataTransmit", selectedMenu, data);

    if (!selectedMenu) {
        return;
    }

    selectedMenu.setPosition(data.x, data.y);
    selectedMenu.setResizable(true);
    selectedMenu.setSize(250, calculateHeight(data.items), false);
    selectedMenu.setResizable(false);
    selectedMenu.showInactive();
    selectedMenu.setAlwaysOnTop(true);
    selectedMenu.setOpacity(1);

    if (data.level == 0) {
        selectedMenu.focus();
    }
};

const closeMenu = (level: number) => {
    if (level === 0) {
        mainMenuWindow.setOpacity(0);
        mainMenuWindow.hide();
    }

    --level;

    for (let i = level; i < menuWindows.length; ++i) {
        const window = menuWindows[i];

        if (window) {
            window.setAlwaysOnTop(false);
            window.setOpacity(0);
            window.hide();
        }
    }
};

GADE.register("Menu.Test", openMenu);
GADE.register("Menu.Close", closeMenu);

GADE.receive("Menu.Action", (event, id) => {
    if (mainWindow) {
        GADE.send("Menu.Action", mainWindow, id);
    }
});
