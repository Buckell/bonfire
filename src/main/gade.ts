import { IpcMainEvent, ipcMain, BrowserWindow } from 'electron';

const GADE = {
    receive: (
        id: string,
        callback: (event: IpcMainEvent, ...args: any[]) => void,
    ) => ipcMain.on(id, callback),
    receiveOnce: (
        id: string,
        callback: (event: IpcMainEvent, ...args: any[]) => void,
    ) => ipcMain.once(id, callback),
    send: (
        id: string,
        window: BrowserWindow,
        ...args: any[]
    ) => window.webContents.send(id, ...args),
    call: (
        channel: string,
        window: BrowserWindow,
        ...args: any[]
    ) =>
        new Promise((resolve) => {
            GADE.send(channel, window, ...args);
            GADE.receiveOnce(channel, resolve);
        }),
    register: (channel: string, callback: Function) => {
        GADE.receive(channel, (event, ...args) => {
            const result = callback(...args);

            if (result instanceof Promise) {
                result
                    .then((value) => event.reply(channel, value))
                    .catch(() => event.reply(channel, undefined));
            } else {
                event.reply(channel, result);
            }
        });
    },
};

export default GADE;
