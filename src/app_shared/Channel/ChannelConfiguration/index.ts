import AttributeDefinition from '../attribute/AttributeDefinition';
import { AttributeChannel } from './AttributeChannel';

export type ChannelConfiguration = {
    id: string;
    name: string;
    attributeDefinitions: { [attributeType: string]: AttributeDefinition[] };
    addressMappings: AttributeChannel[];
};
