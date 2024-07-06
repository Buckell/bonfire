import { Dimmer } from '../Device/devices/Dimmer';
import { ChannelConfiguration } from '../Channel/ChannelConfiguration';

const configurationRegistry: { [key: string]: any } = {};

// eslint-disable-next-line no-return-assign
export const registerChannelConfiguration = (
    configuration: ChannelConfiguration,
) => {
    configurationRegistry[configuration.id] = configuration;
};

registerChannelConfiguration(Dimmer);

export default configurationRegistry;
