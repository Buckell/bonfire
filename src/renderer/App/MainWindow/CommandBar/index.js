import { useState } from 'react';
import { Container } from './Container';
import Button from '../../../gade/Button';
import Input from '../../../gade/Input';
import Tooltip from '../../../gade/Tooltip';
import ControlCommandProcessor from './ControlCommandProcessor';
import ManualCommandProcessor from './ManualCommandProcessor';
import GADE from '../../../gade/gade';
import { CommandMode } from '../../../../main/app/command_processing/CommandMode';

export default function CommandBar() {
    const [mode, setMode] = GADE.shared.useValue('Bonfire.CommandMode', 'COMMAND_BAR');

    const switchMode = () =>
        setMode(mode === CommandMode.Control ? CommandMode.Manual : CommandMode.Control);

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
                            width: '90px',
                        }}
                        buttonStyle={{
                            cursor: 'default',
                        }}
                        onClick={switchMode}
                    >
                        {mode === CommandMode.Control ? 'CONTROL' : 'MANUAL'}
                    </Button>
                </Tooltip>
                {
                    mode === CommandMode.Control ?
                    <ControlCommandProcessor /> :
                    <ManualCommandProcessor />
                }
            </div>
        </Container>
    );
}
