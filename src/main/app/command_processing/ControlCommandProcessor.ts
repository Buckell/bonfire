import { SharedValue } from '../../shared';
import GADE from '../../gade';

export default class ControlCommandProcessor {
    static MAPPINGS: { [key: string]: string } = {
        a: 'Address',
        c: 'Channel',
        f: 'Full',
        o: 'Out',
        p: 'Patch',
        t: 'Thru',
        q: 'Cue',
        r: 'Record',
        '+': '+',
        '-': '-',
        '@': '@',
    };

    commandParts: SharedValue<string[]> = new SharedValue<string[]>('Bonfire.Command.Control.Parts', []);

    constructor() {
        GADE.register('Bonfire.Command.Control.ProcessInput', this.processInput.bind(this));
    }

    processInput(key: string) {
        if (this.commandParts.value === undefined || this.commandParts.value === null) {
            this.commandParts.value = [];
        }

        if (key === 'Delete') {
            this.commandParts.value = [];
            return;
        }

        const commandParts = this.commandParts.value;

        if (key === 'Backspace' && commandParts.length > 0) {
            const lastPart = commandParts[commandParts.length - 1];

            // Check if last entry is a number.
            if ('0123456789'.includes(lastPart[0])) {
                if (lastPart.length === 1) {
                    // Remove entire entry if only one digit remains.
                    this.commandParts.value = commandParts.slice(0, -1);
                } else {
                    // Remove last digit from last entry.
                    this.commandParts.value = [
                        ...commandParts.slice(0, -1),
                        lastPart.slice(0, -1),
                    ];
                }
                return;
            }

            this.commandParts.value = commandParts.slice(0, -1);
            return;
        }

        const addition = ControlCommandProcessor.MAPPINGS[key];

        // If key is mapped to a keyword, add it to query.
        if (addition !== undefined) {
            this.commandParts.value = [...commandParts, addition];
            return;
        }

        // User entering number.
        if ('0123456789'.includes(key)) {
            const lastPart = commandParts[commandParts.length - 1];

            // See if last entry is a number.
            if (commandParts.length > 0 && '0123456789'.includes(lastPart[0])) {
                // Concat entered digit to last number entry.
                const newParts = [...commandParts];
                newParts[newParts.length - 1] += key;
                this.commandParts.value = newParts;
            } else {
                // Add entry with entered number.
                this.commandParts.value = [...commandParts, key];
            }
        }
    }
}

