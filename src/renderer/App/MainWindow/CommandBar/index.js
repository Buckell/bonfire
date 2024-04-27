import { useState } from 'react';
import { Container } from './Container';
import Button from '../../../gade/Button';
import Input from '../../../gade/Input';
import Tooltip from '../../../gade/Tooltip';

export default function CommandBar() {
    const [mode, setMode] = useState('QUICK');

    const switchMode = () =>
        setMode((m) => {
            return m === 'MANUAL' ? 'QUICK' : 'MANUAL';
        });

    return (
        <Container>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '30px',
                }}
            >
                <Tooltip label="Command Mode" pos={Tooltip.BOTTOM_RUNRIGHT}>
                    <Button
                        style={{
                            position: 'absolute',
                            left: 0,
                            height: '30px',
                            borderRadius: '0',
                            width: '80px',
                        }}
                        buttonStyle={{
                            cursor: 'default',
                        }}
                        onClick={switchMode}
                    >
                        {mode}
                    </Button>
                </Tooltip>
                <Input
                    style={{
                        position: 'absolute',
                        left: '80px',
                        width: 'calc(100% - 80px)',
                        borderRadius: '0',
                        fontWeight: '400',
                        fontSize: '11pt',
                        paddingTop: 0,
                        paddingBottom: 0,
                    }}
                />
            </div>
        </Container>
    );
}
