import TRANSMISSION from './transmission';
import HOOKS from './hooks';
import GADE from './gade';

export class SharedValue<T> {
    id: string;

    internalValue: T | null | undefined = undefined;

    constructor(id: string, initialValue: T | null | undefined) {
        this.id = id;
        this.internalValue = initialValue;
    }

    get value() {
        return this.internalValue;
    }

    set value(newValue: T | null | undefined) {
        this.internalValue = newValue;

        GADE.broadcast('Shared.Changed', this.id, newValue);
        HOOKS.call('Shared.Changed', this.id, newValue);
    }
}

export const values: { [id: string]: SharedValue<any> } = {};

const SHARED = {
    use: <T>(id: string, value: T | null | undefined) => {
        if (values[id] === undefined) {
            const sharedValue: SharedValue<T> = new SharedValue<T>(id, value);
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
        sharedValue.internalValue = value;
        HOOKS.call('Shared.Changed', id, value);
    }
});

export default SHARED;
