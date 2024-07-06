import { Reducer } from '@reduxjs/toolkit';
import { IpcMainEvent } from 'electron';
import { MenuData } from '../../gade_shared/menu';
import { reducers } from './reducers';
import { DialogData } from '../../gade_shared/dialog';

export enum MenuPosition {
    Right,
    Bottom,
}

const hooks: { [channel: string]: { [id: string]: Function } } = {};

const GADE = {
    receiveOnce: (id: string, callback: (...args: any[]) => void) =>
        window.electron.ipcRenderer.once(id, callback),
    receive: (id: string, callback: (...args: any[]) => void) =>
        window.electron.ipcRenderer.on(id, callback),
    send: (id: string, ...args: any[]) =>
        window.electron.ipcRenderer.sendMessage(id, ...args),
    call: (channel: string, ...args: any[]) =>
        new Promise((resolve) => {
            GADE.send(channel, ...args);
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
    openMenu: (data: MenuData) => GADE.call('Menu.Open', data),
    closeMenu: (level: number) => GADE.call('Menu.Close', level),
    openWindow: (path: string) =>
        GADE.call('Window.Open', path) as Promise<number>,
    openDialog: (
        data: DialogData,
        onAction: (id: number, action: string) => void,
    ) =>
        (GADE.call('Dialog.Open', data) as Promise<number>).then(
            (id: number) => {
                GADE.hooks.add(
                    'Dialog.Action',
                    `DIALOG${id}`,
                    (actionId: number, action: string) => {
                        if (actionId === id) {
                            onAction(id, action);
                        }
                    },
                );

                return id;
            },
        ),
    closeDialog: (id: number) => GADE.call('Dialog.Close', id),
    getContextMenuPosition: (event: MouseEvent) => [
        event.screenX,
        event.screenY - 10,
    ],
    getElementMenuPosition: (
        event: MouseEvent,
        position: MenuPosition = MenuPosition.Right,
        element: EventTarget | null = event.currentTarget,
    ) => {
        // @ts-ignore
        if (element && element.getBoundingClientRect) {
            // @ts-ignore
            const boundingRect = element.getBoundingClientRect();

            return [
                Math.floor(
                    event.screenX -
                        event.clientX +
                        boundingRect.left +
                        (position === MenuPosition.Right
                            ? boundingRect.width
                            : 0),
                ),
                Math.floor(
                    event.screenY -
                        event.clientY +
                        boundingRect.top +
                        (position === MenuPosition.Bottom
                            ? boundingRect.height
                            : 0),
                ),
            ];
        }

        return GADE.getContextMenuPosition(event);
    },
    // eslint-disable-next-line no-return-assign
    registerReducer: (name: string, reducer: Reducer) =>
        (reducers[name] = reducer),
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
                    GADE.send(channel, ...args);
                },
            );
        },
        dispatch: (channel: string) => {
            let channelHooks = hooks[channel];

            if (channelHooks?.DISPATCH !== undefined) {
                return;
            }

            if (channelHooks === undefined) {
                // eslint-disable-next-line no-multi-assign
                channelHooks = hooks[channel] = {};
            }

            channelHooks.DISPATCH = () => {};

            GADE.receive(channel, (...args: any[]) => {
                GADE.hooks.call(channel, ...args);
            });
        },
        internal: hooks,
    },
};

GADE.hooks.dispatch('Menu.Action');
GADE.hooks.dispatch('Dialog.Action');

export default GADE;
