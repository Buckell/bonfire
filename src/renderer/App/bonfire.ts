import { useDispatch, useSelector } from 'react-redux';
import GADE from '../gade/gade';
import { SerializedChannel } from '../../app_shared/Channel/SerializedChannel';
import { AttributeChannel } from '../../app_shared/Channel/ChannelConfiguration/AttributeChannel';
import { setSelectedChannels } from './reducers/app';
import { setUIConfigItem } from './reducers/uiConfig';
import {
    MainConfiguration as SacnMainConfiguration,
    RouteData,
    RouteData as SacnRouteData,
} from '../../app_shared/sacn';
import Device from '../../app_shared/Device';
import {
    DeviceData as DcsmDeviceData,
    MainConfiguration as DcsmMainConfiguration,
} from '../../app_shared/dcsm';

export const Bonfire = {
    getChannels: () =>
        GADE.call('Bonfire.Channels.Get') as Promise<{
            [channelNumber: number]: SerializedChannel;
        }>,
    getDevices: () =>
        GADE.call('Bonfire.Devices.Get') as Promise<{
            [id: string]: Device;
        }>,
    getChannel: (num: number) =>
        GADE.call('Bonfire.Channel.Get', num) as Promise<SerializedChannel>,
    setChannelAttributeChannel: (
        channel: number,
        attribute: AttributeChannel,
        value: number,
    ) => GADE.call('Bonfire.Channel.Set', channel, attribute, value),
    setChannelsAttributeChannel: (
        channels: number[],
        attribute: AttributeChannel,
        value: number,
    ) => GADE.call('Bonfire.Channel.SetMulti', channels, attribute, value),
    deleteChannel: (channelNumber: number) =>
        GADE.call('Bonfire.Channel.Delete', channelNumber),
    createChannel: (
        channelNumber: number,
        configuration: string,
        baseAddress: number,
    ) =>
        GADE.call(
            'Bonfire.Channel.Create',
            channelNumber,
            configuration,
            baseAddress,
        ),
    useSelectedChannels: () => {
        const dispatch = useDispatch();

        return [
            useSelector((state: any) => state.app.selectedChannels),
            (channels: number[]) => dispatch(setSelectedChannels(channels)),
        ];
    },
    useUIConfigItem: (item: string) => {
        const dispatch = useDispatch();

        return [
            useSelector((state: any) => state.uiConfig.config[item]),
            (value: any) => dispatch(setUIConfigItem([item, value])),
        ];
    },
    sACN: {
        getRoutes: () =>
            GADE.call('Bonfire.sACN.GetRoutes') as Promise<
                (SacnRouteData | undefined)[]
            >,
        createRoute: (data: RouteData) =>
            GADE.call('Bonfire.sACN.CreateRoute', data),
        deleteRoute: (id: number) => GADE.call('Bonfire.sACN.DeleteRoute', id),
        editRoute: (data: RouteData) =>
            GADE.call('Bonfire.sACN.EditRoute', data),
        setConfig: (data: SacnMainConfiguration) =>
            GADE.call('Bonfire.sACN.SetConfig', data),
        getConfig: () =>
            GADE.call(
                'Bonfire.sACN.GetConfig',
            ) as Promise<SacnMainConfiguration>,
    },
    DCSM: {
        getDevices: () =>
            GADE.call('Bonfire.DCSM.GetDevices') as Promise<{
                [port: string]: DcsmDeviceData;
            }>,
        refreshDevices: () => GADE.call('Bonfire.DCSM.RefreshDevices'),
        getConfig: () =>
            GADE.call('Bonfire.DCSM.GetConfig') as Promise<{
                [key: string]: string;
            }>,
        setConfig: (config: DcsmMainConfiguration) =>
            GADE.call('Bonfire.DCSM.SetConfig', config),
    },
};

GADE.hooks.dispatch('Bonfire.PlayMode.Changed');
GADE.hooks.dispatch('Bonfire.Channel.Update');
