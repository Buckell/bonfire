import { Container } from './Container';

export default function Button(props) {
    const { label, children, style, disabled, buttonStyle } = props;

    return (
        <Container style={style} className={disabled && "disabled"}>
            {label && <p>{label}</p>}
            {/* eslint-disable-next-line react/button-has-type */}
            <button
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...{ ...props, style: {}, buttonStyle: undefined }}
                style={buttonStyle}
            >
                {children}
            </button>
        </Container>
    );
}
