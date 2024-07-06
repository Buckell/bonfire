const { Sender } = require('sacn');
const { parentPort } = require('node:worker_threads');

let sender;

parentPort?.on('message', ([type, data]) => {
    switch (type) {
        case 'dispatch': {
            data.payload = Buffer.from(data.payload);
            if (sender) {
                sender.send(data);
            }
            break;
        }
        case 'create': {
            const { universe, destination } = data;

            if (sender) {
                sender.close();
            }

            sender = new Sender({
                universe,
                reuseAddr: true,
                useUnicastDestination:
                    destination !== 'multicast' ? destination : undefined,
                defaultPacketOptions: {
                    sourceName: 'Bonfire',
                    cid: Buffer.from([
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                    ]),
                },
            });
            break;
        }
        case 'destroy':
            sender.close();
            parentPort.postMessage('closed');
            break;
        default:
            break;
    }
});
