import Attribute from '../Channel/attribute/Attribute';
import clamp from '../util/clamp';
import UpdateChannel from '../Channel/attribute/UpdateChannel';

export default class Intensity extends Attribute {
    static ID = 'intensity';

    type = Intensity.ID;

    name = 'Intensity';

    channelNames = ['base', 'percent'];

    intensity: number;

    get channels(): { [channel: string]: number } {
        return {
            base: this.intensity,
            percent: Math.floor((this.intensity / 255) * 100),
        };
    }

    constructor(channel: UpdateChannel, initialIntensity: number = 0) {
        super(channel);

        this.intensity = initialIntensity;
    }

    getChannelValue(channel: string): number {
        switch (channel) {
            case 'percent':
                return Math.floor((this.intensity / 255) * 100);
            default:
                return this.intensity;
        }
    }

    rawSetChannelValue(channel: string, value: number): void {
        const sanitizedValue = Math.floor(value);

        switch (channel) {
            case 'percent':
                this.intensity = (clamp(sanitizedValue, 0, 100) / 100) * 255;
                break;
            default:
                this.intensity = clamp(sanitizedValue, 0, 255);
                break;
        }
    }
}
