import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

let sessionId = 0;

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
            TRANSMISSION.send(channel, window, ++sessionId, ...args);
            TRANSMISSION.receiveOnce(`R${sessionId}: ${channel}`, resolve);
        }),
    register: (channel: string, callback: Function) => {
        TRANSMISSION.receive(channel, (event, sessionId, ...args) => {
            const result = callback(...args);

            const replyChannel = `R${sessionId}: ${channel}`;

            if (result instanceof Promise) {
                result
                    .then((value) => event.reply(replyChannel, value))
                    .catch(() => event.reply(replyChannel, undefined));
            } else {
                event.reply(replyChannel, result);
            }
        });
    },
};

export default TRANSMISSION;
