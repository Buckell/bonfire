import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from './Container';
import Typography from '../../../../../../gade/Typography';

export default function Tab(props) {
    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Container {...{...props, icon: undefined }} className={(props.active ? "active tab" : "tab")}>
            <div>
                <FontAwesomeIcon icon={props.icon} />
                <p title="">{props.title}</p>
            </div>
        </Container>
    )
}
