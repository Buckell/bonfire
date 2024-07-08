import {
    dialog,
    OpenDialogOptions,
    SaveDialogOptions,
    BrowserWindow,
} from 'electron';
import GADE from './gade';
import { closeWindow, openWindow, windows } from './window';
import { DialogData } from '../gade_shared/dialog';
import { resolveHtmlPath } from './util';

GADE.register('Dialog.Open', (data: DialogData) => {
    const id: number = openWindow(undefined, {
        hideOverlay: true,
    });

    const window: BrowserWindow = windows[id];

    window.loadURL(
        resolveHtmlPath(
            `index.html/dialog?${JSON.stringify({
                ...data,
                id,
            }).replaceAll('.', '<P>')}`,
        ),
    );

    window.setMinimumSize(400, 150);
    if (data.size) {
        window.setSize(data.size[0], data.size[1]);
    } else {
        window.setSize(400, 150);
    }
    window.setResizable(false);
    window.center();
    window.focus();

    window.on('ready-to-show', () => {
        window.webContents.closeDevTools();
    });

    return id;
});

GADE.register('Dialog.Close', (id: number) => {
    closeWindow(id);
});

GADE.receive('Dialog.Action', (event, id: number, action: string) => {
    GADE.broadcast('Dialog.Action', id, action);
});

GADE.register('FileDialog.Open', (options?: OpenDialogOptions) =>
    dialog.showOpenDialog(
        options || {
            properties: ['openFile'],
        },
    ),
);

GADE.register('FileDialog.Save', (options?: SaveDialogOptions) =>
    dialog.showSaveDialog(options || {})
);
