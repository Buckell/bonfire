import { IpcMainEvent, ipcMain, BrowserWindow } from 'electron';

const hooks: { [channel: string]: { [id: string]: Function } } = {};

const GADE = {
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
            GADE.send(id, window, ...args);
        }),
    call: (channel: string, window: BrowserWindow, ...args: any[]) =>
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
    hooks: {
        add: (channel: string, id: string, callback: Function) => {
            let channelHooks = hooks[channel];

            if (channelHooks === undefined) {
                // eslint-disable-next-line no-multi-assign
                channelHooks = hooks[channel] = {};
            }

            channelHooks[id] = callback;
        },
        call: (channel: string, ...args: any[]) => {
            Object.values(hooks[channel] || {}).forEach((callback) =>
                callback(...args),
            );
        },
        bridge: (channel: string) => {
            GADE.hooks.add(
                channel,
                'GADE.TRANSMISSION_BRIDGE',
                (...args: any[]) => {
                    GADE.broadcast(channel, ...args);
                },
            );
        },
        dispatch: (channel: string) => {
            GADE.receive(channel, (event: IpcMainEvent, ...args: any[]) => {
                GADE.hooks.call(channel, ...args);
            });
        },
        internal: hooks,
    },
};

export default GADE;
