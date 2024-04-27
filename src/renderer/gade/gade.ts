import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type MenuItem = {
    label: string | undefined;
    shortcut: string | undefined;
    divider: boolean | undefined;
    dropdown: MenuItem[] | undefined;
    icon: IconDefinition | undefined;
};

export type MenuData = {
    x: number;
    y: number;
    level: number;

    items: MenuItem[];
};

export enum MenuPosition {
    Right,
    Bottom,
}

const hooks: any = {};

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
    openWindow: (path: string) => GADE.call('Window.Open', path),
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
    addHook: (channel: string, id: string, callback: Function) => {
        let channelHooks = hooks[channel];

        if (channelHooks === undefined) {
            // eslint-disable-next-line no-multi-assign
            channelHooks = hooks[channel] = {};

            GADE.receive(channel, (...args: any[]) =>
                GADE.callHook(channel, ...args),
            );
        }

        channelHooks[id] = callback;
    },
    callHook: (channel: string, ...args: any[]) =>
        Object.values(hooks[channel] || {}).forEach((hook: any) =>
            hook(...args),
        ),
};

export default GADE;
