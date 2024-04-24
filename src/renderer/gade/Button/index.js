import { Container } from './Container';

export default function Button(props) {
    const { label, children, style, disabled } = props;

    return (
        <Container style={style} className={disabled && "disabled"}>
            {label && <p>{label}</p>}
            {/* eslint-disable-next-line react/button-has-type,react/jsx-props-no-spreading */}
            <button {...{ ...props, style: {} }}>{children}</button>
        </Container>
    );
}
