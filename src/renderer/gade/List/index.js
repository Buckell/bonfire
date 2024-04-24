import {Container} from "./Container";

export default function List(props) {
    return (
        <Container style={props.style}>
            {props.children}
        </Container>
    );
}