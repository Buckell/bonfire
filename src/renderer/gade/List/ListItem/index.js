import {Container} from "./Container";

export default function ListItem(props) {
    return (
        <Container
            style={props.style}
            className={(props.selectable && " selectable ") + (props.selected && " selected ")}
            {...props}
        >
            {props.children}
        </Container>
    );
}