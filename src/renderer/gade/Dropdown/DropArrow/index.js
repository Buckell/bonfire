import {Container} from "./Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleLeft} from "@fortawesome/free-solid-svg-icons";

export default function DropArrow(props) {
    return (
        <Container>
            <FontAwesomeIcon icon={faAngleDown} />
        </Container>
    );
}