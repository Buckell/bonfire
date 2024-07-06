import { useState } from 'react';
import Input from '../../../gade/Input';
import Typography from '../../../gade/Typography';
import { Slider } from './Slider';
import { Container } from './Container';

export default function Fader(props) {
    const {style, defaultValue, value, min, max, onChange, label, color} = props;

    const [internalValue, setInternalValue] = useState(
        defaultValue || min || 0,
    );

    const controlled = value !== undefined;

    const currentValue = controlled ? value : internalValue;

    const valueChanged = (e) => {
        if (controlled) {
            onChange?.(e);
        } else {
            setInternalValue(e.target.value);
        }
    };

    return (
        <Container style={style}>
            <Typography
                margin="0"
                marginTop="10px"
                fontSize="8pt"
                textAlign="center"
                color="#dddddd"
            >
                {label || 'Fader'}
            </Typography>
            <Slider
                type="range"
                min={min || 0}
                max={max || 100}
                value={currentValue}
                onChange={valueChanged}
            />
            <Input
                style={{
                    position: 'absolute',
                    width: '50px',
                    bottom: '10px',
                    left: '5px',
                }}
                inputStyle={{
                    textAlign: 'center',
                }}
                value={currentValue}
                onChange={valueChanged}
            />
        </Container>
    );
}
