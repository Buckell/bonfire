import {Container} from "./Container";

export default function DropdownItem(props) {
    return (
        <Container {...props}>
            {props.children || props.label}
        </Container>
    );
}