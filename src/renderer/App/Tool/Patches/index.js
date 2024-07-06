import { useEffect, useState } from 'react';
import { faAdd, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Container } from './Container';
import { Bonfire } from '../../bonfire';
import Input from '../../../gade/Input';
import IconButton from '../../../gade/IconButton';
import Tooltip from '../../../gade/Tooltip';
import { NewPatchPanel } from './NewPatchPanel';
import Typography from '../../../gade/Typography';
import Dropdown from '../../../gade/Dropdown';
import DropdownItem from '../../../gade/Dropdown/DropdownItem';
import Button from '../../../gade/Button';
import GADE from '../../../gade/gade';
import { DialogIcon } from '../../../../gade_shared/dialog';

export default function Patches() {
    const [channels, setChannels] = useState({});
    const [configurations, setConfigurations] = useState({});
    const [patchMenuVisible, setPatchMenuVisible] = useState(false);

    const [patchChannel, setPatchChannel] = useState('');
    const [patchType, setPatchType] = useState('');
    const [patchAddress, setPatchAddress] = useState('');

    const refreshChannels = () => {
        // eslint-disable-next-line no-console
        Bonfire.getChannels().then(setChannels).catch(console.error);
    };

    const refreshChannelConfigurations = () => {
        Bonfire.getDevices()
            .then(setConfigurations)
            // eslint-disable-next-line no-console
            .catch(console.error);
    };

    useEffect(refreshChannelConfigurations, []);
    useEffect(refreshChannels, []);

    const channelEntries = Object.entries(channels);

    const requestUnpatch = (channelNum) => {
        const channelType =
            configurations[channels[channelNum]?.configuration]?.name;

        GADE.openDialog(
            {
                title: 'Confirm Unpatch',
                description: `Are you sure you want to remove channel ${channelNum} (${channelType})?`,
                options: [
                    {
                        label: 'Unpatch',
                        action: 'unpatch',
                    },
                    {
                        label: 'Cancel',
                        action: 'close',
                    },
                ],
            },
            (id, action) => {
                GADE.closeDialog(id);

                if (action === 'unpatch') {
                    Bonfire.deleteChannel(channelNum).then(refreshChannels);
                }
            },
        );
    };

    const requestPatch = () => {
        const channelNum = parseInt(patchChannel, 10);
        const baseAddress = parseInt(patchAddress, 10);
        const channelTypeRegex = patchType.match(/\((.+)\)/);
        const channelType =
            channelTypeRegex === null || channelTypeRegex.length < 2
                ? undefined
                : channelTypeRegex[1];

        if (Number.isNaN(channelNum)) {
            GADE.openDialog(
                {
                    title: 'Error',
                    description: 'Specified channel number is invalid.',
                    icon: DialogIcon.Warning,
                    options: [
                        {
                            label: 'Okay',
                            action: 'close',
                        },
                    ],
                },
                (id) => GADE.closeDialog(id),
            );

            return;
        }

        if (Number.isNaN(baseAddress)) {
            GADE.openDialog(
                {
                    title: 'Error',
                    description: 'Specified base address is invalid.',
                    icon: DialogIcon.Warning,
                    options: [
                        {
                            label: 'Okay',
                            action: 'close',
                        },
                    ],
                },
                (id) => GADE.closeDialog(id),
            );
        }

        if (channelType === undefined) {
            GADE.openDialog(
                {
                    title: 'Error',
                    description:
                        'No selected device type or device type invalid.',
                    icon: DialogIcon.Warning,
                    options: [
                        {
                            label: 'Okay',
                            action: 'close',
                        },
                    ],
                },
                (id) => GADE.closeDialog(id),
            );

            return;
        }

        const addressCollisions = new Set([]);

        // Detect address collisions.
        const channelDevice = configurations[channelType];

        const channelAddresses = [
            ...Array(
                channelDevice?.channelConfiguration.addressMappings.length,
            ).keys(),
        ].map((address) => address + baseAddress);

        channelEntries.forEach(([num, channel]) => {
            const device = configurations[channel.configuration];
            const addressWidth =
                device?.channelConfiguration.addressMappings.length;

            const addresses = [...Array(addressWidth).keys()].map(
                (address) => address + channel.baseAddress,
            );

            addresses.forEach((address) => {
                if (channelAddresses.includes(address)) {
                    addressCollisions.add(num);
                }
            });
        });

        if (addressCollisions.size > 0 && !(addressCollisions.size === 1 && !addressCollisions.has(channelNum))) {
            GADE.openDialog(
                {
                    title: 'Address Collision',
                    description:
                        `The addresses of this channel collide with the addresses of existing channels (${Array.from(addressCollisions).join(', ')}). Change the base address or move the existing channels.`,
                    icon: DialogIcon.Warning,
                    options: [
                        {
                            label: 'Okay',
                            action: 'close',
                        },
                    ],
                    size: [400, 170],
                },
                (id) => GADE.closeDialog(id),
            );

            return;
        }

        if (Object.keys(channels).includes(`${channelNum}`)) {
            GADE.openDialog(
                {
                    title: 'Confirm Overwrite',
                    description: `Channel ${channelNum} already exists. Would you like to overwrite it?`,
                    options: [
                        {
                            label: 'Overwrite',
                            action: 'confirm',
                        },
                        {
                            label: 'Cancel',
                            action: 'close',
                        },
                    ],
                },
                (id, action) => {
                    GADE.closeDialog(id);

                    if (action === 'confirm') {
                        Bonfire.createChannel(
                            channelNum,
                            channelType,
                            baseAddress,
                        ).then(refreshChannels);
                    }
                },
            );
        } else {
            Bonfire.createChannel(
                channelNum,
                channelType,
                baseAddress,
            ).then(refreshChannels);
        }
    };

    return (
        <Container>
            <Tooltip pos={Tooltip.LEFT} label="New Patch" delay={0}>
                <IconButton
                    icon={faAdd}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                    }}
                    onClick={() => setPatchMenuVisible(true)}
                />
            </Tooltip>

            <table>
                <thead>
                    <tr>
                        <th>Channel</th>
                        <th>Device Type</th>
                        <th>Address</th>
                        <th>Width</th>
                    </tr>
                </thead>
                <tbody>
                    {channelEntries.map(([num, channel], index) => {
                        const device = configurations[channel.configuration];
                        const top = index === 0;
                        const bottom = index === channelEntries.length - 1;

                        return (
                            <tr>
                                <td>
                                    <Input
                                        value={num}
                                        style={{
                                            width: '60px',
                                            borderRadius: 0,
                                            borderTopLeftRadius: top
                                                ? '7px'
                                                : 0,
                                            borderTopRightRadius: 0,
                                            borderBottomLeftRadius: bottom
                                                ? '7px'
                                                : 0,
                                            borderBottomRightRadius: 0,
                                        }}
                                        inputStyle={{
                                            background: '#050505',
                                            textAlign: 'center',
                                            fontSize: '12pt',
                                            fontWeight: 400,
                                            color: '#ffffff',
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        value={device?.name}
                                        style={{
                                            width: '200px',
                                            borderRadius: 0,
                                        }}
                                        inputStyle={{
                                            textAlign: 'center',
                                            fontSize: '12pt',
                                            fontWeight: 400,
                                            color: '#ffffff',
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        value={channel.baseAddress}
                                        style={{
                                            width: '60px',
                                            borderRadius: 0,
                                        }}
                                        inputStyle={{
                                            textAlign: 'center',
                                            fontSize: '12pt',
                                            fontWeight: 400,
                                            color: '#ffffff',
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        value={
                                            device?.channelConfiguration
                                                .addressMappings.length
                                        }
                                        style={{
                                            width: '60px',
                                            borderRadius: 0,
                                        }}
                                        inputStyle={{
                                            textAlign: 'center',
                                            fontSize: '12pt',
                                            fontWeight: 400,
                                            color: '#ffffff',
                                        }}
                                    />
                                </td>
                                <td>
                                    <Button
                                        style={{
                                            width: '80px',
                                            borderRadius: 0,
                                            borderTopRightRadius: top
                                                ? '7px'
                                                : 0,
                                            borderBottomRightRadius: bottom
                                                ? '7px'
                                                : 0,
                                        }}
                                        buttonStyle={{
                                            color: '#A71',
                                        }}
                                        onClick={() => requestUnpatch(num)}
                                    >
                                        Unpatch
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Button
                style={{
                    marginLeft: '20px',
                    marginBottom: '20px',
                }}
                onClick={() => setPatchMenuVisible(true)}
            >
                Patch
            </Button>
            <NewPatchPanel
                style={{
                    display: patchMenuVisible ? 'initial' : 'none',
                }}
            >
                <IconButton
                    icon={faXmark}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                    }}
                    onClick={() => setPatchMenuVisible(false)}
                />

                <Typography fontSize="14pt" marginBottom="50px">
                    Patch Channel
                </Typography>

                <Input
                    label="Channel #"
                    style={{
                        marginBottom: '10px',
                    }}
                    value={patchChannel}
                    onChange={(e) => setPatchChannel(e.target.value)}
                />

                <Dropdown
                    label="Device Type"
                    style={{
                        marginBottom: '10px',
                    }}
                    value={patchType}
                    onChange={setPatchType}
                >
                    {Object.entries(configurations).map(([id, device]) => (
                        <DropdownItem label={`${device.name} (${id})`} />
                    ))}
                </Dropdown>

                <Input
                    label="Base Address"
                    style={{
                        marginBottom: '20px',
                    }}
                    value={patchAddress}
                    onChange={(e) => setPatchAddress(e.target.value)}
                />

                <Button onClick={requestPatch}>Patch</Button>
            </NewPatchPanel>
        </Container>
    );
}
