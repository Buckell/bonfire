import { IpcMainEvent } from 'electron';
import TRANSMISSION from './transmission';

const hooks: { [channel: string]: { [id: string]: Function } } = {};

const HOOKS = {
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
        HOOKS.add(channel, 'GADE.TRANSMISSION_BRIDGE', (...args: any[]) => {
            TRANSMISSION.broadcast(channel, ...args);
        });
    },
    dispatch: (channel: string) => {
        TRANSMISSION.receive(channel, (event: IpcMainEvent, ...args: any[]) => {
            HOOKS.call(channel, ...args);
        });
    },
    internal: hooks,
};

export default HOOKS;
