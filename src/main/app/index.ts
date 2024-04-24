import { Receiver as SacnReceiver } from 'sacn';
import { dmxnet as DmxNet, receiver as ArtNetReceiver } from 'dmxnet';
import GADE from '../gade';
import { connectDevices, Device as DcsmDevice } from './dcsm';

type Gateway = {
    device: string;
    port: number;
    method: string;
    universe: number;
    net: number;
    subnet: number;
};

let dcsmDevices: DcsmDevice[] = [];
let gateways: Gateway[] = [];

const dmxNetInstance = new DmxNet({
    sName: 'DCSM Gateway',
    lName: 'DCSM ArtNet/sACN to DCSM program.',
});

let sacnReceiver: SacnReceiver | null = null;
let artNetReceivers: ArtNetReceiver[] = [];

const setupSacnGateways = () => {
    const requisiteUniverses: number[] = [];

    gateways.forEach((gateway) => {
        if (gateway.method === 'sACN') {
            requisiteUniverses.push(gateway.universe);
        }
    });

    if (requisiteUniverses.length === 0) {
        if (sacnReceiver) {
            sacnReceiver.close(() => {
                sacnReceiver = null;
            });
        }

        return;
    }

    const setupPacketReceivers = () => {
        gateways.forEach((gateway) => {
            if (gateway.method === 'sACN') {
                const deviceMatches = dcsmDevices.filter(
                    (device) => device.portPath === gateway.device,
                );

                if (deviceMatches.length !== 1) {
                    return;
                }

                const device = deviceMatches[0];

                sacnReceiver?.on('packet', (packet) => {
                    if (packet.universe === gateway.universe) {
                        const payload = packet.payloadAsBuffer;

                        if (payload) {
                            device.setUniverseData(gateway.port, payload);
                        }
                    }
                });
            }
        });
    };

    if (sacnReceiver) {
        sacnReceiver.close(() => {
            sacnReceiver = new SacnReceiver({
                universes: requisiteUniverses,
            });

            setupPacketReceivers();
        });
    } else {
        sacnReceiver = new SacnReceiver({
            universes: requisiteUniverses,
        });

        setupPacketReceivers();
    }
};

const setupArtNetGateways = () => {
    artNetReceivers = [];

    gateways.forEach((gateway) => {
        if (gateway.method === 'ArtNet') {
            const receiver = dmxNetInstance.newReceiver({
                universe: gateway.universe,
                net: gateway.net,
                subnet: gateway.subnet,
            });

            const deviceMatches = dcsmDevices.filter(
                (device) => device.portPath === gateway.device,
            );

            if (deviceMatches.length !== 1) {
                return;
            }

            const device = deviceMatches[0];

            receiver.on('data', (data) => {
                device.setUniverseData(gateway.universe, data);
            });

            artNetReceivers.push(receiver);
        }
    });
};

const reloadGateways = () => {
    setupSacnGateways();
    setupArtNetGateways();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
GADE.register(
    'Gateway.GetDevices',
    () =>
        new Promise((resolve) => {
            resolve(
                dcsmDevices.map((device) => ({
                    name: device.name,
                    port: device.portPath,
                    ports: device.ports,
                })),
            );
        }),
);

let block = false;

GADE.register(
    'Gateway.ConnectDevices',
    () =>
        new Promise((resolve, reject) => {
            if (block) {
                resolve(null);
                return;
            }

            dcsmDevices.forEach((device) => {
                if (device.port?.isOpen) {
                    device.port?.close();
                }
            });

            dcsmDevices = [];

            connectDevices()
                .then((devices) => {
                    dcsmDevices = devices;

                    block = true;
                    setTimeout(() => {
                        block = false;
                    }, 5000);

                    resolve(null);
                    return null;
                })
                .catch((e) => {
                    reject(e);
                });
        }),
);

GADE.register('Gateway.GetGateways', () => gateways);

GADE.register('Gateway.ClearGateways', () => {
    gateways = [];
    reloadGateways();
});

GADE.register('Gateway.SetGateway', (gateway: Gateway) => {
    const currentGateway = gateways.filter(
        (g) => g.device === gateway.device && g.port === gateway.port,
    )?.[0];

    if (currentGateway) {
        Object.assign(currentGateway, gateway);
    } else {
        gateways.push(gateway);
    }

    reloadGateways();
});
