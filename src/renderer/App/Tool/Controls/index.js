import { useEffect, useState } from 'react';
import { Container } from './Container';
import Fader from '../../component/Fader';
import { Bonfire } from '../../bonfire';
import clamp from '../../../../app_shared/util/clamp';

export default function Controls() {
    const [selectedChannels] = Bonfire.useSelectedChannels();

    const [intensity, setIntensity] = useState(70);

    useEffect(() => {
        if (selectedChannels > 0) {
            Bonfire.getChannel(selectedChannels[0]).then((channel) => {
                setIntensity(
                    channel?.attributes?.intensity?.[0].channels.percent,
                );
            });
        }
    }, [selectedChannels]);

    useEffect(() => {
        Bonfire.setChannelsAttributeChannel(
            selectedChannels,
            ['intensity', 0, 'percent'],
            intensity,
        );
    }, [intensity, selectedChannels]);

    return (
        <Container>
            <Fader
                label="Intensity"
                value={intensity}
                onChange={(e) => {
                    const inputNumber = parseInt(e.target.value, 10);
                    clamp(
                        setIntensity(
                            Number.isNaN(inputNumber) ? 0 : inputNumber,
                        ) || 0,
                        0,
                        100,
                    );
                }}
            />
        </Container>
    );
}
