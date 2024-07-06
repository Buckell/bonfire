import { useState } from 'react';
import { Container } from './Container';

export default function Input(props) {
    const {
        label,
        password,
        disabled,
        inputStyle,
        style,
        value,
        onChange,
        doubleClickRequired,
        readOnly,
        onBlur,
    } = props;

    const [readOnlyState, setReadOnlyState] = useState(
        doubleClickRequired || false,
    );

    return (
        <Container
            className={disabled && 'disabled'}
            style={{ ...style, marginTop: label ? '25px' : undefined }}
        >
            {label && <p>{label}</p>}
            <input
                type={password ? 'password' : 'text'}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...{ ...props, inputStyle: undefined, style: undefined }}
                style={inputStyle}
                className={readOnlyState ? 'read-only' : ''}
                readOnly={readOnly || readOnlyState}
                onDoubleClick={() => {
                    if (doubleClickRequired) {
                        setReadOnlyState(false);
                    }
                }}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        e.target.blur();
                    }
                }}
                onBlur={(e) => {
                    if (doubleClickRequired) {
                        setReadOnlyState(true);
                    }
                    onBlur?.(e);
                }}
            />
        </Container>
    );
}
