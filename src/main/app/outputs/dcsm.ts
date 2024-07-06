import { DeviceData, PortData, PortMode } from '../../../app_shared/dcsm';
import UniverseProvider from '../../../app_shared/Channel/UniverseProvider';

type DeviceEntry = {
    ports: PortData[];
};

export default class DCSM {
    universeProvider: UniverseProvider;

    devices: { [port: string]: DeviceEntry } = {};

    framerate: number = 40;

    constructor(universeProvider: UniverseProvider) {
        this.universeProvider = universeProvider;
    }

    refreshDevices() {}

    getDevices(): { [port: string]: DeviceData } {
        return {
            COM20: {
                port: 'COM20',
                name: 'Proton',
                manufacturer: 'Goddard Systems',
                ports: [
                    {
                        portNumber: 1,
                        mode: PortMode.Output,
                        universe: 1,
                    },
                    {
                        portNumber: 3,
                        mode: PortMode.Output,
                        universe: 1,
                    },
                ],
            },
        };
    }
}
