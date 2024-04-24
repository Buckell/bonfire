import {Container} from "./Container";

export default function Menu(props) {
    return (
        <Container {...props}>
            <p>
                {props.title}
            </p>
        </Container>
    );
}
