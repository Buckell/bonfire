import { resolve, parse } from 'path';
import { readFile, readdir } from 'node:fs/promises';
import { registerChannelConfiguration } from '../../../app_shared/channel_configurations/configurationRegistry';
import AttributeDefinition from '../../../app_shared/Channel/attribute/AttributeDefinition';
import { parseAttributeChannel } from '../../../app_shared/Channel/ChannelConfiguration/AttributeChannel';
import { ChannelConfiguration } from '../../../app_shared/Channel/ChannelConfiguration';

export const loadChannelConfiguration = (
    id: string,
    // eslint-disable-next-line camelcase
    { attribute_definitions, name, address_mappings }: any,
) => {
    const attributeDefinitions: { [type: string]: AttributeDefinition[] } = {};

    Object.entries(attribute_definitions).forEach(
        ([type, attributes]: [string, any]) => {
            attributeDefinitions[type] = attributes.map(
                (attributeData: any) =>
                    new AttributeDefinition(
                        type,
                        attributeData.name,
                        attributeData.properties || {},
                    ),
            );
        },
    );

    const config: ChannelConfiguration = {
        id,
        name,
        attributeDefinitions,
        // eslint-disable-next-line camelcase
        addressMappings: address_mappings.map(parseAttributeChannel),
    };

    registerChannelConfiguration(config);

    return config;
};
