import { Container } from './Container';

export default function Input(props) {
    const { label, password, disabled } = props;

    return (
        <Container className={disabled && "disabled"}>
            {label && <p>{label}</p>}
            <input type={password ? "password" : "text"} {...props} />
        </Container>
    );
}
