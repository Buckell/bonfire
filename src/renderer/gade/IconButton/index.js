import { Container } from './Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function IconButton(props) {
    const { label, icon, style, disabled, buttonStyle } = props;

    return (
        <Container style={style} className={disabled && "disabled"}>
            {/* eslint-disable-next-line react/button-has-type */}
            <button
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...{
                    ...props,
                    style: {},
                    buttonStyle: undefined,
                    icon: undefined,
                }}
                style={buttonStyle}
            >
                <FontAwesomeIcon icon={icon} />
            </button>
        </Container>
    );
}
