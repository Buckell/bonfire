import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

const TRANSMISSION = {
    receive: (
        id: string,
        callback: (event: IpcMainEvent, ...args: any[]) => void,
    ) => ipcMain.on(id, callback),
    receiveOnce: (
        id: string,
        callback: (event: IpcMainEvent, ...args: any[]) => void,
    ) => ipcMain.once(id, callback),
    send: (id: string, window: BrowserWindow, ...args: any[]) =>
        window.webContents.send(id, ...args),
    broadcast: (id: string, ...args: any[]) =>
        BrowserWindow.getAllWindows().forEach((window) => {
            TRANSMISSION.send(id, window, ...args);
        }),
    call: (channel: string, window: BrowserWindow, ...args: any[]) =>
        new Promise((resolve) => {
            TRANSMISSION.send(channel, window, ...args);
            TRANSMISSION.receiveOnce(channel, resolve);
        }),
    register: (channel: string, callback: Function) => {
        TRANSMISSION.receive(channel, (event, ...args) => {
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

export default TRANSMISSION;
