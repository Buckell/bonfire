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
};

export default GADE;
