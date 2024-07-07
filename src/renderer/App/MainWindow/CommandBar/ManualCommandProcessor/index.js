import Input from '../../../../gade/Input';
import GADE from '../../../../gade/gade';

export default function ManualCommandProcessor() {
    const [command, setCommand] = GADE.shared.useValue('Bonfire.Command.Manual.Command', 'COMMAND_BAR');

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
            value={command}
            onChange={(e) => setCommand(e.target.value)}
        />
    );
}
