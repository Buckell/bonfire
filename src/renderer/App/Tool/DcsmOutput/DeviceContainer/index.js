import { Container } from './Container';

export default function DeviceContainer(props) {
    const { active, onClick, name, manufacturer, port } = props;

    return (
        <Container className={active && 'active'} onClick={onClick}>
            <div>
                <h1>{port}</h1>
            </div>
            <h2>{name} - {manufacturer}</h2>
        </Container>
    );
}
