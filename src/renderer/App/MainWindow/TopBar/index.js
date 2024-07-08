import { Container } from './Container';
import Button from '../../../gade/Button';
import Typography from '../../../gade/Typography';
import { PlayMode } from '../../../../app_shared/bonfire';
import GADE from '../../../gade/gade';

export default function TopBar() {
    const [playMode, setPlayMode] = GADE.shared.useValue(
        'Bonfire.PlayMode',
        'TOPBAR',
    );

    const [projectName] = GADE.shared.useValue(
        'Bonfire.Project.Name',
        'TOPBAR',
    );

    const [projectSaveStatus] = GADE.shared.useValue(
        'Bonfire.Project.SaveStatus',
        'TOPBAR',
    );

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

    const togglePlayMode = () => {
        setPlayMode(
            playMode === PlayMode.Live ? PlayMode.Blind : PlayMode.Live,
        );
    };

    const saveStatusDescriptions = [
        'No changes.',
        'Unsaved changes.',
        'Writing changes...',
        'Saving...',
        'Changes saved.',
    ];

    return (
        <Container
            style={{
                borderTop: `solid 2px ${playModeConfiguration[playMode]?.barColor}`,
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
                        {projectName}
                    </Typography>
                    <Typography
                        display="block"
                        fontWeight="300"
                        fontSize="8pt"
                        color="#bbb"
                        margin="2px 0 2px 0"
                    >
                        {saveStatusDescriptions?.[projectSaveStatus]}
                    </Typography>
                </div>
            </div>
            <div>
                <Button onClick={togglePlayMode}>
                    <span
                        style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '7px',
                            background: `${playModeConfiguration[playMode]?.buttonColor}`,
                            borderRadius: '100%',
                            margin: '0 8px 1px 0',
                        }}
                    />
                    {playModeConfiguration[playMode]?.title}
                </Button>
            </div>
        </Container>
    );
}
