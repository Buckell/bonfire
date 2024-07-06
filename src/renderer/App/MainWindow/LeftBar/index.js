import { faListOl } from '@fortawesome/free-solid-svg-icons';
import { Container } from './Container';
import IconButton from '../../../gade/IconButton';
import Tooltip from '../../../gade/Tooltip';
import { Bonfire } from '../../bonfire';

export default function LeftBar() {
    return (
        <Container>
            <Tooltip label="Cues" pos={Tooltip.RIGHT} delay={0}>
                <IconButton
                    icon={faListOl}
                    buttonStyle={{ cursor: 'default' }}
                    onClick={() => {
                        Bonfire.getChannels().then(console.log);
                    }}
                />
            </Tooltip>
        </Container>
    );
}
