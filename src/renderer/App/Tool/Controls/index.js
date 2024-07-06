import { Container } from './Container';
import Fader from '../../component/Fader';
import { Bonfire } from '../../bonfire';
import { useEffect, useState } from 'react';

export default function Controls() {
    const [selectedChannels] = Bonfire.useSelectedChannels();

    const [intensity, setIntensity] = useState(70);

    useEffect(() => {
        if (selectedChannels > 0) {
            Bonfire.getChannel(selectedChannels[0]).then((channel) => {
                setIntensity(channel?.attributes?.intensity?.[0].channels.percent);
            });
        }
    }, [selectedChannels]);

    useEffect(() => {
        console.log(intensity);
        Bonfire.setChannelsAttributeChannel(
            selectedChannels,
            ['intensity', 0, 'percent'],
            intensity
        );
    }, [intensity]);

    return (
        <Container>
            <Fader
                label="Intensity"
                value={intensity}
                onChange={(e) => {
                    console.log('d');
                    setIntensity(parseInt(e.target.value, 10))
                }}
            />
        </Container>
    );
}
