import { SerializedAttribute } from './attribute/SerializedAttribute';

export type SerializedChannel = {
    attributes: { [type: string]: SerializedAttribute[] };
    configuration: string;
    baseAddress?: number;
};
