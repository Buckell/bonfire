import { ChannelConfiguration } from './ChannelConfiguration';
import Attribute from './attribute/Attribute';
import attributeRegistry from '../attribute_types/attributeRegistry';
import { SerializedChannel } from './SerializedChannel';
import { SerializedAttribute } from './attribute/SerializedAttribute';
import { deconstructMasterAddress } from '../address/addressTranslation';
import UniverseProvider from './UniverseProvider';
import UpdateChannel from './attribute/UpdateChannel';
import GADE from '../../main/gade';

export default class Channel implements UpdateChannel {
    channelNumber: number;

    configuration: ChannelConfiguration;

    attributes: { [type: string]: Attribute[] } = {};

    universeProvider: UniverseProvider;

    baseAddress?: number;

    constructor(
        channelNumber: number,
        configuration: ChannelConfiguration,
        universeProvider: UniverseProvider,
        baseAddress?: number,
    ) {
        this.channelNumber = channelNumber;
        this.configuration = configuration;
        this.universeProvider = universeProvider;
        this.setBaseAddress(baseAddress);

        this.populateAttributes();
    }

    setBaseAddress(address?: number) {
        if (address && address > 0) {
            this.baseAddress = address;
        }
    }

    generateAddressValues() {
        return this.configuration.addressMappings.map(
            ([attributeType, attributeIndex, attributeChannel]) =>
                this.attributes[attributeType]?.[
                    attributeIndex
                ].getChannelValue(attributeChannel),
        );
    }

    dispatchUpdates(): void {
        if (this.baseAddress === undefined) {
            return;
        }

        const [universe, address] = deconstructMasterAddress(this.baseAddress);

        const universeBuffer: Buffer =
            this.universeProvider.getUniverse(universe);

        Buffer.from(this.generateAddressValues()).copy(
            universeBuffer,
            address - 1,
        );

        GADE.hooks.call(
            'Bonfire.Channel.Update',
            this.channelNumber,
            this.serialize(),
        );
    }

    populateAttributes() {
        this.attributes = {};

        Object.entries(this.configuration.attributeDefinitions).forEach(
            ([type, definitions]) => {
                const generatedAttributes: Attribute[] = [];

                definitions.forEach(() => {
                    const Attr: any = attributeRegistry[type];
                    generatedAttributes.push(new Attr(this));
                });

                this.attributes[type] = generatedAttributes;
            },
        );
    }

    serialize(): SerializedChannel {
        const serializedAttributes: { [type: string]: SerializedAttribute[] } =
            {};

        Object.entries(this.attributes).forEach(([type, attributes]) => {
            serializedAttributes[type] = attributes.map((attribute) =>
                attribute.serialize(),
            );
        });

        return {
            attributes: serializedAttributes,
            configuration: this.configuration.id,
            baseAddress: this.baseAddress,
        };
    }
}
