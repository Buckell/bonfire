import { ChannelDisplayEntry } from './ChannelDisplayEntry';

export type AttributeDisplayEntry = {
    type: string;
    index: number;
    channels: ChannelDisplayEntry[];
};
