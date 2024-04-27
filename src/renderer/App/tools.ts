import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faDroplet, faGlobe, faHardDrive, faHashtag,
    faKeyboard,
    faListOl,
    faPlug
} from '@fortawesome/free-solid-svg-icons';
import CueList from './Tool/CueList';

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
    window: null,
});

addTool('patches', {
    title: 'Patches',
    icon: faPlug,
    window: null,
});

addTool('colors', {
    title: 'Colors',
    icon: faDroplet,
    window: null,
});

addTool('controls', {
    title: 'Controls',
    icon: faKeyboard,
    window: null,
});

addTool('sacn', {
    title: 'sACN',
    icon: faGlobe,
    window: null,
});

addTool('artnet', {
    title: 'ArtNet',
    icon: faGlobe,
    window: null,
});

addTool('dcsm', {
    title: 'DCSM Devices',
    icon: faHardDrive,
    window: null,
});
