import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from './Container';

export default function AddButton(props) {
    return (
        <Container {...props}>
            <FontAwesomeIcon icon={faAdd} />
        </Container>
    );
}
