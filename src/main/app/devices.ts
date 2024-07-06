import Device from '../../app_shared/Device';

export const devices: { [id: string]: Device } = {};

export const registerDevice = (device: Device) => {
    devices[device.id] = device;
};
