import { PlayMode } from '../../app_shared/bonfire';
import GADE from '../gade';
import Channel from '../../app_shared/Channel';
import { SerializedChannel } from '../../app_shared/Channel/SerializedChannel';
import { AttributeChannel } from '../../app_shared/Channel/ChannelConfiguration/AttributeChannel';

import './loaders/deviceLoader';
import configurationRegistry from '../../app_shared/channel_configurations/configurationRegistry';
import sACN from './outputs/sacn';
import {
    MainConfiguration as SacnMainConfiguration,
    RouteData as SacnRouteData,
} from '../../app_shared/sacn';
import { devices } from './devices';
import DCSM from './outputs/dcsm';
import { MainConfiguration as DcsmMainConfiguration } from '../../app_shared/dcsm';
import { SharedValue } from '../shared';
import ControlCommandProcessor from './command_processing/ControlCommandProcessor';
import ManualCommandProcessor from './command_processing/ManualCommandProcessor';
import { CommandMode } from './command_processing/CommandMode';
import ProjectHandler from './project/ProjectHandler';
import fs from 'node:fs/promises';
import { DIRECTORIES } from './directories';

GADE.hooks.bridge('Bonfire.PlayMode.Changed');
GADE.hooks.bridge('Bonfire.Channel.Update');

export default class Bonfire {
    universes: { [num: number]: Buffer } = {};

    channels: { [channelNumber: number]: Channel } = {};

    sacnOutput?: sACN;

    dcsmOutput?: DCSM;

    commandMode: SharedValue<string> = GADE.shared.use(
        'Bonfire.CommandMode',
        CommandMode.Control,
    );

    controlCommandProcessor: ControlCommandProcessor =
        new ControlCommandProcessor();

    manualCommandProcessor: ManualCommandProcessor =
        new ManualCommandProcessor();

    projectHandler: ProjectHandler = new ProjectHandler();

    playMode: SharedValue<PlayMode> = this.projectHandler.useDataStoreValue(
        'config',
        'PlayMode',
        PlayMode.Live,
    );

    directories: SharedValue<{ [key: string]: string }> = GADE.shared.use(
        'Bonfire.Directories',
        DIRECTORIES,
    );

    toolWindowCount = GADE.shared.use(
        'Bonfire.ToolWindow.Count',
        2,
    );

    toolWindowTabLayout: SharedValue<string[]>[] = [];
    toolWindowCurrentTab: SharedValue<string>[] = [];

    constructor() {
        this.createDirectories();
        this.setupClientDataHandlers();

        this.createChannel(1, 'dimmer_simple', 1);
        const third = this.createChannel(3, 'dimmer_simple', 2);
        third.attributes.intensity[0].setChannelValue('percent', 80);

        GADE.hooks.add('Bonfire.Device.FilesLoaded', 'PAR', () => {
            const par = this.createChannel(5, 'etc_colorsource_par', 10);

            par.attributes.color[0].setChannelValue('lab.l', 50);

            this.createChannel(6, 'etc_colorsource_par', 15);
            this.createChannel(9, 'etc_colorsource_par', 20);
            this.createChannel(10, 'etc_colorsource_par', 25);
        });

        this.sacnOutput = new sACN(this);
        this.sacnOutput.start();

        this.dcsmOutput = new DCSM(this);

        this.toolWindowCount.onChange('BONFIRE_TOOL_WINDOW_COUNT', this.resizeToolWindows.bind(this));
        this.resizeToolWindows(this.toolWindowCount.value);
    }

    resizeToolWindows(newSize: number) {
        const disposedWindows = this.toolWindowTabLayout.splice(newSize);
        this.toolWindowTabLayout.splice(newSize);

        disposedWindows.forEach((windowTabs) => {
            windowTabs.value = [];
        });

        if (newSize > this.toolWindowTabLayout.length) {
            for (let i = this.toolWindowTabLayout.length; i < newSize; ++i) {
                this.toolWindowTabLayout.push(
                    this.projectHandler.useDataStoreValue(
                        'config',
                        `ToolWindow.Layout[${i}]`,
                        [],
                    ),
                );

                this.toolWindowCurrentTab.push(
                    this.projectHandler.useDataStoreValue(
                        'config',
                        `ToolWindow.CurrentTab[${i}]`,
                        '',
                    ),
                );
            }
        }
    }

    createChannel(
        channelNumber: number,
        configuration: string,
        baseAddress?: number,
    ): Channel {
        // eslint-disable-next-line no-return-assign
        return (this.channels[channelNumber] = new Channel(
            channelNumber,
            configurationRegistry[configuration],
            this,
            baseAddress,
        ));
    }

    deleteChannel(channelNumber: number) {
        delete this.channels[channelNumber];
    }

    setChannelAttributeChannel(
        channelNumber: number,
        attributeChannel: AttributeChannel,
        value: number,
    ) {
        const channel = this.channels[channelNumber];

        if (channel) {
            const [type, index, attrChannel] = attributeChannel;

            channel.attributes[type][index].setChannelValue(attrChannel, value);
        }
    }

    createDirectories() {
        Promise.all(Object.values(DIRECTORIES).map((path) => fs.mkdir(path)))
            .then(() => {
                console.log('[BONFIRE] Directories created.');
            })
            .catch(() => {
                console.log(
                    '[BONFIRE] Directory Creation: Directories exist or permission denied.',
                );
            });
    }

    setChannelsAttributeChannel(
        channelNumbers: number[],
        attributeChannel: AttributeChannel,
        value: number,
    ) {
        channelNumbers.forEach((channelNumber: number) => {
            const channel = this.channels[channelNumber];

            if (channel) {
                const [type, index, attrChannel] = attributeChannel;
                // eslint-disable-next-line prettier/prettier

                channel.attributes[type]?.[index]?.setChannelValue?.(
                    attrChannel,
                    value,
                );
            }
        });
    }

    setupClientDataHandlers() {
        GADE.register('Bonfire.Channels.Get', () => {
            const serializedChannels: { [num: number]: SerializedChannel } = {};

            Object.entries(this.channels).forEach(
                ([num, channel]: [any, Channel]) => {
                    serializedChannels[num] = channel.serialize();
                },
            );

            return serializedChannels;
        });

        GADE.register('Bonfire.Devices.Get', () => devices);

        GADE.register(
            'Bonfire.Channel.Get',
            (num: number) => this.channels[num]?.serialize(),
        );

        GADE.register(
            'Bonfire.Channel.Set',
            this.setChannelAttributeChannel.bind(this),
        );

        GADE.register(
            'Bonfire.Channel.SetMulti',
            this.setChannelsAttributeChannel.bind(this),
        );

        GADE.register('Bonfire.Channel.Delete', this.deleteChannel.bind(this));

        GADE.register(
            'Bonfire.Channel.Create',
            (
                channelNumber: number,
                configuration: string,
                baseAddress: number,
            ) => {
                this.createChannel(channelNumber, configuration, baseAddress);
            },
        );

        GADE.register(
            'Bonfire.sACN.GetRoutes',
            () => this.sacnOutput?.getRoutes(),
        );

        GADE.register(
            'Bonfire.sACN.CreateRoute',
            (data: SacnRouteData) => this.sacnOutput?.addRoute(data),
        );

        GADE.register(
            'Bonfire.sACN.DeleteRoute',
            (id: number) => this.sacnOutput?.deleteRoute(id),
        );

        GADE.register(
            'Bonfire.sACN.EditRoute',
            (data: SacnRouteData) => this.sacnOutput?.editRoute(data),
        );

        GADE.register(
            'Bonfire.sACN.SetConfig',
            (data: SacnMainConfiguration) => {
                if (this.sacnOutput === undefined) {
                    return;
                }

                this.sacnOutput.framerate = data.framerate;
            },
        );

        GADE.register('Bonfire.sACN.GetConfig', () => ({
            framerate: this.sacnOutput?.framerate,
        }));

        GADE.register(
            'Bonfire.DCSM.GetDevices',
            () => this.dcsmOutput?.getDevices(),
        );

        GADE.register(
            'Bonfire.DCSM.RefreshDevices',
            () => this.dcsmOutput?.refreshDevices(),
        );

        GADE.register('Bonfire.DCSM.GetConfig', () => ({
            framerate: this.dcsmOutput?.framerate,
        }));

        GADE.register(
            'Bonfire.DCSM.SetConfig',
            (config: DcsmMainConfiguration) => {
                if (this.dcsmOutput === undefined) {
                    return;
                }

                this.dcsmOutput.framerate = config.framerate;
            },
        );
    }

    getUniverse(universe: number) {
        let currentUniverse = this.universes[universe];

        if (currentUniverse === undefined) {
            // eslint-disable-next-line no-multi-assign
            currentUniverse = this.universes[universe] = Buffer.alloc(512);
        }

        return currentUniverse;
    }
}
