import { PlayMode } from '../../app_shared/bonfire';
import GADE from '../gade';

export default class Bonfire {
    playMode: PlayMode = PlayMode.Live;

    universes: Buffer[] = [];


    constructor() {
        this.setupPlayModeReceiver();
    }

    setPlayMode(mode: PlayMode) {
        this.playMode = mode;
        GADE.broadcast('Bonfire.PlayMode.Changed', mode);
    }

    setupPlayModeReceiver() {
        GADE.receive('Bonfire.PlayMode.Set', (e, mode: PlayMode) =>
            this.setPlayMode(mode),
        );
    }

    getUniverse(universe: number) {
        let currentUniverse = this.universes[universe];

        if (currentUniverse === undefined) {
            // eslint-disable-next-line no-multi-assign
            currentUniverse = this.universes[universe] = Buffer.alloc(512);
        }

        return currentUniverse;
    }
}
