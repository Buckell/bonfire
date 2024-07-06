import ColorEngine from 'colorjs.io';
import Attribute from '../Channel/attribute/Attribute';
import { mapRange } from '../util/mapRange';
import clamp from '../util/clamp';

export default class Color extends Attribute {
    static ID = 'color';

    type = Color.ID;

    name = 'Color';

    channelNames = [
        'red',
        'green',
        'blue',
        'hsl.h',
        'hsl.s',
        'hsl.l',
        'hsl.h0',
        'hsl.h1',
        'hsv.h',
        'hsv.s',
        'hsv.v',
        'hsv.h0',
        'hsv.h1',
        'lab.l',
        'lab.a',
        'lab.b',
    ];

    color = new ColorEngine('srgb', [0, 0, 0]);

    get channels(): { [channel: string]: number } {
        return {
            red: Math.floor(mapRange([0, 1], [0, 255], this.color.srgb.r)),
            green: Math.floor(mapRange([0, 1], [0, 255], this.color.srgb.g)),
            blue: Math.floor(mapRange([0, 1], [0, 255], this.color.srgb.b)),
            'hsl.h': Math.floor(mapRange([0, 360], [0, 255], this.color.hsl.h)),
            'hsl.s': Math.floor(this.color.hsl.s),
            'hsl.l': Math.floor(this.color.hsl.l),
            'hsl.h0': Math.floor(Math.min(this.color.hsl.h, 255)),
            'hsl.h1': Math.floor(Math.max(this.color.hsl.h - 255, 0)),
            'hsv.h': Math.floor(mapRange([0, 360], [0, 255], this.color.hsv.h)),
            'hsv.s': Math.floor(this.color.hsv.s),
            'hsv.v': Math.floor(this.color.hsv.v),
            'hsv.h0': Math.floor(Math.min(this.color.hsv.h, 255)),
            'hsv.h1': Math.floor(Math.max(this.color.hsv.h - 255, 0)),
            'lab.l': Math.floor(this.color.lab.l),
            'lab.a': Math.floor(this.color.lab.a + 128),
            'lab.b': Math.floor(this.color.lab.b + 128)
        };
    }

    getChannelValue(channel: string): number {
        let value;

        switch (channel) {
            case 'red':
                value = mapRange([0, 1], [0, 255], this.color.srgb.r);
                break;
            case 'green':
                value = mapRange([0, 1], [0, 255], this.color.srgb.g);
                break;
            case 'blue':
                value = mapRange([0, 1], [0, 255], this.color.srgb.b);
                break;
            case 'hsl.h':
                value = mapRange([0, 360], [0, 255], this.color.hsl.h);
                break;
            case 'hsl.s':
                value = this.color.hsl.s;
                break;
            case 'hsl.l':
                value = this.color.hsl.l;
                break;
            case 'hsl.h0':
                value = Math.min(this.color.hsl.h, 255);
                break;
            case 'hsl.h1':
                value = Math.max(this.color.hsl.h - 255, 0);
                break;
            case 'hsv.h':
                value = mapRange([0, 360], [0, 255], this.color.hsv.h);
                break;
            case 'hsv.s':
                value = this.color.hsv.s;
                break;
            case 'hsv.v':
                value = this.color.hsv.v;
                break;
            case 'hsv.h0':
                value = Math.min(this.color.hsv.h, 255);
                break;
            case 'hsv.h1':
                value = Math.max(this.color.hsv.h - 255, 0);
                break;
            case 'lab.l':
                value = this.color.lab.l;
                break;
            case 'lab.a':
                value = this.color.lab.a + 128;
                break;
            case 'lab.b':
                value = this.color.lab.b + 128;
                break;
            default:
                value = 0;
                break;
        }

        return Math.floor(value);
    }

    rawSetChannelValue(channel: string, value: number): void {
        const sanitizedValue = Math.floor(clamp(value, 0, 255));

        switch (channel) {
            case 'red':
                this.color.srgb.r = mapRange([0, 255], [0, 1], sanitizedValue);
                break;
            case 'green':
                this.color.srgb.g = mapRange([0, 255], [0, 1], sanitizedValue);
                break;
            case 'blue':
                this.color.srgb.b = mapRange([0, 255], [0, 1], sanitizedValue);
                break;
            case 'hsl.h':
                this.color.hsl.h = mapRange([0, 255], [0, 360], sanitizedValue);
                break;
            case 'hsl.s':
                this.color.hsl.s = sanitizedValue;
                break;
            case 'hsl.l':
                this.color.hsl.l = sanitizedValue;
                break;
            case 'hsl.h0':
                this.color.hsl.h = sanitizedValue;
                break;
            case 'hsl.h1':
                this.color.hsl.h = sanitizedValue + 255;
                break;
            case 'hsv.h':
                this.color.hsv.h = mapRange([0, 255], [0, 360], sanitizedValue);
                break;
            case 'hsv.s':
                this.color.hsv.s = sanitizedValue;
                break;
            case 'hsv.v':
                this.color.hsv.v = sanitizedValue;
                break;
            case 'hsv.h0':
                this.color.hsv.h = sanitizedValue;
                break;
            case 'hsv.h1':
                this.color.hsv.h = sanitizedValue + 255;
                break;
            case 'lab.l':
                this.color.lab.l = sanitizedValue;
                break;
            case 'lab.a':
                this.color.lab.a = sanitizedValue - 128;
                break;
            case 'lab.b':
                this.color.lab.b = sanitizedValue - 128;
                break;
            default:
                break;
        }
    }
}
