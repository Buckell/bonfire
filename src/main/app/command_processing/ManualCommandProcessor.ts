import { SharedValue } from '../../shared';

export default class ManualCommandProcessor {
    command: SharedValue<string[]> = new SharedValue<string[]>('Bonfire.Command.Manual.Command', []);

    constructor() {
    }
}
