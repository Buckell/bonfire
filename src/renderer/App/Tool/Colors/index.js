import { useEffect, useState } from 'react';
import { Container } from './ColorSlider/Container';
import { Bonfire } from '../../bonfire';
import GADE from '../../../gade/gade';
import ColorSlider from './ColorSlider';
import Dropdown from '../../../gade/Dropdown';
import DropdownItem from '../../../gade/Dropdown/DropdownItem';

const change = {
    RGB: [
        ['red', undefined],
        ['green', undefined],
        ['blue', undefined],
    ],
    LAB: [
        ['lab.l', undefined],
        ['lab.a', (value) => value + 128],
        ['lab.b', (value) => value + 128],
    ],
    HSL: [
        ['hsl.h', undefined],
        ['hsl.s', (value) => value],
        ['hsl.l', (value) => value],
    ],
};

export default function Colors() {
    const [selected] = Bonfire.useSelectedChannels();
    const [data, setData] = useState({});
    const [profile, setProfile] = useState('RGB');
    const [colorChannels, setColorChannels] = useState([0, 0, 0]);

    useEffect(() => {
        if (selected.length > 0) {
            Bonfire.getChannel(selected[0]).then(setData);
        }
    }, [selected]);

    GADE.hooks.add(`Bonfire.Channel.Update`, `COLORS`, (channel, newData) => {
        if (channel === selected[0]) {
            setData(newData);
        }
    });

    useEffect(() => {
        const currentChannels = data?.attributes?.color?.[0].channels;

        if (currentChannels !== undefined) {
            switch (profile) {
                case 'RGB':
                    setColorChannels([
                        currentChannels.red,
                        currentChannels.green,
                        currentChannels.blue,
                    ]);
                    break;
                case 'LAB':
                    setColorChannels([
                        currentChannels['lab.l'],
                        currentChannels['lab.a'] - 128,
                        currentChannels['lab.b'] - 128,
                    ]);
                    break;
                case 'HSL':
                    setColorChannels([
                        currentChannels['hsl.h0'] + currentChannels['hsl.h1'],
                        currentChannels['hsl.s'],
                        currentChannels['hsl.l'],
                    ]);
                    break;
                default:
                    setColorChannels([0, 0, 0]);
                    break;
            }
        }
    }, [data, profile]);

    return (
        <Container>
            <>
                <Dropdown
                    style={{
                        margin: '0 0 0 10px',
                    }}
                    label="Profile"
                    value={profile}
                    onChange={setProfile}
                >
                    <DropdownItem label="RGB" />
                    <DropdownItem label="LAB" />
                    <DropdownItem label="HSL" />
                </Dropdown>
                <ColorSlider
                    value={colorChannels}
                    profile={profile}
                    onChange={(channelIndex, value) => {
                        const [channel, transform] =
                            change[profile][channelIndex];

                        if (selected.length > 0) {
                            if (channel === 'hsl.h') {
                                if (value > 255) {
                                    Bonfire.setChannelsAttributeChannel(
                                        selected,
                                        ['color', 0, 'hsl.h1'],
                                        value - 255,
                                    );
                                } else {
                                    Bonfire.setChannelsAttributeChannel(
                                        selected,
                                        ['color', 0, 'hsl.h0'],
                                        value,
                                    );
                                }
                            } else {
                                Bonfire.setChannelsAttributeChannel(
                                    selected,
                                    ['color', 0, channel],
                                    transform !== undefined
                                        ? transform(value)
                                        : value,
                                );
                            }
                        }

                        setColorChannels((oldChannels) => {
                            const newChannels = [...oldChannels];
                            newChannels[channelIndex] = value;
                            return newChannels;
                        });
                    }}
                />
            </>
        </Container>
    );
}
