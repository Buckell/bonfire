import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faDroplet, faGlobe, faHardDrive, faHashtag,
    faKeyboard,
    faListOl,
    faPlug
} from '@fortawesome/free-solid-svg-icons';
import CueList from './Tool/CueList';
import Channels from './Tool/Channels';
import Colors from './Tool/Colors';
import SacnOutput from './Tool/SacnOutput';
import DcsmOutput from './Tool/DcsmOutput';
import Patches from './Tool/Patches';

export const tools: any = {};

type ToolConfig = {
    title: string;
    icon: IconDefinition;
    window: any;
};

const addTool = (id: string, config: ToolConfig) => {
    tools[id] = config;
};

export const getMenuItems = () => {
    return Object.entries(tools).map(([id, data]: [string, any]) => [
        id,
        {
            label: data.title,
            icon: data.icon,
        },
    ]);
};

addTool('cues', {
    title: 'Cues',
    icon: faListOl,
    window: CueList,
});

addTool('channels', {
    title: 'Channels',
    icon: faHashtag,
    window: Channels,
});

addTool('patches', {
    title: 'Patches',
    icon: faPlug,
    window: Patches,
});

addTool('colors', {
    title: 'Colors',
    icon: faDroplet,
    window: Colors,
});

addTool('controls', {
    title: 'Controls',
    icon: faKeyboard,
    window: null,
});

addTool('sacn', {
    title: 'sACN',
    icon: faGlobe,
    window: SacnOutput,
});

addTool('artnet', {
    title: 'ArtNet',
    icon: faGlobe,
    window: null,
});

addTool('dcsm', {
    title: 'DCSM Devices',
    icon: faHardDrive,
    window: DcsmOutput,
});
