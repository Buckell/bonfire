import { useEffect, useState } from 'react';
import { Container } from './Container';
import { Bonfire } from '../../bonfire';
import DimmerBlock from './DimmerBlock';
import ComplexFixtureBlock from './ComplexFixtureBlock';
import FixtureEntry from './ComplexFixtureBlock/FixtureEntry';

export default function Channels() {
    const [channels, setChannels] = useState({});
    const [selected, setSelected] = Bonfire.useSelectedChannels();
    const [configurations, setConfigurations] = useState({});

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

    const escapeChannelSelection = () => {
        const keyPressListener = (e) => {
            if (e.key === 'Escape') {
                setSelected([]);
            }
        };

        window.addEventListener('keydown', keyPressListener);

        return () => {
            window.removeEventListener('keydown', keyPressListener);
        };
    };

    useEffect(refreshChannelConfigurations, []);
    useEffect(refreshChannels, []);
    useEffect(escapeChannelSelection, [setSelected]);

    const elements = [];
    let categoryChildren = [];
    let category = '';

    Object.entries(channels).forEach(([num, channelData]) => {
        const { configuration } = channelData;
        const channelNumber = parseInt(num, 10);

        if (configuration === 'dimmer_simple') {
            elements.push(
                <DimmerBlock
                    channel={parseInt(num, 10)}
                    initialData={channelData}
                    selected={selected.includes(channelNumber)}
                    onClick={() => {
                        if (selected.includes(channelNumber)) {
                            setSelected(
                                selected.filter(
                                    (selectedNum) =>
                                        selectedNum !== channelNumber,
                                ),
                            );
                        } else {
                            setSelected([...selected, channelNumber]);
                        }
                    }}
                />,
            );
        } else {
            if (category !== configuration) {
                if (category !== '') {
                    elements.push(
                        <ComplexFixtureBlock
                            device={configurations[configuration]}
                        >
                            {categoryChildren}
                        </ComplexFixtureBlock>,
                    );
                }

                category = configuration;
                categoryChildren = [];
            }

            categoryChildren.push(
                <FixtureEntry
                    channel={channelNumber}
                    initialData={channelData}
                />,
            );
        }
    });

    if (categoryChildren.length > 0) {
        elements.push(
            <ComplexFixtureBlock device={configurations[category]}>
                {categoryChildren}
            </ComplexFixtureBlock>,
        );
    }

    return <Container>{elements}</Container>;
}
