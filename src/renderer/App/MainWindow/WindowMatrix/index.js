import { Container } from './Container';
import ToolWindow from './ToolWindow';

export default function WindowMatrix() {
    return (
        <Container>
            <ToolWindow
                style={{
                    width: '50%',
                    height: '100%',
                }}
                id={1}
            />
            <ToolWindow
                style={{
                    width: '50%',
                    height: '100%',
                }}
                id={2}
            />
        </Container>
    );
}
