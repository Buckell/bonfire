import { Container } from './Container';
import Input from '../../../../gade/Input';
import { useEffect, useState } from 'react';
import GADE from '../../../../gade/gade';
import { Bonfire } from '../../../bonfire';
import clamp from '../../../../../app_shared/util/clamp';

export default function DimmerBlock(props) {
    const { channel, value, selected, onClick, initialData } = props;

    const [data, setData] = useState(initialData);

    const [intensity, setIntensity] = useState(
        `${initialData.attributes.intensity?.[0].channels.percent}`,
    );

    useEffect(() => {
        setIntensity(`${data.attributes.intensity?.[0].channels.percent}`);
    }, [data]);

    useEffect(() => {
        GADE.hooks.add(
            `Bonfire.Channel.Update`,
            `DB${channel}`,
            (num, newData) => {
                if (num === channel) {
                    setData(newData);
                }
            },
        );
    }, [channel]);

    return (
        <Container className={selected && 'active'} onClick={onClick}>
            <h1>{channel}</h1>
            {/* <h2>{value}</h2> */}
            <Input
                style={{
                    height: '40px',
                    borderRadius: 0,
                }}
                inputStyle={{
                    textAlign: 'center',
                    fontSize: '12pt',
                    background: '#222',
                }}
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                onBlur={() =>
                    Bonfire.setChannelAttributeChannel(
                        channel,
                        ['intensity', 0, 'percent'],
                        clamp(parseInt(intensity, 10) || 0, 0, 100),
                    )
                }
                onClick={(e) => {
                    if (!e.currentTarget.readOnly) {
                        e.stopPropagation();
                    }
                }}
                doubleClickRequired
            />
        </Container>
    );
}
