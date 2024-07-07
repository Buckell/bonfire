import { useEffect, useState } from 'react';
import { Container } from './Container';
import Fader from '../../component/Fader';
import { Bonfire } from '../../bonfire';
import clamp from '../../../../app_shared/util/clamp';
import { KeyContainer } from './KeyContainer';
import { KeyRow } from './KeyRow';
import Key from './Key';
import GADE from '../../../gade/gade';

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

    const input = (key) => {
        return () => {
            GADE.call('Bonfire.Command.Control.ProcessInput', key);
        };
    }

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
                style={{
                    marginRight: '10px',
                }}
            />
            <Fader
                label="Grandmaster"
                style={{
                    marginRight: '10px',
                }}
            />
            <Fader
                label="Master"
            />
            <br />
            <KeyContainer>
                <KeyRow>
                    <Key onClick={input('c')} text>Channel</Key>
                    <Key onClick={input('q')} text>Cue</Key>
                    <Key onClick={input('r')} text>Record</Key>
                </KeyRow>
                <KeyRow>
                    <Key onClick={input('a')} text>Address</Key>
                    <Key onClick={input('p')} text>Patch</Key>
                </KeyRow>
                <KeyRow>
                    <Key onClick={input('Delete')} text>Clear</Key>
                </KeyRow>
            </KeyContainer>
            <KeyContainer>
                <KeyRow>
                    <Key onClick={input('+')}>+</Key>
                    <Key onClick={input('-')}>-</Key>
                    <Key>/</Key>
                    <Key onClick={input('t')}>Thru</Key>
                </KeyRow>
                <KeyRow>
                    <Key onClick={input('7')}>7</Key>
                    <Key onClick={input('8')}>8</Key>
                    <Key onClick={input('9')}>9</Key>
                    <Key onClick={input('f')}>Full</Key>
                </KeyRow>
                <KeyRow>
                    <Key onClick={input('5')}>5</Key>
                    <Key onClick={input('6')}>6</Key>
                    <Key onClick={input('7')}>7</Key>
                    <Key onClick={input('o')}>Out</Key>
                </KeyRow>
                <KeyRow>
                    <Key onClick={input('1')}>1</Key>
                    <Key onClick={input('2')}>2</Key>
                    <Key onClick={input('3')}>3</Key>
                    <Key onClick={input('@')}>At</Key>
                </KeyRow>
            </KeyContainer>
        </Container>
    );
}
