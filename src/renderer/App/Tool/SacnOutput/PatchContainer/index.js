import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Container } from './Container';

export default function PatchContainer(props) {
    const { active, onClick, sourceUniverse, destinationUniverse, destination } = props;

    return (
        <Container className={active && 'active'} onClick={onClick}>
            <div>
                <h1>{sourceUniverse}</h1>
                <FontAwesomeIcon icon={faArrowRight} />
                <h1>{destinationUniverse}</h1>
            </div>
            <h2>{destination}</h2>
        </Container>
    );
}
