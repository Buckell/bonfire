import { readdir, readFile } from 'node:fs/promises';
import { resolve, basename } from 'path';
import { loadChannelConfiguration } from './channelConfigurationLoader';
import GADE from '../../gade';
import Device from '../../../app_shared/Device';
import { registerDevice } from '../devices';
import { Dimmer } from '../../../app_shared/Device/devices/Dimmer';

const devicesPath = resolve('./library/devices');

export const loadDeviceInfoFile = (file: string) => {
    return (
        readFile(file)
            .then((contents) => JSON.parse(String(contents)))
            // eslint-disable-next-line no-console
            .catch(console.error)
    );
};

export const loadDeviceConfiguration = (id: string, data: any): Device => {
    const config = loadChannelConfiguration(id, data);

    const device = new Device(id, data, config);

    // eslint-disable-next-line no-console
    console.log(`[BONFIRE] DEVICE LOADED: "${device.name}" (${device.id})`);

    registerDevice(device);

    return device;
};

export const loadDeviceDirectory = (directory: string) => {
    return loadDeviceInfoFile(resolve(directory, 'info.json')).then(
        (data: any) => {
            const id = basename(directory);
            return loadDeviceConfiguration(id, data);
        },
    );
};

(async () => {
    readdir(devicesPath)
        .then((devicePaths) => {
            return Promise.all(
                devicePaths.map((directory) =>
                    loadDeviceDirectory(resolve(devicesPath, directory)),
                ),
            ).then(() => GADE.hooks.call('Bonfire.Device.FilesLoaded'));
        })
        // eslint-disable-next-line no-console
        .catch(console.error);
})();

loadDeviceConfiguration('dimmer_simple', Dimmer);
