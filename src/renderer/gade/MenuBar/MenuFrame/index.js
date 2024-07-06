import { useState } from 'react';
import { Container } from './Container';
import Item from './Item';
import Divider from './Divider';
import GADE from '../../gade';

GADE.hooks.dispatch('Menu.DataTransmit');

export default function MenuFrame(props) {
    const [menuData, setMenuData] = useState({});

    GADE.hooks.add('Menu.DataTransmit', `CTX${props.param}`, (data) => {
        setMenuData(data);
    });

    return (
        <Container>
            {menuData.items?.map((element) => {
                const dropdownEnabled =
                    Boolean(element.dropdown) && element.dropdown.length > 0;

                return element.divider ? (
                    <Divider />
                ) : (
                    <Item
                        label={element.label}
                        dropdown={dropdownEnabled}
                        icon={element.icon}
                        action={element.action}
                        onMouseEnter={(event) => {
                            const [x, y] = GADE.getElementMenuPosition(event);

                            if (dropdownEnabled) {
                                GADE.openMenu({
                                    x,
                                    y,
                                    level: menuData.level + 1,
                                    items: element.dropdown,
                                });
                            } else {
                                GADE.closeMenu(menuData.level + 1);
                            }
                        }}
                    />
                );
            })}
        </Container>
    );
}
