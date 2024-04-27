import { faDroplet, faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { Container } from './Container';
import AddButton from './AddButton';
import GADE from '../../../../../gade/gade';
import { getMenuItems, tools } from '../../../../tools';
import Tab from './Tab';

export default function Tabs(props) {
    const { children, id } = props;

    return (
        <Container
            onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY < 0 ? -50 : 50;
            }}
            className="hidden-scroll"
        >
            <AddButton
                onClick={(event) => {
                    const [x, y] = GADE.getElementMenuPosition(event);

                    GADE.openMenu({
                        x,
                        y,
                        level: 0,
                        items: getMenuItems().map(([itemId, item]) => ({
                            ...item,
                            action: `ToolWindow.${id}.Open.${itemId}`,
                        })),
                    });
                }}
            />
            {children}
        </Container>
    );
}
