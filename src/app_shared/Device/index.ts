import { ChannelConfiguration } from '../Channel/ChannelConfiguration';
import { AttributeDisplayEntry } from './AttributeDisplayEntry';

export type DeviceData = {
    id: string;
    name: string;
    manufacturer: string;
    attribute_display: AttributeDisplayEntry[];
};

export default class Device {
    id: string;

    name: string;

    manufacturer: string;

    channelConfiguration: ChannelConfiguration;

    attributeDisplay: AttributeDisplayEntry[];

    constructor(
        id: string,
        data: DeviceData,
        channelConfiguration: ChannelConfiguration,
    ) {
        this.id = id;
        this.name = data.name;
        this.manufacturer = data.manufacturer;
        this.attributeDisplay = data.attribute_display;

        this.channelConfiguration = channelConfiguration;
    }
}
