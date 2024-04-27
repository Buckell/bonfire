import { Container } from './Container';

export default function Menu(props) {
    return (
        <Container {...props}>
            <p title="">{props.title}</p>
        </Container>
    );
}
