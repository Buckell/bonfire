import { AddressPack } from './AddressPack';

export const deconstructMasterAddress = (
    masterAddress: number,
): AddressPack => {
    if (masterAddress === 0) {
        return [0, 0];
    }

    const universe: number = Math.floor(Math.max(masterAddress - 1, 0) / 512);
    const address: number = masterAddress - universe * 512;

    return [universe + 1, address];
};

export const constructMasterAddress = (universe: number, address: number) =>
    (universe - 1) * 512 + address;
