import TRANSMISSION from './transmission';

class SharedValue<T> {
    internalValue: T | null | undefined = undefined;

    constructor(initialValue: T | null | undefined) {
        this.internalValue = initialValue;
    }

    get value() {
        return this.internalValue;
    }

    set value(newValue: T | null | undefined) {
        this.internalValue = newValue;

        TRANSMISSION.broadcast('Shared.Changed');
    }
}

export const values: { [id: string]: SharedValue<any> } = {};

const SHARED = {
    use: <T>(id: string, value: T | null | undefined) => {
        if (values[id] === undefined) {
            const sharedValue: SharedValue<T> = new SharedValue<T>(value);
            values[id] = sharedValue;
            return sharedValue;
        }

        return values[id];
    },
    internal: values,
};

TRANSMISSION.register('Shared.Retrieve', (id: string) => {
    const sharedValue: SharedValue<any> | undefined = values[id];

    if (sharedValue) {
        return sharedValue.value;
    }

    return undefined;
});

TRANSMISSION.register('Shared.Set', (id: string, value: any) => {
    const sharedValue: SharedValue<any> | undefined = values[id];

    if (sharedValue) {
        sharedValue.value = value;
    }
});

export default SHARED;
