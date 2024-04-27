import { app, BrowserWindow } from 'electron';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import GADE from '../gade';
import { createMenuWindow } from './createMenuWindow';
import { mainWindow } from '../main';

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
const menuWindows: BrowserWindow[] = [];
let currentLevel = 0;

const closeMenu = (level: number) => {
    if (level === 0) {
        mainMenuWindow.setOpacity(0);
        mainMenuWindow.hide();
    }

    currentLevel = level - 1;

    --level;

    for (let i = level; i < menuWindows.length; ++i) {
        const window = menuWindows[i];

        if (window) {
            window.setOpacity(0);
            window.hide();
        }
    }

    const newCurrentWindow = level < 1 ? mainMenuWindow : menuWindows[level];

    if (newCurrentWindow) {
        newCurrentWindow.focus();
    }
};

const handleBlur = (level: number) => {
    if (level === currentLevel) {
        closeMenu(0);
        GADE.broadcast('Menu.Blur');
    }
};

const pushNewMenuWindow = () => {
    const menu = createMenuWindow();

    const thisLevel = menuWindows.length + 1;

    menu.on('blur', () => handleBlur(thisLevel));

    menuWindows.push(menu);
};

app.whenReady().then(() => {
    mainMenuWindow = createMenuWindow();

    mainMenuWindow.on('blur', () => handleBlur(0));

    pushNewMenuWindow();
    pushNewMenuWindow();
});

const calculateHeight = (items: MenuItem[]) => {
    let height = 0;

    items.forEach((item) => {
        if (item.divider) {
            height += 5;
        } else {
            height += 30;
        }
    });

    return height;
};

const openMenu = (data: MenuData) => {
    let selectedMenu: BrowserWindow | undefined;

    if (data.level === 0) {
        selectedMenu = mainMenuWindow;
    } else {
        selectedMenu = menuWindows[data.level - 1];
    }

    closeMenu(data.level + 1);

    currentLevel = data.level;

    GADE.call('Menu.DataTransmit', selectedMenu, data);

    if (!selectedMenu) {
        return;
    }

    selectedMenu.setPosition(data.x, data.y);
    selectedMenu.setResizable(true);
    selectedMenu.setSize(250, calculateHeight(data.items), false);
    selectedMenu.showInactive();
    selectedMenu.show();
    selectedMenu.setOpacity(1);
};

GADE.register('Menu.Open', openMenu);
GADE.register('Menu.Close', closeMenu);

GADE.receive('Menu.Action', (event, id) => {
    if (mainWindow) {
        GADE.broadcast('Menu.Action', id);
    }
});
