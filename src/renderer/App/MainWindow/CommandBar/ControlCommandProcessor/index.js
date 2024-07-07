import { useState } from 'react';
import Input from '../../../../gade/Input';
import GADE from '../../../../gade/gade';

export default function ControlCommandProcessor() {
    const [parts, setParts] = GADE.shared.useValue('Bonfire.Command.Control.Parts', 'COMMAND_BAR');

    const processInput = (key) => {
        GADE.call('Bonfire.Command.Control.ProcessInput', key);
    }

    return (
        <Input
            style={{
                position: 'absolute',
                left: '90px',
                width: 'calc(100% - 90px)',
                borderRadius: '0',
                fontWeight: '400',
                fontSize: '12pt',
                paddingTop: 0,
                paddingBottom: 0,
            }}
            inputStyle={{
                fontFamily: '"Courier", monospace',
            }}
            value={parts?.join?.(' ')}
            onKeyDown={(e) => processInput(e.key)}
            noEnterBlur
        />
    );
}
