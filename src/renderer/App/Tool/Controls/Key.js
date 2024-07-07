import Button from '../../../gade/Button';

export default function Key(props) {
    const {children, onClick, text} = props;

    return (
        <Button
            style={{
                borderRadius: '2px',
                width: '50px',
                marginRight: '5px',
            }}
            buttonStyle={{
                height: '50px',
                fontSize: text ? '7pt' : '12pt',
                padding: 0
            }}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}
