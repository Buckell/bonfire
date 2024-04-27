import { useState } from 'react';
import { Container } from './Container';
import Button from '../../../gade/Button';
import Typography from '../../../gade/Typography';
import { PlayMode } from '../../../../app_shared/bonfire';
import GADE from '../../../gade/gade';

export default function TopBar() {
    const [playMode, setPlayMode] = useState(PlayMode.Live);

    const playModeConfiguration = {};

    playModeConfiguration[PlayMode.Live] = {
        title: 'Live',
        buttonColor: '#911',
        barColor: '#811',
    };

    playModeConfiguration[PlayMode.Blind] = {
        title: 'Blind',
        buttonColor: '#13B',
        barColor: '#13A',
    };

    const currentConfiguration = playModeConfiguration[playMode];

    const changePlayMode = () => {
        GADE.send(
            'Bonfire.PlayMode.Set',
            playMode === PlayMode.Live ? PlayMode.Blind : PlayMode.Live,
        );
    };

    GADE.addHook('Bonfire.PlayMode.Changed', 'PlayModeButton', setPlayMode);

    return (
        <Container
            style={{
                borderTop: `solid 2px ${currentConfiguration.barColor}`,
            }}
        >
            <div>
                <div
                    style={{
                        paddingLeft: '10px',
                    }}
                >
                    <Typography
                        display="block"
                        fontWeight="300"
                        fontSize="12pt"
                        margin="0"
                    >
                        Rumors 2023
                    </Typography>
                    <Typography
                        display="block"
                        fontWeight="300"
                        fontSize="8pt"
                        color="#bbb"
                        margin="2px 0 2px 0"
                    >
                        Changes saved.
                    </Typography>
                </div>
            </div>
            <div>
                <Button onClick={changePlayMode}>
                    <span
                        style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '7px',
                            background: `${currentConfiguration.buttonColor}`,
                            borderRadius: '100%',
                            margin: '0 8px 1px 0',
                        }}
                    />
                    {currentConfiguration.title}
                </Button>
            </div>
        </Container>
    );
}
