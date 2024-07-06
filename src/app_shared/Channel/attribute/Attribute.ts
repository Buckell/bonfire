import { SerializedAttribute } from './SerializedAttribute';
import UpdateChannel from './UpdateChannel';

export default abstract class Attribute {
    parentChannel: UpdateChannel;

    protected constructor(channel: UpdateChannel) {
        this.parentChannel = channel;
    }

    abstract get type(): string;

    abstract get name(): string;

    abstract get channelNames(): string[];

    abstract get channels(): { [name: string]: number };

    abstract getChannelValue(channel: string): number;

    abstract rawSetChannelValue(channel: string, value: number): void;

    setChannelValue(channel: string, value: number): void {
        this.rawSetChannelValue(channel, value);
        this.parentChannel.dispatchUpdates();
    }

    serialize(): SerializedAttribute {
        return {
            channels: this.channels,
        };
    }
}
