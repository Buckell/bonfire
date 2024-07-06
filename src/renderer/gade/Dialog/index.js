import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Container } from './Container';
import { ContentGrid } from './ContentGrid';
import Typography from '../Typography';
import { ButtonGrid } from './ButtonGrid';
import Button from '../Button';
import IconButton from '../IconButton';
import GADE from '../gade';
import { DialogIcons } from '../../../gade_shared/dialog';

export default function Dialog(props) {
    const { id, title, description, options, icon } = JSON.parse(props.param);

    return (
        <Container>
            <IconButton
                icon={faXmark}
                style={{
                    position: 'absolute',
                    right: '5px',
                    top: '5px',
                }}
                onClick={() => GADE.send('Dialog.Action', id, 'close')}
            />

            <ContentGrid>
                <div>
                    <FontAwesomeIcon icon={DialogIcons[icon || 0]} />
                </div>
                <div>
                    <Typography
                        fontSize="13pt"
                        fontWeight="400"
                        marginBottom="10px"
                        marginTop="0"
                    >
                        {title}
                    </Typography>

                    <Typography fontSize="10pt" marginTop="0">
                        {description}
                    </Typography>
                </div>
            </ContentGrid>
            <ButtonGrid>
                {options?.map((option) => (
                    <Button
                        onClick={() =>
                            GADE.send('Dialog.Action', id, option.action)
                        }
                    >
                        {option.label}
                    </Button>
                ))}
            </ButtonGrid>
        </Container>
    );
}
