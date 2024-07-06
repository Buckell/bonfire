import { Container } from './Container';

export default function Table(props) {
    return (
        <Container style={props.style}>
            {props.children}
        </Container>
    )
}
